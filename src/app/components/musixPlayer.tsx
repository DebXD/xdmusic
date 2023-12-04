"use client";
import React from "react";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import {
  FaPlayCircle,
  FaPauseCircle,
  FaStepBackward,
  FaStepForward,
  FaExpandAlt,
  FaCompressAlt,
} from "react-icons/fa";
import formatDuration from "format-duration";
import { useGlobalAudioPlayer } from "react-use-audio-player";

interface PropTypes {
  cardData: any
  cardClicked : boolean
}
export default function Player({ cardData, cardClicked }: PropTypes) {
  const { load, togglePlayPause, getPosition, seek, duration, stop } =
    useGlobalAudioPlayer();
  const [isPlaying, setIsPlaying] = useState(false);
  const progressBar = useRef<HTMLInputElement>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [progress, setProgress] = useState(0);
  const [formatDurationTime, setFormatDurationTime] = useState("");
  const [index, setIndex] = useState(0);
  const [songDuration, setSongDuration] = useState(0);
  const [songList, setSongList] = useState<Array<any>>([]);
  const [songImage, setSongImage] = useState("");
  const [songArtist, setSongArtist] = useState("");
  const [songName, setSongName] = useState("");
  const [songUrl, setSongUrl] = useState("");
  const [expandPlayer, setExapandPlayer] = useState(false);

  useEffect(() => {
    console.log(cardData);
    if (cardData?.songs) {
      setSongList(cardData.songs);
      setSongUrl(cardData.songs[index].downloadUrl[1].link);
      if (cardData) {
        setIsPlaying(true)
        console.log(cardData.songs[index].downloadUrl[1].link)
        load(cardData.songs[index].downloadUrl[1].link);
      }
      if(cardClicked){
        setIndex(0)
      }
      setSongName(cardData.songs[index].name);
      setSongImage(cardData.songs[index].image[2].link);
      setSongArtist(cardData.songs[index].primaryArtists);
      setSongDuration(parseInt(cardData.songs[index].duration));
      // convert second to time
      setFormatDurationTime(formatDuration(songDuration * 1000));
    }
      }, [index, songDuration, getPosition, load, songUrl, cardData, cardClicked]);
useEffect(()=>{
    const updateProgress = () => {
      setProgress((getPosition() / duration) * 100);
    };
    if (isPlaying) {
      const interval = setInterval(updateProgress, 100);

      return () => {
        clearInterval(interval);
      };
    } else {
      stop();
    }

  }, [duration, getPosition,isPlaying, stop ])
  const onScrub = (value: number) => {
       if (value && duration) {
      seek((value * duration) / 100);
    }
    if (progress !== currentTime) {
      if (!isPlaying) {
        setIsPlaying(!isPlaying);
        load(cardData.songs[index].downloadUrl[1].link);
      }
    }
  };

  const skipToNext = () => {
    if (index === songList.length - 1) {
      setIndex(0);
    } else {
      setIndex(index + 1);
      load(cardData.songs[index].downloadUrl[1].link);
    }
  };

  const skipBack = () => {
    if (index === 0) {
      setIndex(songList.length - 1);
      load(cardData.songs[index].downloadUrl[1].link);
    } else {
      setIndex(index - 1);
      load(cardData.songs[index].downloadUrl[1].link);
    }
  };
  return (
    <div className="h-screen relative">
      {expandPlayer ? (
        <div className="p-10 lg:px-80 bg-gray-900 bottom-0 absolute">
          <div className="">
            <div className="flex justify-center">
              <Image
                width={600}
                height={500}
                src={songImage}
                alt="image"
                className="rounded-md"
              />
            </div>
            <div className="md:px-32 lg:px-80">
              <p className="text-white mt-2 text-2xl">{songName}</p>
              <p className="text-gray-400 text-sm bg-black">
                {songArtist.length > 50
                  ? songArtist.slice(0, 50) + "..."
                  : songArtist}
              </p>
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

            {/* <div className="text-white flex justify-between md:px-72 lg:px-96 bg-gray-900"> */}
            {/*   {audioEl.current?.currentTime ? ( */}
            {/*     <p>{formatDuration(audioEl.current?.currentTime * 1000)}</p> */}
            {/*   ) : ( */}
            {/*     "0:00" */}
            {/*   )} */}
            {/*   <p>{formatDurationTime}</p> */}
            {/* </div> */}
            <div className="flex justify-center p-10 gap-10 bg-gray-900">
              <FaStepBackward
                className="text-white h-10 w-10 active:text-gray-400"
                onClick={() => {
                  skipBack();
                }}
              />
              {isPlaying ? (
                <FaPauseCircle
                  className="text-white  h-12 w-12 active:text-gray-400"
                  onClick={() => {
                    setIsPlaying(false);
                  }}
                />
              ) : (
                <FaPlayCircle
                  className="text-white  h-12 w-12 active:text-gray-400"
                  onClick={() => {
                    setIsPlaying(true);
                  }}
                />
              )}
              <FaStepForward
                className="text-white  h-10 w-10 active:text-gray-400"
                onClick={() => {
                  skipToNext();
                }}
              />
              <div>
                <FaCompressAlt
                  className="text-white h-10 w-10 active:text-gray-400"
                  onClick={() => {
                    setExapandPlayer(!expandPlayer);
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-10 lg:px-80 bg-gray-900">
          <div className="">
            <div className="flex justify-center"></div>
            <div className="md:px-32 lg:px-80">
              <p className="text-white mt-2 text-2xl">{songName}</p>
              <p className="text-gray-400 text-sm">
                {songArtist.length > 50
                  ? songArtist.slice(0, 50) + "..."
                  : songArtist}
              </p>
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

            <div className="text-white flex justify-between md:px-72 lg:px-96 bg-gray-900">
              {getPosition() ? (
                <p>{formatDuration(getPosition() * 1000)}</p>
              ) : (
                "0:00"
              )}
              <p>{formatDuration(duration * 1000)}</p>
            </div>
            <div className="flex justify-center p-10 gap-10 bg-gray-900">
              <FaStepBackward
                className="text-white h-10 w-10 active:text-gray-400"
                onClick={() => {
                  skipBack();
                }}
              />
              {/* <div className="text-white">{card}</div> */}
              {isPlaying ? (
                <FaPauseCircle
                  className="text-white  h-12 w-12 active:text-gray-400"
                  onClick={() => {
                    setIsPlaying(false);
                    togglePlayPause();
                  }}
                />
              ) : (
                <FaPlayCircle
                  className="text-white  h-12 w-12 active:text-gray-400"
                  onClick={() => {
                    setIsPlaying(true);
                    togglePlayPause();
                  }}
                />
              )}
              <FaStepForward
                className="text-white  h-10 w-10 active:text-gray-400"
                onClick={() => {
                  skipToNext();
                }}
              />
              <div>
                <FaExpandAlt
                  className="text-white h-10 w-10 active:text-gray-400"
                  onClick={() => {
                    setExapandPlayer(!expandPlayer);
                  }}
                />
              </div>

              {!cardData ? <div className="text-white">Loading...</div> : ""}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
