import { useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { Episode } from '../models/EpisodeModel';

const Loader = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="loader"></div>
  </div>
);

const Notification = () => {
  const [isLoading, setIsLoading] = useState(true);

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
    }

  }
  
  useEffect(() => {
    getUsersFavoritesNextEpisodes()
    .then((episodes) => {
      console.log("episodes", episodes)
    })
  }, [])
  
  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className='notification'>
      {isLoading ? <Loader /> : (
        <>
          <span className='text-xl text-gray-200 underline mt-10'>Notifs</span>
        </>
      )}
    </div>
  );
};

export default Notification;