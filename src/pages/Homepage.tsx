import { useEffect, useState } from "react";
import ShowListSection from "../components/homepage/ShowListSection";
import { auth } from "../firebase";

export default function Homepage() {
    const [user, setUser] : any = useState(null);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
          if (user) {
            // L'utilisateur est connecté
              setUser(user);
              console.log(user);
          } else {
            // L'utilisateur n'est pas connecté
            setUser(null);
          }
        });
    
        // Nettoyage de l'effet lorsque le composant est démonté
        return () => unsubscribe();
    }, []);
    
    const showsListSections = [
        {
            apiUrl: `https://api.themoviedb.org/3/tv/top_rated?api_key=${process.env.REACT_APP_API_KEY}`,
            title: "Top rated"
        },
        {
            apiUrl: `https://api.themoviedb.org/3/tv/popular?api_key=${process.env.REACT_APP_API_KEY}`,
            title: "Most popular"
        },
        {
            apiUrl: `https://api.themoviedb.org/3/trending/tv/day?api_key=${process.env.REACT_APP_API_KEY}`,
            title: "Trending"
        }
    ]
    return(
        <div>
            {showsListSections.map((section, index) => (
                <ShowListSection key={index} url={section.apiUrl} sectionTitle={section.title} />
            ))}
        </div>
    )
}