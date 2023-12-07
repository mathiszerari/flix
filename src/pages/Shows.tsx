import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ShowDetailledModel from "../models/ShowDetailledModel";
import { Genres } from "../models/GenreModel";
import SeasonSection from "../components/showdetails/SeasonSection";
import SeasonModel from "../models/SeasonModel";
import { collection, doc, getDoc, setDoc, query, where, getDocs, updateDoc } from "firebase/firestore";  // Corrected imports
import { auth, db } from "../firebase";

export default function Shows() {
  const params = useParams();
  const [currentShow, setCurrentShow] = useState<ShowDetailledModel>();
  const [favorite, setFavorite] = useState(false);
  const currentUser = auth.currentUser;

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
      } catch (error) {
        console.error(error);
      }
    };

    getCurrentShowData();
  }, [params.showId]);

  useEffect(() => {
    const checkFavorite = async () => {
      if (currentUser) {
        try {
          const userDoc = doc(db, "users", currentUser.uid);
          const userSnapshot = await getDoc(userDoc);

          if (userSnapshot.exists()) {
            const userData = userSnapshot.data();
            setFavorite(userData.favorites?.includes(currentShow?.id) || false);
          }
        } catch (error) {
          console.error("Error checking favorite:", error);
        }
      }
    };

    checkFavorite();
  }, [currentUser, currentShow?.id]);

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

  const cancelFavorite = () => {
    try {
      if (currentUser) {
        const userDoc = doc(db, "users", currentUser.uid);

        setDoc(
          userDoc,
          {
            favorites: (currentUser.favorites || []).filter(
              (fav: number) => fav !== currentShow?.id
            ),
          },
          { merge: true }
        );

        setFavorite(false);
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  return (
    <div>
      <div>
        <h1>{currentShow?.name}</h1>
        <p>{currentShow?.genres}</p>
        <p>{currentShow?.description}</p>
        <img src={currentShow?.image} alt={currentShow?.name} />
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
      {currentShow?.seasonsInfos.map((seasonInfo, index) => (
        <SeasonSection key={index} seasonInfo={seasonInfo} showId={currentShow.id} />
      ))}
    </div>
  );
}
