import { useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { Episode } from '../models/EpisodeModel';

const Loader = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="loader"></div>
  </div>
);

const Notification = ({ getNotification }: any) => {
  const [isLoading, setIsLoading] = useState(true);
  const [nextEpisodes, setNextEpisodes] = useState<undefined | any[]>(undefined);

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

      setIsLoading(false)

      return filteredNextEpisodes

    } catch (error) {
      console.error("error", error)
      console.log('salut');
      
    }

  }

  useEffect(() => {
    getUsersFavoritesNextEpisodes()
      .then((episodes) => {
        console.log("episodes", episodes)
        // filtre les épisodes qui sortent dans moins de 1j et met les dans une variable
        setNextEpisodes(episodes?.filter((episode) => {
          const date = new Date(episode.date)
          const now = new Date()
          const diffTime = Math.abs(now.getTime() - date.getTime());
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          return diffDays <= 2
        }))
        console.log("nextEpisodes", nextEpisodes);
      })
  }, [])

  useEffect(() => {
    if (nextEpisodes) {
      console.log("nextEpisodes", nextEpisodes);
      
      if (nextEpisodes.length > 0) {
        getNotification(true)
        console.log("TRUE");
      }
    }
      
  }, [nextEpisodes])

  if (isLoading) {
    return <Loader />
  }

  return (
    <div></div>
  )
};

export default Notification;