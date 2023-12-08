import { useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { Episode } from '../models/EpisodeModel';
import EpisodeCard from './showdetails/EpisodeCard';
import { Genres } from '../models/GenreModel';
import SeasonModel from '../models/SeasonModel';

const Notification = ({ getNotification }: any) => {
  const [isLoading, setIsLoading] = useState(true);
  const [nextEpisodes, setNextEpisodes] = useState<Episode[]>([]);

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
      console.log(data.next_episode_to_air);
      
      return {
        id: data.show_id,
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
      const favoritesIds = await getUsersFavoritesIds();
      const nextEpisodesPromises = await favoritesIds.map((favoriteId: string) => getShowNextEpisodes(favoriteId));

      const nextEpisodes = await Promise.all(nextEpisodesPromises);

      const filteredNextEpisodes = nextEpisodes.filter((episode) => episode !== undefined);

      return filteredNextEpisodes;
    } catch (error) {
      console.error('Error fetching next episodes:', error);
    }
  }

  useEffect(() => {
    getUsersFavoritesNextEpisodes()
      .then((episodes) => {
        setNextEpisodes(
          episodes?.filter((episode) => {
            const date = new Date(episode.date);
            const now = new Date();
            const diffTime = Math.abs(now.getTime() - date.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            return diffDays <= 5;
          }) || []
        );
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    if (nextEpisodes.length > 0) {
      if (getNotification) getNotification(true);
    }
    console.log('nextEpisodes', nextEpisodes);
    
  }, [nextEpisodes, getNotification]);

  return (
    <div className='notification flex flex-col justify-center items-center p-4'>
      {isLoading &&
        <div className="flex items-center justify-center h-screen">
          <div className="loader"></div>
        </div>
      }



      <span className='text-xl text-gray-200'>{nextEpisodes.length} next episodes</span>
      {nextEpisodes.map((episode) => (
        <div className=' p-4 gap-4'>
          <div className='flex flex-col border border-gray-700'>
            <EpisodeCard key={episode.episodeNumber} episode={episode} />
          </div>
        </div>
      ))
      }
    </div>
  );
};

export default Notification;
