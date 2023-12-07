import { useEffect, useState } from "react";
import SeasonModel from "../../models/SeasonModel";
import { Episode } from "../../models/EpisodeModel";
import EpisodeCard from "./EpisodeCard";

interface Props {
    seasonInfo: SeasonModel;
    showId: number;
}

export default function SeasonSection({ seasonInfo, showId }: Props) {
    const [currentSeason, setCurrentSeason] = useState<Episode[]>()

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
        const episodesData = []

        for (let i = 1; i <= seasonInfo.episodesCount; i++) {
            const data = await getEpisodeData(i)
            episodesData.push(data)
        }

        return episodesData as Episode[]

    }

    const setCurrentSeasonEpisodes = async () => {
        setCurrentSeason(await getAllEpisodesData())
    }

    useEffect(() => {
        setCurrentSeasonEpisodes()
    }, [])

    return (
        <div>
            <h2>{`Season ${seasonInfo.seasonNumber}`}</h2>
            <div>
                {currentSeason?.map((episode) => (
                    <EpisodeCard key={episode.episodeNumber} episode={episode} />
                ))}
            </div>
        </div>
    )
}