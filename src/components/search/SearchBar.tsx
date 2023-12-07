import { useState } from "react"
import {useNavigate } from "react-router-dom"


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
            <input onKeyDown={(e)=>{handleKeyDown(e)}} type="text" value={searchText} onChange={(e) => { setSearchText(e.target.value) }} />
        </label>
    )
}