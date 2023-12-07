import { useContext, useEffect, useState } from "react"
import { useLocation, useParams } from "react-router-dom"
import { GenresContext } from "../context/GenresContext"
import ShowCard from "../components/homepage/ShowCard"
import { ShowMinimalModel } from "../models/ShowMinimalModel"

export default function SearchPage() {
    const genres = useContext(GenresContext)
    
    const location = useLocation()
    const queryParams = new URLSearchParams(location.search)
    const titleParams = queryParams.get('title') || ''

    const [showsList, setShowsList] = useState<ShowMinimalModel[]>([])
    
    const getShowsByTitle = async() => {        
        const response = await fetch(`https://api.themoviedb.org/3/search/tv?query=${titleParams}&api_key=${process.env.REACT_APP_API_KEY}`)
        const data = await response.json()
        const formattedData = data.results.map((show: any) => ({
            id: show.id,
            title: show.name,
            image: `https://image.tmdb.org/t/p/w500${show.backdrop_path}`,
            rating: show.vote_average,
            date: show.first_air_date,
            genres: genres.filter((genre)=> show.genre_ids.includes(genre.id)).map((genre) => genre.name)
        }))

        setShowsList(formattedData)
    }



    useEffect(() => {
        getShowsByTitle()
    }, [location])
    return (
        <div>
            <h1>Vos recherches</h1>

            {
                showsList.map((shows) => (
                    <ShowCard key={shows.id} show={shows}></ShowCard>
                ))
            }
        </div>
        
    )
}