import { useEffect, useRef, useState } from 'react';

const useBackgroundMusic = (url, volume = 0.3) => {
  const audioRef = useRef(null);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    // Create audio element
    audioRef.current = new Audio(url);
    audioRef.current.volume = volume;
    audioRef.current.loop = true;

    // Try to play when user interacts
    const playAudio = () => {
      audioRef.current.play().catch(e => {
        console.log('Audio play failed:', e);
      });
      document.removeEventListener('click', playAudio);
      document.removeEventListener('keydown', playAudio);
    };

    document.addEventListener('click', playAudio);
    document.addEventListener('keydown', playAudio);

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [url, volume]);

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !audioRef.current.muted;
      setIsMuted(!isMuted);
    }
  };

  return { toggleMute, isMuted };
};

export default useBackgroundMusic;