import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import ShowDetailledModel from "../models/ShowDetailledModel"
import { Genres } from "../models/GenreModel"
import SeasonSection from "../components/showdetails/SeasonSection"
import SeasonModel from "../models/SeasonModel"

export default function Shows() {
    const params = useParams()
    const [currentShow, setCurrentShow] = useState<ShowDetailledModel>()

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

    return (
        <div>
            <div>
            <h1>{currentShow?.name}</h1>
            <p>{currentShow?.genres}</p>
            <p>{currentShow?.description}</p>
            <img src={currentShow?.image} alt={currentShow?.name} />
            </div>
            {
                currentShow?.seasonsInfos.map((seasonInfo, index) => (
                    <SeasonSection key={index} seasonInfo={seasonInfo} showId={currentShow.id}/>
                ))
            }
        </div>
    )
}