"use client";
import React from "react";
import { type ReactNode, useState } from "react";
import Player from "./components/musixPlayer";
import { getAlbumDetails } from "./api/api";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useGlobalAudioPlayer } from "react-use-audio-player";

export default function Home(): ReactNode {
  const queryClient = useQueryClient();
  const { stop, play, playing, togglePlayPause } = useGlobalAudioPlayer();
  const [cardId, setCardId] = useState(1142502);
  const [cardClicked, setCardClicked] = useState(false)
  const { data } = useQuery({
    queryKey: ["cardData"],
    queryFn: async () => {
      const albumData = await getAlbumDetails(cardId);
      console.log(albumData);
      return albumData.data;
    },
  });

  return (
    <main
      className="
      bg-slate-800
      "
    >
      <div className="text-gray-300">
        <div>{cardId}</div>
        <div
          onClick={() => {
            setCardId(1052498);
            queryClient.invalidateQueries({ queryKey: ["cardData"] });
            console.log("tum bin");
            togglePlayPause();
          }}
          className="hover:text-gray-100 hover:font-bold card p-5 bg-gray-600 cursor-pointer border-x-2 border-t-2 border-black"
        >
          Tum bin
        </div>
        <div
          onClick={() => {
            setCardId(1142502);
            queryClient.invalidateQueries({ queryKey: ["cardData"] });
            console.log("imagine dragons");
            togglePlayPause();
          }}
          className=" hover:text-gray-100 hover:font-bold  card p-5 bg-gray-600 cursor-pointer border-x-2 border-t-2 border-black"
        >
          Imagine dragons
        </div>

        <div className="hover:text-gray-100  hover:font-bold p-5 bg-gray-600  cursor-pointer border-x-2 border-t-2 border-black">
          Playlist
        </div>
        <div className="hover:text-gray-100  hover:font-bold p-5 bg-gray-600  cursor-pointer  border-x-2 border-t-2 border-b-2 border-black">
          Artist
        </div>
      </div>
      {data ? (
        <div className="p-3">
          <Player cardData={data} cardClicked={cardClicked} />
        </div>
      ) : (
        ""
      )}
    </main>
  );
}
