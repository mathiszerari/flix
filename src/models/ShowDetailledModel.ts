import SeasonModel from "./SeasonModel";

export default interface ShowDetailledModel{
    id: number;
    name: string;
    image: string;
    voteAverage: number;
    description: string;
    //TO DO need to create a Genre Model
    genres: Array<{}>;
    seasons: SeasonModel[];
}