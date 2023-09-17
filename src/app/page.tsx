'use client';
import React from 'react';
import { type ReactNode, useState } from 'react';
import Player from './components/musixPlayer';
import { useQuery } from 'react-query';
import { getAlbumDetails } from './api/api';
import { useAtom } from 'jotai';
import { albumDataAtom } from '@/atoms';

export default function Home(): ReactNode {
    const [albumData, setAlbumData] = useAtom(albumDataAtom);
    const [albumID, setAlbumID] = useState(0);

    const { data } = useQuery({
        queryKey: ['trackdetails'],
        queryFn: async () => {
            const albumData = await getAlbumDetails(albumID);
            localStorage.setItem('albumData', JSON.stringify(albumData));
            // console.log(albumData);
            setAlbumData(albumData);
            return albumData;
        },
    });

    return (
        <main>
            <div>
                <div onClick={()=> setAlbumID(1142502)} className='p-5 bg-gray-600'>Tum bin</div>
                <div className="card">Playlist</div>
                <div className="card">Arijit Singh</div>
            </div>
            <div className="p-3">
                <Player albumID={albumID} />
            </div>
        </main>
    );
}
