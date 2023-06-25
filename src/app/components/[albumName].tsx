"use client";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import {
  FaPlayCircle,
  FaPauseCircle,
  FaStepBackward,
  FaStepForward,
  FaVolumeMute,
  FaSearch,
} from "react-icons/fa";
import { CgSpinnerAlt } from "react-icons/cg";
import { searchAlbums, getAlbumDetails } from "../utils/api";
import { useQuery, QueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router";

interface PropTypes {
  albumNames: string;
}
export default function Plyr({ albumNames }: PropTypes) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioEl = useRef<HTMLAudioElement>(null);
  const progressBar = useRef<HTMLInputElement>(null);
  let [currentTime, setCurrentTime] = useState(audioEl?.current?.currentTime);
  let [duration, setDuration] = useState();
  const [albumSongList, setAlbumSongList] = useState([]);
  const [currentSong, setCurrentSong] = useState([]);
  const [albumSongImage, setAlbumSongImage] = useState();
  const [artistName, setArtistName] = useState();
  const [songUrl, setSongUrl] = useState();
  const [index, setIndex] = useState(0);
  const [label, setLabel] = useState();
  const [songTime, setSongTime] = useState(0);
  const [songImage, setSongImage] = useState();
  const router = useRouter();
  const [albumQuery, setAlbumQuery] = useState(router.query.albumName);

  const [progress, setProgress] = useState(songTime);

  useEffect(() => {
    if (isNaN(audioEl?.current?.currentTime)) {
      setSongTime(0);
    } else {
      setSongTime((audioEl?.current?.currentTime / duration) * 100);
    }

    const updateProgress = () => {
      if (audioEl) {
        const currentTime = audioEl?.current?.currentTime;
        if (currentTime && duration) {
          const newProgress = (currentTime / duration) * 100;

          setProgress(newProgress);
        }
      }
    };
    if (isPlaying) {
      audioEl?.current?.play();

      const interval = setInterval(updateProgress, 100);

      return () => {
        clearInterval(interval);
      };
    } else {
      audioEl?.current?.pause();
    }
  }, [isPlaying, progress, currentTime, duration]);

  const onScrub = (value: number) => {
    document.getElementById("audio").currentTime = (value * duration) / 100;
    if (progress !== currentTime) {
      if (!isPlaying) {
        setIsPlaying(!isPlaying);
      }
    }
  };
  const { data, isSuccess } = useQuery({
    queryKey: ["trackdetails"],
    queryFn: async () => {
      const data = await searchAlbums(albumQuery);
      const albumId = data.data.results[0].id;
      const albumData = await getAlbumDetails(albumId);
      setAlbumSongImage(albumData.data.image[2].link);
      setAlbumSongList(albumData.data.songs);

      return albumData;
    },
  });
  useEffect(() => {
    if (isSuccess && albumSongList) {
      // setSongImage(albumSongList[index].image[2].link);
      // console.log(albumSongList[index].image[2].link);
      setSongUrl(albumSongList[index].downloadUrl[4].link);
      setDuration(albumSongList[index].duration);
      setLabel(albumSongList[index].name);
      setArtistName(albumSongList[index].primaryArtists);
    }
  }, [albumSongList, index, isSuccess]);

  const skipToNext = () => {
    if (index === albumSongList.length - 1) {
      setIndex(0);
    } else {
      setIndex(index + 1);
    }
  };

  const skipBack = () => {
    if (index === 0) {
      setIndex(albumSongList.length - 1);
    } else {
      setIndex(index - 1);
    }
  };

  return (
    <div className="p-10">
      {/* <div className="flex justify-center"> */}
      {/*   <input */}
      {/*     className="text-black bg-gray-400 rounded-md w-full mb-4 h-10 p-5" */}
      {/*     value={albumQuery} */}
      {/*     onChange={(e) => { */}
      {/*       setAlbumQuery(e.target.value); */}
      {/*     }} */}
      {/*   /> */}
      {/*   <FaSearch className="h-10 w-10 text-white" /> */}
      {/* </div> */}
      <div className="font-poppins">
        {data ? (
          <>
            <div className="flex justify-center">
              <Image
                width={600}
                height={500}
                src={albumSongImage}
                alt="image"
                className="rounded-md"
              />
            </div>
            <div className="justify-center ">
              <audio
                id="audio"
                ref={audioEl}
                src={songUrl}
                onEnded={() => {
                  skipToNext();
                  setSongTime(0);
                  setIsPlaying(true);
                }}
                onPause={() => setIsPlaying(false)}
                onPlay={() => setIsPlaying(true)}
              ></audio>
            </div>
            <div>
              <p className="text-white mt-2 text-2xl">{label}</p>
              <p className="text-gray-400 text-sm">{artistName}</p>
            </div>
            <div className="flex justify-center mt-5">
              <input
                type="range"
                value={progress}
                ref={progressBar}
                max={100}
                onChange={(e) => {
                  e.preventDefault;
                  onScrub(parseInt(e.target.value));
                }}
                className="w-full md:w-1/4 shadow-xl rounded-full"
              />
            </div>

            <div className="text-white flex justify-between md:px-72">
              <p>{audioEl.current?.currentTime}</p>
              <p>{duration}</p>
            </div>
            <div className="flex justify-center p-10 gap-10">
              <FaStepBackward
                className="text-white h-10 w-10 active:text-gray-400"
                onClick={skipBack}
              />
              {isPlaying ? (
                <FaPauseCircle
                  className="text-white  h-12 w-12 active:text-gray-400"
                  onClick={() => setIsPlaying(false)}
                />
              ) : (
                <FaPlayCircle
                  className="text-white  h-12 w-12 active:text-gray-400"
                  onClick={() => setIsPlaying(true)}
                />
              )}
              <FaStepForward
                className="text-white  h-10 w-10 active:text-gray-400"
                onClick={skipToNext}
              />
              {/* <FaVolumeMute className="text-white  h-10 w-10" /> */}
            </div>
          </>
        ) : (
          <div className="justify-center flex">
            <CgSpinnerAlt className="animate-spin h-10 w-10 text-white" />
          </div>
        )}
      </div>
    </div>
  );
}