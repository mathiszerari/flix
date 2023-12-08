import { NavLink } from "react-router-dom";
import { ShowMinimalModel } from "../../models/ShowMinimalModel";
import { MdStar } from "react-icons/md";

interface Props {
    show: ShowMinimalModel;
}



export default function ShowCard({ show }: Props) {



    return (

        <NavLink to={`/shows/${show.id}`} className="w-fit relative bg-gradient-to-t from-black to-transparent to-[30%] hover:scale-110 transition-all">
            <div className="w-80 h-[30rem] flex items-end">
                <img className="absolute -z-10 top-0 h-full object-cover" src={show.image} alt={show.title} />
                <div className="p-4 backdrop-blur-lg flex flex-col w-full">
                    <span className="text-lg font-semibold">{show.title}</span>
                    <div className="opacity-50">
                        
                        {show.genres.map((genre) => (<span>{genre} </span>))} | {show.date}  | {show.rating} <MdStar className="inline w-6 h-6 text-amber-400"/>
                    </div>
                </div>
            </div>
        </NavLink>

    )
}