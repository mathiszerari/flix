import { useEffect, useState } from "react";
import SeasonModel from "../../models/SeasonModel";
import { Episode } from "../../models/EpisodeModel";
import EpisodeCard from "./EpisodeCard";
import ShowCardSkeleton from "../ShowCardSkeleton";
import EpisodeCardSkeleton from "../EpisodeCardSkeleton";

interface Props {
    seasonInfo: SeasonModel;
    showId: number;
}

export default function SeasonSection({ seasonInfo, showId }: Props) {
    const [currentSeason, setCurrentSeason] = useState<Episode[]>()
    const [isDataLoaded, setIsDataLoaded] = useState(false)

    const getEpisodeData = async (episodeNumber: number) => {
        try {
            const response = await fetch(`https://api.themoviedb.org/3/tv/${showId}/season/${seasonInfo.seasonNumber}/episode/${episodeNumber}?api_key=${process.env.REACT_APP_API_KEY}`)
            const data = await response.json()
            return {
                title: data.name,
                image: `https://image.tmdb.org/t/p/w500${data.still_path}`,
                date: data.air_date,
                description: data.overview,
                season: data.season_number,
                episodeNumber: data.episode_number,
            } as Episode
        } catch (error) {
            console.error("error", error)
        }
    }

    const getAllEpisodesData = async () => {
        try {
            const episodesData = []

            for (let i = 1; i <= seasonInfo.episodesCount; i++) {
                const data = await getEpisodeData(i)
                episodesData.push(data)
            }

            setIsDataLoaded(true)
            return episodesData as Episode[]
        } catch (error) {
            console.error("error", error)
        }


    }

    const setCurrentSeasonEpisodes = async () => {
        setCurrentSeason(await getAllEpisodesData())
    }

    useEffect(() => {
        setCurrentSeasonEpisodes()
    }, [])

    return (
        <div className="mt-8">
            <h2 className="text-3xl font-semibold">{`Season ${seasonInfo.seasonNumber}`}</h2>
            <div className="flex flex-wrap gap-4 mt-4">
                {
                    isDataLoaded ? (
                        currentSeason?.map((episode) => (
                            <EpisodeCard key={episode.episodeNumber} episode={episode} />
                        ))
                    ) : (
                        Array.from({ length: 4 }).map((index) => (
                            <EpisodeCardSkeleton />
                        ))

                    )
                }

            </div>
        </div>
    )
}