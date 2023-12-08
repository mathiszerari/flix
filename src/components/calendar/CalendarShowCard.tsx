import { Episode } from "../../models/EpisodeModel";

interface Props {
    episode: Episode
}

export default function CalendarShowCard({episode}:Props){
    return(
        <div className="relative border">
            <p>{episode.title}</p>
            <p>{episode.season}</p>
            <img className="absolute aspect-video h-[10rem] top-0 left-0 -z-10" src={episode.image} alt="" />
        </div>
    )
}