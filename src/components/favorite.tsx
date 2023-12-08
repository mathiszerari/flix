import { useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import ShowDetailledModel from '../models/ShowDetailledModel';
import { Genres } from '../models/GenreModel';
import SeasonModel from '../models/SeasonModel';
import ShowCard from './homepage/ShowCard';

const Loader = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="loader"></div>
  </div>
);

const Favorite = () => {
  const [showsData, setShowsData] = useState<ShowDetailledModel[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (auth.currentUser) {
          const userRef = collection(db, 'users');
          const q = query(userRef, where('email', '==', auth.currentUser.email));
          const querySnapshot = await getDocs(q);

          if (!querySnapshot.empty) {
            const userData = querySnapshot.docs[0].data();
            const userFavorites = userData.favorites || [];

            const promises = userFavorites.map(async (showId: any) => {
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
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div>
      <span className='text-3xl p-6'>Favorites</span>
      <div className="mt-4 flex flex-row flex-wrap justify-between gap-8">
        {showsData?.map((show: any) => (
          <ShowCard key={show.id} show={show}></ShowCard>
        ))}
      </div>
    </div>
  );
};

export default Favorite;