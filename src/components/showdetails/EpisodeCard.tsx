import { Episode } from "../../models/EpisodeModel";

interface Props{
    episode: Episode
}

export default function EpisodeCard({episode}:Props){

    return(
        <div>
            {episode.title}
            {episode.description}
            {episode.date}
        </div>
    )
} 