import type { Metadata } from 'next';
import './globals.css';
export const metadata:Metadata={title:'Murmur',description:'A few words, a little melody. Make a sound sculpture and keep the sound.',icons:{icon:'/favicon.svg'}};
export default function Layout({children}:Readonly<{children:React.ReactNode}>){return <html lang="en"><body>{children}</body></html>}
