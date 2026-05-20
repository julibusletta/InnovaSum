"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

export default function SplashScreen() {
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isHiding, setIsHiding] = useState(false);
  const [isHidden, setIsHidden] = useState(false);

  useEffect(() => {
    // Check if we've already shown the splash screen this session
    const hasSeenSplash = sessionStorage.getItem('hasSeenSplash');
    if (hasSeenSplash) {
      setIsHidden(true);
      return;
    }

    // Simulate loading progress
    const interval = setInterval(() => {
      setLoadingProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        // Randomize the progress speed a bit to look more natural
        return prev + Math.floor(Math.random() * 10) + 5;
      });
    }, 100);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (loadingProgress >= 100) {
      setTimeout(() => {
        setIsHiding(true);
        setTimeout(() => {
          setIsHidden(true);
          sessionStorage.setItem('hasSeenSplash', 'true');
        }, 500); // Wait for fade out animation
      }, 300); // Wait a bit at 100% before hiding
    }
  }, [loadingProgress]);

  if (isHidden) return null;

  return (
    <div 
      className={`fixed inset-0 z-[99999] bg-white flex flex-col items-center justify-center transition-opacity duration-500 ease-in-out ${
        isHiding ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <div className="relative w-72 h-32 mb-8 animate-pulse">
        <Image 
          src="/images/logoinnovasum.webp" 
          alt="Innovasum Logo" 
          fill
          style={{ objectFit: 'contain' }}
          priority
        />
      </div>
      
      <div className="w-64 h-1.5 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className="h-full bg-black transition-all duration-100 ease-out"
          style={{ width: `${Math.min(loadingProgress, 100)}%` }}
        />
      </div>
    </div>
  );
}
