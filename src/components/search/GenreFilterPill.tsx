interface Props{
    genre: string;
    setGenre: () => void; 
}

export default function GenreFilterPill({genre,setGenre}: Props){
    return(
        <button onClick={setGenre}>{genre}</button>
    )
}