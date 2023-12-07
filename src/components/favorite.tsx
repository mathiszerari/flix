import { useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import ShowListSection from './homepage/ShowListSection';
import SeasonSection from './showdetails/SeasonSection';
import { useParams } from 'react-router-dom';
import ShowDetailledModel from '../models/ShowDetailledModel';
import { Genres } from '../models/GenreModel';
import SeasonModel from '../models/SeasonModel';

const Favorite = () => {
  const [favorites, setFavorites] = useState([]);
  const [showsData, setShowsData] = useState<ShowDetailledModel[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        if (auth.currentUser) {
          const userRef = collection(db, 'users');
          const q = query(userRef, where('email', '==', auth.currentUser.email));
          const querySnapshot = await getDocs(q);

          if (!querySnapshot.empty) {
            const userData = querySnapshot.docs[0].data();
            const userFavorites = userData.favorites || [];
            setFavorites(userFavorites);
          }
        }
      } catch (error) {
        console.error('Error fetching favorites:', error);
      }
    };

    fetchFavorites();
  }, []);

  useEffect(() => {
    const fetchShowsData = async () => {
      try {
        const promises = favorites.map(async (showId) => {
          const response = await fetch(
            `https://api.themoviedb.org/3/tv/${showId}?api_key=${process.env.REACT_APP_API_KEY}`
          );
          const data = await response.json();

          return {
            id: data.id,
            name: data.name,
            image: `https://image.tmdb.org/t/p/w500/${data.backdrop_path}`,
            voteAverage: data.vote_average,
            description: data.overview,
            genres: data.genres.map((genre: Genres) => genre.name),
            seasonsInfos: data.seasons
              .filter((season: any) => season.episode_count !== 0)
              .map(
                (season: any) =>
                  ({
                    seasonNumber: season.season_number,
                    episodesCount: season.episode_count,
                  } as SeasonModel)
              ),
          };
        });

        const showsDataArray = await Promise.all(promises);
        console.log('showsDataArray', showsDataArray);
        
        setShowsData(showsDataArray);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching shows data:', error);
      }
    };

    fetchShowsData();
  }, [favorites]);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <span className='text-3xl p-6'>Favorites</span>
      <div className='favorites grid grid-cols-3 gap-3'>
        {showsData.map((currentShow, index) => (
          <div key={index} className='show bg-gray-200 p-4 rounded-3xl'>
            <img src={currentShow?.image} alt={currentShow?.name} className='rounded-xl'/>
            <h1>{currentShow?.name}</h1>
            <p>{currentShow?.genres}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Favorite;