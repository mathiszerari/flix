import { useEffect, useState } from "react";
import { useParams, useRouteLoaderData } from "react-router-dom";
import ShowDetailledModel from "../models/ShowDetailledModel";
import { Genres } from "../models/GenreModel";
import SeasonSection from "../components/showdetails/SeasonSection";
import SeasonModel from "../models/SeasonModel";
import { collection, doc, getDoc, updateDoc, query, where, getDocs } from "firebase/firestore";
import { auth, db } from "../firebase";
import { MdStar } from "react-icons/md";

export default function Shows() {
  const params = useParams();
  const [currentShow, setCurrentShow] = useState<ShowDetailledModel>();
  let [userFavorites, setUserFavorite] = useState([]);
  const [favorite, setFavorite] = useState(false);
  const currentUser = auth.currentUser;
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        if (auth.currentUser) {
          const userRef = collection(db, 'users');
          const q = query(userRef, where('email', '==', auth.currentUser.email));
          const querySnapshot = await getDocs(q);

          if (!querySnapshot.empty) {
            const userData = querySnapshot.docs[0].data();
            userFavorites = userData.favorites || [];
            setUserFavorite(userFavorites);
            console.log(userFavorites);
          }
        }
      } catch (error) {
        console.error('Error fetching favorites:', error);
      }
    };

    fetchFavorites();
  }, []);

  useEffect(() => {
    const checkAndFetchData = async () => {
      await checkFavorite();
    };

    checkAndFetchData();
  }, [params.showId, currentUser, currentShow, userFavorites]);


  useEffect(() => {
    const getCurrentShowData = async () => {
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/tv/${params.showId}?api_key=${process.env.REACT_APP_API_KEY}`
        );
        const data = await response.json();

        const formattedData: ShowDetailledModel = {
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

        setCurrentShow(formattedData);

        // Check if the show is in favorites when the component loads
        checkFavorite();
      } catch (error) {
        console.error(error);
      }
    };

    getCurrentShowData();
  }, [params.showId]);

  const checkFavorite = async () => {
    try {
      setLoading(true); // Démarre le loader

      if (currentUser) {
        const userDoc = doc(db, "users", currentUser.uid);
        const userSnapshot = await getDoc(userDoc);
        if (userSnapshot) {
          const fix = userFavorites!.find((id) => id === currentShow?.id);
          if (fix) {
            console.log('Ce show est dans ma liste');
            setFavorite(prevFavorite => {
              if (!prevFavorite) return true;
              return prevFavorite;
            });
          } else {
            console.log('Ce show n\'est pas dans ma liste');
          }
        }
      }
    } catch (error) {
      console.error("Error checking favorite:", error);
    } finally {
      setLoading(false); // Arrête le loader, que l'appel réussisse ou échoue
    }
  };

  const addFavorite = async () => {
    try {
      if (currentUser) {
        // Query for the user document based on email
        const q = query(collection(db, "users"), where("email", "==", currentUser.email));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const userDoc = querySnapshot.docs[0].ref;

          // Update the user document with the new favorite
          await updateDoc(userDoc, {
            favorites: [...(querySnapshot.docs[0].data().favorites || []), currentShow?.id],
          });

          // Update the local state
          setFavorite(true);
        } else {
          console.log("User document not found");
        }
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  const cancelFavorite = async () => {
    try {
      if (currentUser && currentShow) {
        // Query for the user document based on email
        const q = query(collection(db, "users"), where("email", "==", currentUser.email));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const userDoc = querySnapshot.docs[0].ref;

          // Check if currentShow.id is in the favorites array
          const updatedFavorites = (querySnapshot.docs[0].data().favorites || []).filter(
            (fav: number) => fav !== currentShow.id
          );

          // Update the user document with the new favorites
          await updateDoc(userDoc, { favorites: updatedFavorites });

          // Update the local state
          setFavorite(false);
        } else {
          console.log("User document not found");
          console.log('');

        }
      }
    } catch (error) {
      console.log("Error canceling favorite:", error);
    }
  };

  return (
    <div className="">
      {loading && <p>Loading...</p>}
      <div className="h-[50vh]">
        <div className="mt-96 flex flex-col gap-4">
          <h1 className="text-4xl font-bold">{currentShow?.name}</h1>
          <p>{currentShow?.genres.map((genre) => (<span>{genre} </span>))}| {currentShow?.voteAverage} <MdStar className="inline w-6 h-6 text-amber-400"/></p>
          <p className="w-[45%] shadow opacity-75">{currentShow?.description}</p>
        </div>
        <div className="absolute top-0 left-0 bg-gradient-to-t from-[#111111] to-transparent -z-10">
          <div className="bg-gradient-to-t from-[#111111] to-transparent">
            <img className="relative w-screen h-screen -z-20" src={currentShow?.image} alt={currentShow?.name} />
          </div>

        </div>

        <div className="p-4">
          {favorite ? (
            <button
              onClick={cancelFavorite}
              type="button"
              className="text-white bg-gradient-to-br from-pink-500 to-orange-400 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
            >
              Followed
            </button>
          ) : (
            <button
              onClick={addFavorite}
              type="button"
              className="text-gray-900 bg-gradient-to-r from-red-200 via-red-300 to-yellow-200 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-red-100 dark:focus:ring-red-400 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
            >
              Add to Favorite
            </button>
          )}
        </div>
      </div>


      <div>
        {currentShow?.seasonsInfos.map((seasonInfo, index) => (
          <SeasonSection key={index} seasonInfo={seasonInfo} showId={currentShow.id} />
        ))}
      </div>

    </div>
  );
}