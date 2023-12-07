import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import ShowDetailledModel from "../models/ShowDetailledModel"
import { Genres } from "../models/GenreModel"
import SeasonSection from "../components/showdetails/SeasonSection"
import SeasonModel from "../models/SeasonModel"
import { addDoc, collection } from "firebase/firestore"
import { db } from "../firebase"

export default function Shows() {
    const params = useParams()
    const [currentShow, setCurrentShow] = useState<ShowDetailledModel>()
    const [favorite, setFavorite] = useState(false);

    const getCurrentShowData = async () => {
        try {
            const response = await fetch(`https://api.themoviedb.org/3/tv/${params.showId}?api_key=${process.env.REACT_APP_API_KEY}`)
            const data = await response.json()

            const formattedData: ShowDetailledModel = {
                id: data.id,
                name: data.name,
                image: `https://image.tmdb.org/t/p/w500/${data.backdrop_path}`,
                voteAverage: data.vote_average,
                description: data.overview,
                genres: data.genres.map((genre:Genres) => genre.name),
                seasonsInfos: data.seasons.filter(
                    (season: any)=> season.episode_count !== 0)
                    .map((season:any) => ({ seasonNumber:season.season_number, episodesCount: season.episode_count} as SeasonModel) )
            }
                        
            return formattedData

        } catch (error) {
            console.error(error)
        }
    }

    const setCurrentShowData = async () =>{
        const currentShowData = await getCurrentShowData()
        setCurrentShow(currentShowData)

    }

    useEffect(() => {
        setCurrentShowData()
    }, [])

    const addFavorite = async () => {
        try {
            setFavorite(!favorite)
            await addDoc(collection(db, "users"), {
                favorite: currentShow
              });
        } catch (error) {
            console.log('error');
        }
    }; 

    const cancelFavorite = () => {
        try {
            setFavorite(!favorite)
        } catch (error) {
            console.log('error');
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
                    <button onClick={cancelFavorite} type="button" className="text-white bg-gradient-to-br from-pink-500 to-orange-400 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">Followed</button>
                ) : (
                    <button onClick={addFavorite} type="button" className="text-gray-900 bg-gradient-to-r from-red-200 via-red-300 to-yellow-200 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-red-100 dark:focus:ring-red-400 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">Add to Favorite</button>
                )}     
            </div>
            {
                currentShow?.seasonsInfos.map((seasonInfo, index) => (
                    <SeasonSection key={index} seasonInfo={seasonInfo} showId={currentShow.id}/>
                ))
            }
        </div>
    )
}