import { useContext, useEffect, useState } from "react"
import { useLocation, useNavigate, useParams } from "react-router-dom"
import { GenresContext } from "../context/GenresContext"
import ShowCard from "../components/homepage/ShowCard"
import { ShowMinimalModel } from "../models/ShowMinimalModel"
import GenreFilterPill from "../components/search/GenreFilterPill"
import ShowCardSkeleton from "../components/ShowCardSkeleton"
import PaginationNav from "../components/search/PaginationNav"

export default function SearchPage() {

    const navigate = useNavigate()

    const genres = useContext(GenresContext)
    const [genreFilterId, setGenreFilter] = useState<number>()

    const location = useLocation()
    const queryParams = new URLSearchParams(location.search)
    const titleParams = queryParams.get('title') || ''

    const [showsList, setShowsList] = useState<ShowMinimalModel[]>([])

    const [isDataLoaded, setIsDataLoaded] = useState(false)

    const [pageNumber, setPageNumber] = useState(1)

    const [maxPage, setMaxPage] = useState(0)

    const getShows = async (url: string) => {
        const response = await fetch(url)
        const data = await response.json()
        const formattedData = data.results.map((show: any) => ({
            id: show.id,
            title: show.name,
            image: `https://image.tmdb.org/t/p/w500${show.poster_path}`,
            rating: show.vote_average,
            date: show.first_air_date,
            genres: genres.filter((genre) => show.genre_ids.includes(genre.id)).map((genre) => genre.name)
        }))
        
        setMaxPage(data.total_pages)
        setIsDataLoaded(true)
        setShowsList(formattedData)
    }

    const selectGenreFilter = (genreId: number) => {
        navigate('/search', { replace: true });

        setPageNumber(1)
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
            url = `https://api.themoviedb.org/3/search/tv?query=${titleParams}&api_key=${process.env.REACT_APP_API_KEY}&page=${pageNumber}`;
        } else if (genreFilterId) {
            // Get shows by genre
            url = `https://api.themoviedb.org/3/discover/tv?api_key=${process.env.REACT_APP_API_KEY}&with_genres=${genreFilterId}&page=${pageNumber}`;
        } else {
            // Get discover shows
            url = `https://api.themoviedb.org/3/discover/tv?api_key=${process.env.REACT_APP_API_KEY}&page=${pageNumber}`;
        }
        getShows(url)
    }, [location, genreFilterId, pageNumber])


    return (
        <div>
            <div className="mt-8 flex gap-4 mx-auto w-fit">
                {
                    genres.map((genre, index) => (
                        <GenreFilterPill key={index} isActive={genreFilterId === genre.id} genre={genre.name} setGenre={() => selectGenreFilter(genre.id)} />
                    ))
                }

            </div>

            <div className="mt-8 flex flex-row flex-wrap justify-between gap-8">
            <div className="flex w-full justify-end">
                <PaginationNav totalPages={maxPage} currentPage={pageNumber} goToNextPage={() => setPageNumber(pageNumber + 1)} goToPreviousPage={() => setPageNumber(pageNumber - 1)} />
                </div>
                {
                    isDataLoaded ? (

                        showsList.length !== 0 ? (
                            showsList.map((shows) => (
                                <ShowCard key={shows.id} show={shows}></ShowCard>
                            ))
                        ) : (
                            <div className="w-full flex justify-center">
                                <h1 className="text-4xl font-semibold">No shows founds for this genre</h1>
                            </div>

                        )

                    ) : (
                        Array.from({ length: 5 }).map((index) => (
                            <ShowCardSkeleton />
                        ))
                    )

                }
                
                
                <div className="flex w-full justify-end">
                <PaginationNav totalPages={maxPage} currentPage={pageNumber} goToNextPage={() => setPageNumber(pageNumber + 1)} goToPreviousPage={() => setPageNumber(pageNumber - 1)} />
                </div>
            </div>

        </div>

    )
}