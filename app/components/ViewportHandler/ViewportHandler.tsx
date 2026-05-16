'use client';

import { useEffect } from 'react';

export default function ViewportHandler() {
  useEffect(() => {
    // Set the browser zoom to 80% when the page loads
    document.body.style.zoom = '80%';
    
    // Optional: Store preference in localStorage to persist across sessions
    localStorage.setItem('pageZoom', '80');

    return () => {
      // Reset zoom when component unmounts (optional)
      // document.body.style.zoom = '100%';
    };
  }, []);

  return null; // This component doesn't render anything
}
