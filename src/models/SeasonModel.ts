export default interface SeasonModel{
    id: string;
    data: string;
    image: string;
    seasonNumber: number;
    voteAverage: number;
    //TO DO need to create an Episode Model
    episodes: any;
}