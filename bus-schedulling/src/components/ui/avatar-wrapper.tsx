"use client";

import dynamic from 'next/dynamic';

// Define the props type for boring-avatars
interface AvatarProps {
  name: string;
  size?: number;
  variant?: 'marble' | 'beam' | 'pixel' | 'sunset' | 'ring' | 'bauhaus';
  colors?: string[];
  square?: boolean;
}

const BoringAvatar = dynamic(() => import('boring-avatars'), {
  ssr: false,
  loading: () => (
    <div 
      className="rounded-full bg-gray-300 animate-pulse flex items-center justify-center"
      style={{ width: 40, height: 40 }}
    >
      <div className="w-full h-full rounded-full bg-gray-400" />
    </div>
  ),
});

export default function Avatar(props: AvatarProps) {
  return (
    <BoringAvatar
      {...props}
      size={props.size || 40}
      variant={props.variant || 'marble'}
      colors={props.colors || ['#0a0310', '#49007e', '#ff005b', '#ff7d10', '#ffb238']}
    />
  );
}
