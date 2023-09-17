'use client';
import React from 'react';
import Image from 'next/image';
import { useState, useRef, useEffect } from 'react';
import {
    FaPlayCircle,
    FaPauseCircle,
    FaStepBackward,
    FaStepForward,
    FaExpandAlt,
} from 'react-icons/fa';
import formatDuration from 'format-duration';
import { albumDataAtom } from '@/atoms';
import { useAtom } from 'jotai';

interface propTypes {
    albumID: number;
}

export default function Player({ albumID }: propTypes) {
    const [isPlaying, setIsPlaying] = useState(false);
    const audioEl = useRef<HTMLAudioElement>(null);
    const progressBar = useRef<HTMLInputElement>(null);
    const [currentTime, setCurrentTime] = useState(0);
    const [progress, setProgress] = useState(0);
    const [formatDurationTime, setFormatDurationTime] = useState('');
    const [index, setIndex] = useState(0);
    const [songDuration, setSongDuration] = useState(0);
    const [songList, setSongList] = useState<Array<any>>([]);
    const [songImage, setSongImage] = useState('');
    const [songArtist, setSongArtist] = useState('');
    const [songName, setSongName] = useState('');
    const [songUrl, setSongUrl] = useState('');
    const [expandPlayer, setExapandPlayer] = useState(false);
    // const [localData, setLocalData ] = useState(JSON.parse(localStorage.getItem('albumData')))

    const [albumData, setAlbumData] = useAtom(albumDataAtom);

    useEffect(() => {
        // console.log(cardData.data)
        // const data = JSON.parse(localStorage.getItem('albumData')).data
        // const data = cardData.data;
        const data = albumData;
        console.log(data);
        console.log(songUrl);
        if (data?.songs) {
            setSongList(data.songs);
            setSongUrl(data.songs[index].downloadUrl[4].link);
            setSongName(data.songs[index].name);
            setSongImage(data.songs[index].image[2].link);
            setSongArtist(data.songs[index].primaryArtists);
            setSongDuration(parseInt(data.songs[index].duration));
            // convert second to time
            setFormatDurationTime(formatDuration(songDuration * 1000));

            const updateProgress = () => {
                if (audioEl) {
                    const currentTime = audioEl?.current?.currentTime;
                    if (currentTime && songDuration) {
                        const newProgress = (currentTime / songDuration) * 100;
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
        }
    }, [
        isPlaying,
        currentTime,
        songDuration,
        formatDurationTime,
        index,
        audioEl,
        songUrl,
        albumData,
        albumID
    ]);

    const onScrub = (value: number) => {
        const audioElement = document.getElementById(
            'audio'
        ) as HTMLAudioElement | null;

        if (audioElement && songDuration) {
            audioElement.currentTime = (value * songDuration) / 100;
        }
        if (progress !== currentTime) {
            if (!isPlaying) {
                setIsPlaying(!isPlaying);
            }
        }
    };

    const skipToNext = () => {
        if (index === songList.length - 1) {
            setIndex(0);
        } else {
            setIndex(index + 1);
        }
    };

    const skipBack = () => {
        if (index === 0) {
            setIndex(songList.length - 1);
        } else {
            setIndex(index - 1);
        }
    };
    return (
        <div className="h-screen relative">
            <audio
                id="audio"
                ref={audioEl}
                src={songUrl}
                onEnded={() => {
                    skipToNext();
                    setCurrentTime(0);
                    setIsPlaying(true);
                }}
                onPause={() => {
                    setIsPlaying(false);
                }}
                onPlay={() => {
                    setIsPlaying(true);
                }}
            ></audio>

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
                            <p className="text-white mt-2 text-2xl">
                                {songName}
                            </p>
                            <p className="text-gray-400 text-sm">
                                {songArtist.length > 50
                                    ? songArtist.slice(0, 50) + '...'
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
                            {audioEl.current?.currentTime ? (
                                <p>
                                    {formatDuration(
                                        audioEl.current?.currentTime * 1000
                                    )}
                                </p>
                            ) : (
                                '0:00'
                            )}
                            <p>{formatDurationTime}</p>
                        </div>
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
                        </div>
                    </div>
                </div>
            ) : (
                <div className="p-10 lg:px-80 bg-gray-900">
                    <div className="">
                        <div className="flex justify-center"></div>
                        <div className="md:px-32 lg:px-80">
                            <p className="text-white mt-2 text-2xl">
                                {songName}
                            </p>
                            <p className="text-gray-400 text-sm">
                                {songArtist.length > 50
                                    ? songArtist.slice(0, 50) + '...'
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
                            {audioEl.current?.currentTime ? (
                                <p>
                                    {formatDuration(
                                        audioEl.current?.currentTime * 1000
                                    )}
                                </p>
                            ) : (
                                '0:00'
                            )}
                            <p>{formatDurationTime}</p>
                        </div>
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
                                <FaExpandAlt
                                    className="text-white h-10 w-10 active:text-gray-400"
                                    onClick={() => {
                                        setExapandPlayer(!expandPlayer);
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
