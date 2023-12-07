import { useContext, useEffect, useState } from "react"
import { useLocation, useNavigate, useParams } from "react-router-dom"
import { GenresContext } from "../context/GenresContext"
import ShowCard from "../components/homepage/ShowCard"
import { ShowMinimalModel } from "../models/ShowMinimalModel"
import GenreFilterPill from "../components/search/GenreFilterPill"

export default function SearchPage() {

    const navigate = useNavigate()

    const genres = useContext(GenresContext)
    const [genreFilterId, setGenreFilter] = useState<number>() 

    const location = useLocation()
    const queryParams = new URLSearchParams(location.search)
    const titleParams = queryParams.get('title') || ''

    const [showsList, setShowsList] = useState<ShowMinimalModel[]>([])
    
    const getShows =async (url: string) => {
        const response = await fetch(url)
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

    const selectGenreFilter = (genreId: number) => {
        navigate('/search', {replace: true});
        setGenreFilter(genreId)
    }

    useEffect(() => {
        let url = ''
        if (titleParams) {
            // Get shows by title
            console.log('Get by title');
            
            url = `https://api.themoviedb.org/3/search/tv?query=${titleParams}&api_key=${process.env.REACT_APP_API_KEY}`;
        } else if (genreFilterId) {
            // Get shows by genre
            console.log('Get by genre');
            url = `https://api.themoviedb.org/3/discover/tv?api_key=${process.env.REACT_APP_API_KEY}&with_genres=${genreFilterId}`;
            console.log(url);
            
        } else {
            // Get discover shows
            console.log('Get by Discover');
            url = `https://api.themoviedb.org/3/discover/tv?api_key=${process.env.REACT_APP_API_KEY}`;
        }
        getShows(url)
    }, [location, genreFilterId])


    return (
        <div>
            <h1>Vos recherches</h1>
            <div>
                {
                    genres.map((genre,index) => (
                        <GenreFilterPill key={index} genre={genre.name} setGenre={() => selectGenreFilter(genre.id)}/>
                    ))
                }
                
            </div>
            {
                showsList.map((shows) => (
                    <ShowCard key={shows.id} show={shows}></ShowCard>
                ))
            }
        </div>
        
    )
}