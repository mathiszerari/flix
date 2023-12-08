import { useState } from "react"
import {useNavigate } from "react-router-dom"
import { MdOutlineSearch } from "react-icons/md";



export default function SearchBar() {
    const [searchText, setSearchText] = useState("")

    const navigate = useNavigate()
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) =>{
        if (e.key === "Enter") {
            navigate(`search?title=${searchText}`)
        }
    }
    return (
        <label>
            <MdOutlineSearch/>
            <input className="bg-transparent border border-white rounded-full px-2 py-1 plac" onKeyDown={(e)=>{handleKeyDown(e)}} type="text" value={searchText} placeholder="Search your shows" onChange={(e) => { setSearchText(e.target.value) }} />
        </label>
    )
}