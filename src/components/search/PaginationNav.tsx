interface Props{
    totalPages: number;
    currentPage: number;
    goToNextPage: ()=> void;
    goToPreviousPage: ()=> void;
}

export default function PaginationNav({totalPages, currentPage, goToNextPage, goToPreviousPage}: Props){

    return(
        <div className="flex gap-2 items-center">
            <button className="bg-white text-black pointer-events-auto px-2 py-1 rounded-full font-semibold disabled:bg-zinc-800 disabled:text-zinc-600" onClick={goToPreviousPage} disabled={currentPage === 1}>previous</button>
            <span>{`${currentPage} - ${totalPages}`}</span>
            <button className="bg-white text-black pointer-events-auto px-2 py-1 rounded-full font-semibold disabled:bg-zinc-800 disabled:text-zinc-600" onClick={goToNextPage} disabled={currentPage === totalPages}>next</button>
        </div>
    )

}