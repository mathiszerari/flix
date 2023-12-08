import { useEffect, useState } from "react";
import { Episode } from "../../models/EpisodeModel";

interface Props {
    episode: Episode
}

export default function EpisodeCard({ episode }: Props) {
    if (!episode) {
      return <div className="loader"></div>
    }

    return (
      <div className="w-fit relative bg-gradient-to-t from-black to-transparent to-[50%] h-60 aspect-video flex items-end">
        <img className="absolute top-0 left-0 w-full -z-10 " src={episode.image} alt="" />
        <div className="p-4 flex flex-col backdrop-blur-sm w-full">
          <span className="text-lg">
            Episode {episode.episodeNumber ?? "N/A"} :{" "}
            {episode.title?.length >= 20
              ? episode.title.substring(0, 20) + "..."
              : episode.title}
          </span>
          <span className="opacity-60">
            {episode.description?.length >= 50
              ? episode.description.substring(0, 50) + "..."
              : episode.description}
          </span>
          <span className="opacity-60">{episode.date ?? "N/A"}</span>
        </div>
      </div>
    );
  }