"use client";

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

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
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  // Show loading state until component has mounted on client
  if (!hasMounted) {
    return (
      <div 
        className="rounded-full bg-gray-300 flex items-center justify-center"
        style={{ width: props.size || 40, height: props.size || 40 }}
      >
        <div className="w-full h-full rounded-full bg-gray-400" />
      </div>
    );
  }

  return (
    <BoringAvatar
      {...props}
      size={props.size || 40}
      variant={props.variant || 'marble'}
      colors={props.colors || ['#0a0310', '#49007e', '#ff005b', '#ff7d10', '#ffb238']}
    />
  );
}
