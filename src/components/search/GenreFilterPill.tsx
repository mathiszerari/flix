interface Props{
    genre: string;
    setGenre: () => void; 
    isActive: boolean;
}

export default function GenreFilterPill({genre,setGenre,isActive}: Props){
    return(
        <button className={ isActive ? ("py-1 px-3 bg-[#e91616] rounded-full"): ("py-1 px-3 bg-zinc-900 rounded-full")} onClick={setGenre}>{genre}</button>
    )
}