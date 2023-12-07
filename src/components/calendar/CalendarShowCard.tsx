import { Episode } from "../../models/EpisodeModel";

interface Props {
    episode: Episode
}

export default function CalendarShowCard({episode}:Props){
    return(
        <div>
            <p>{episode.title}</p>
            <p>{episode.season}</p>
        </div>
    )
}