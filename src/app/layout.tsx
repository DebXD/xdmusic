'use client';
import React from 'react';
import './globals.css';
import { Poppins } from 'next/font/google';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const poppins = Poppins({
    subsets: ['latin'],
    weight: '400',
    style: 'normal',
    variable: '--font-poppins',
});
// export const metadata: Metadata = {
//   title: 'Music App',
//   description: 'Powered By NextJs',
// }
//
const queryClient = new QueryClient();

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <QueryClientProvider client={queryClient}>
                <body className={poppins.className}>{children}</body>
            </QueryClientProvider>
        </html>
    );
}
