import ShowListSection from "../components/homepage/ShowListSection";

export default function Homepage(){
    
    const showsListSections = [
        {
            apiUrl: `https://api.themoviedb.org/3/tv/top_rated?api_key=${process.env.REACT_APP_API_KEY}`,
            title: "Les mieux notés"
        },
        {
            apiUrl: `https://api.themoviedb.org/3/tv/popular?api_key=${process.env.REACT_APP_API_KEY}`,
            title: "Les plus populaires"
        },
        {
            apiUrl: `https://api.themoviedb.org/3/trending/tv/day?api_key=${process.env.REACT_APP_API_KEY}`,
            title: "Tendances"
        }
    ]
    return(
        <div>
            <h1>Homepage</h1>

            {showsListSections.map((section, index) => (
                <ShowListSection key={index} url={section.apiUrl} sectionTitle={section.title} />
            ))}
        </div>
    )
}