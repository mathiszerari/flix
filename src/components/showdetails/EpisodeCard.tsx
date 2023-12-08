import { useEffect, useState } from "react";
import { Episode } from "../../models/EpisodeModel";

interface Props {
    episode: Episode
}

export default function EpisodeCard({ episode }: Props) {
    
    const [truncatedTitle, setTruncatedTitle] = useState('')
    const [truncatedDescription, settruncatedDescription] = useState('')

    useEffect(()=>{

        if (episode.title && episode.description) {
            setTruncatedTitle(episode.title.length >= 20 ? episode.title.substring(0,20)+"..." : episode.title)
            settruncatedDescription(episode.description.length >=50 ? episode.description.substring(0,50)+"..." : episode.description )
        }
        
    },[episode])

    return ( 
        <div className="w-fit relative bg-gradient-to-t from-black to-transparent to-[50%] h-60 aspect-video flex items-end">
            <img className="absolute top-0 left-0 w-full -z-10 " src={episode.image} alt="" />
            <div className="p-4 flex flex-col backdrop-blur-sm w-full">
                <span className="text-lg">Episode {episode.episodeNumber} : {truncatedTitle}</span>
                <span className="opacity-60">{truncatedDescription}</span>
                <span className="opacity-60">{episode.date}</span>
            </div>
        </div>
    )
} 