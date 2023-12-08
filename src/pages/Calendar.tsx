import moment from "moment";
import { useEffect, useState } from "react";
import { Episode } from "../models/EpisodeModel";
import { auth, db } from "../firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import CalendarShowCard from "../components/calendar/CalendarShowCard";
import EpisodeCard from "../components/showdetails/EpisodeCard";

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
    const [isDataLoaded, setIsDataLoaded] = useState(false)

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
        setIsDataLoaded(true)
        setWeekEpisodes(thisWeekEpisodes)


    }


    useEffect(() => {
        getWeeksShows()
    }, [])
    return (
        <div className="grid grid-cols-4 gap-4 items-center">
            {

                isDataLoaded ? (
                    weekEpisodes?.map((day, index) => (
                        <div key={index} className="mt-7">
    
                            <p className="text-2xl">{day.day.name}</p>
                            
                            <div className="min-h-[12rem] bg-zinc-800 rounded-xl mt-4 p-2 relative -z-10 flex flex-row gap-4">
                                {
                                    day.episodes.map((episode, index) => (
                                        <div className="w-fit">
                                            <EpisodeCard key={index} episode={episode}/>
                                        </div>
                                        
                                    ))
                                }
                            </div>
                        </div>
                    ))
                ) : (
                    <h1>Loading...</h1>
                )
                
            }
        </div>
    )
}