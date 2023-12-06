import { createContext, useEffect, useState } from "react";

interface Genres {
  id: number;
  name: string;
}

export const GenresContext = createContext([] as Genres[])

export function GenresProvider({ children }: any) {
  const [genresApi, setGenresApi] = useState([] as Genres[]);

  const setGenres = async () => {
    const response = await fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=${process.env.REACT_APP_API_KEY}`)
    const data = await response.json()
    setGenresApi(data.genres)

  }

  useEffect(() => {
    setGenres()
  }, [])

  return (
    <GenresContext.Provider value={genresApi}>
      {children}
    </GenresContext.Provider>
  )


}