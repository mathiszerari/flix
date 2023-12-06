import ShowListSection from "../components/homepage/ShowListSection";

export default function Homepage(){
    
    return(
        <div>
            <h1>Homepage</h1>
            <ShowListSection url={`https://api.themoviedb.org/3/tv/top_rated?api_key=${process.env.REACT_APP_API_KEY}`} sectionTitle="Les mieux notés"/>
        </div>
    )
}