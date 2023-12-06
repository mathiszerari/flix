import { ShowMinimalModel } from "../../models/ShowMinimalModel";

interface Props{
    show: ShowMinimalModel;
}

export default function ShowCard({show}:Props){
    return(
        <div>
            <img src={show.image} alt={show.title} />
            <div>
                <span>{show.title}</span>
                <span>{show.date} | {show.genres} | {show.rating}</span>
            </div>
        </div>
    )
}