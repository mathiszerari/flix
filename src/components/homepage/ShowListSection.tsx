import { useContext, useEffect, useState } from "react";
import ShowCard from "./ShowCard";
import { ShowMinimalModel } from "../../models/ShowMinimalModel"
import { GenresContext } from "../../context/GenresContext";
import ShowCardSkeleton from "../ShowCardSkeleton";

interface Props {
    url: string,
    sectionTitle: string
}

export default function ShowListSection({ url, sectionTitle }: Props) {
    const [showList, setShowList] = useState<ShowMinimalModel[]>()
    const [isDataLoaded, setIsDataLoaded] = useState(false)
    const genres = useContext(GenresContext)
    
   
    const getDataFromApi = async () => {
        try {
            const response = await fetch(url)
            const data = await response.json()   
            const formattedData = data.results.map((show: any) => ({
                id: show.id,
                title: show.name,
                image: `https://image.tmdb.org/t/p/w500${show.poster_path}`,
                rating: show.vote_average,
                date: show.first_air_date,
                genres: genres.filter((genre)=> show.genre_ids.includes(genre.id)).map((genre) => genre.name)
            }))

            setIsDataLoaded(true)
            return formattedData as ShowMinimalModel[]
        } catch (error) {
            console.error('error', error)
        }
    }

    const setShowListData = async () => {
        const data = await getDataFromApi()
        setShowList(data)
    }

    useEffect(() => {
        setShowListData()
        
    }, [])

    return (
        <>
            <h2 className="text-2xl font-semibold mt-8">{sectionTitle}</h2>
            <div className="mt-4 flex flex-row flex-wrap justify-between gap-8">
            {   
                isDataLoaded ? (
                    showList?.map((show: any) => (
                        <ShowCard key={show.id} show={show}></ShowCard>
                    )
                    )
                ) : (
                    Array.from({length: 5}).map((index) => (
                        <ShowCardSkeleton />
                    ))
                )
            }
            </div>
            

        </>
    )
}