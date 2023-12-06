import SeasonModel from "./SeasonModel";

export default interface ShowModel{
    id: number;
    name: string;
    image: string;
    voteAverage: number;
    //TO DO need to create a Genre Model
    genres: Array<{}>;
    seasons: SeasonModel[];
}