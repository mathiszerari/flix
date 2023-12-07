import moment from "moment";
import { useEffect, useState } from "react";
import { Episode } from "../models/EpisodeModel";
import { auth, db } from "../firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import CalendarShowCard from "../components/calendar/CalendarShowCard";

interface WeekDay {
    name: string;
    date: string;
}

interface daysShows {
    day: WeekDay;
    episodes: Episode[]
}

const weekDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

export default function Calendar() {

    const [weekEpisodes, setWeekEpisodes] = useState<daysShows[]>()

    const getUsersFavoritesIds = async () => {
        try {
            if (auth.currentUser) {
                const userRef = collection(db, 'users');
                const q = query(userRef, where('email', '==', auth.currentUser.email));
                const querySnapshot = await getDocs(q);

                if (!querySnapshot.empty) {
                    const userData = querySnapshot.docs[0].data();
                    const userFavorites = userData.favorites || [];
                    return userFavorites
                }
            }
        } catch (error) {
            console.error('Error fetching favorites:', error);
        }
    }

    const getThisWeekDates = () => {
        let weekDates: WeekDay[] = [];

        for (let i = 1; i <= 7; i++) {
            weekDates.push({ name: weekDays[i - 1], date: moment().day(i).format('yyyy-MM-DD') });
        }

        return weekDates;
    }

    const getShowNextEpisodes = async (showId: string) => {
        const response = await fetch(`https://api.themoviedb.org/3/tv/${showId}?api_key=${process.env.REACT_APP_API_KEY}`)
        const data = await response.json()
        if (data.next_episode_to_air) {
            return {
                title: data.next_episode_to_air.name,
                image: `https://image.tmdb.org/t/p/w500${data.next_episode_to_air.still_path}`,
                date: data.next_episode_to_air.air_date,
                description: data.next_episode_to_air.overview,
                season: data.next_episode_to_air.season_number,
                episodeNumber: data.next_episode_to_air.episode_number,
            } as Episode
        }

    }

    const getUsersFavoritesNextEpisodes = async () => {
        try {
            const favoritesIds = await getUsersFavoritesIds()
            const nextEpisodesPromises = await favoritesIds.map((favoriteId: string) => getShowNextEpisodes(favoriteId))

            const nextEpisodes = await Promise.all(nextEpisodesPromises)

            const filteredNextEpisodes = nextEpisodes.filter((episode) => episode !== undefined)

            return filteredNextEpisodes

        } catch (error) {
            console.error("error", error)
        }

    }

    const getWeeksShows = async () => {
        let thisWeekEpisodes

        const weekDays = getThisWeekDates()

        const nextEpisodes = await getUsersFavoritesNextEpisodes()

        if (nextEpisodes) {
            thisWeekEpisodes = weekDays.map((weekDay) => ({ day: weekDay, episodes: nextEpisodes?.filter((episode) => episode.date === weekDay.date) }) as daysShows)
        }

        setWeekEpisodes(thisWeekEpisodes)


    }


    useEffect(() => {
        getWeeksShows()
    }, [])
    return (
        <div>
            <h1>Calendar</h1>
            {
                weekEpisodes?.map((day, index) => (
                    <div key={index}> 
                        {day.day.name}
                        <div>
                            {
                                day.episodes.map((episode, index) => (
                                    <CalendarShowCard key={index} episode={episode}/>
                                ))
                            }
                        </div>
                    </div>
                ))
            }
        </div>
    )
}