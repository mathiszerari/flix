import { NavLink } from "react-router-dom";
import { ShowMinimalModel } from "../../models/ShowMinimalModel";

interface Props{
    show: ShowMinimalModel;
}



export default function ShowCard({show}:Props){

    

    return(
    
        <NavLink to={`/shows/${show.id}`} className="w-fit relative bg-gradient-to-t from-black to-transparent to-[30%]">
            <div className="w-80 h-[30rem] flex items-end">
                <img className="absolute -z-10 top-0 h-full object-cover" src={show.image} alt={show.title} />
                <div className="p-4 backdrop-blur-lg flex flex-col w-full">
                    <span className="text-lg font-semibold">{show.title}</span>
                    <span className="opacity-50">{show.date} | {show.genres} | {show.rating}</span>
                </div>
            </div>
        </NavLink>
        
    )
}