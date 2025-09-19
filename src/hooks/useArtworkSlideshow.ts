import { useState, useEffect, useCallback } from 'react';
import { Artwork } from '@/types/artwork';
import { HarvardArtAPI } from '@/services/harvardApi';

export const useArtworkSlideshow = () => {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [showInfo, setShowInfo] = useState(false);

  const loadArtworks = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await HarvardArtAPI.getArtworks(1, 50);
      
      if (response.records && response.records.length > 0) {
        setArtworks(response.records);
        setCurrentIndex(0);
      } else {
        throw new Error('No artworks found');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load artworks');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadMoreArtworks = useCallback(async () => {
    try {
      const nextPage = Math.floor(artworks.length / 20) + 1;
      const response = await HarvardArtAPI.getArtworks(nextPage, 20);
      
      if (response.records && response.records.length > 0) {
        setArtworks(prev => [...prev, ...response.records]);
      }
    } catch (err) {
      console.error('Failed to load more artworks:', err);
    }
  }, [artworks.length]);

  const nextArtwork = useCallback(() => {
    setCurrentIndex(prev => {
      const next = (prev + 1) % artworks.length;
      
      // Preload more artworks when approaching the end
      if (next > artworks.length - 10) {
        loadMoreArtworks();
      }
      
      return next;
    });
  }, [artworks.length, loadMoreArtworks]);

  const previousArtwork = useCallback(() => {
    setCurrentIndex(prev => (prev - 1 + artworks.length) % artworks.length);
  }, [artworks.length]);

  const togglePlay = useCallback(() => {
    setIsPlaying(prev => !prev);
  }, []);

  const toggleInfo = useCallback(() => {
    setShowInfo(prev => !prev);
  }, []);

  // Auto-advance slideshow
  useEffect(() => {
    if (!isPlaying || artworks.length === 0) return;

    const interval = setInterval(() => {
      nextArtwork();
    }, 50000); // Change artwork every 10 seconds

    return () => clearInterval(interval);
  }, [isPlaying, nextArtwork, artworks.length]);

  // Load artworks on mount
  useEffect(() => {
    loadArtworks();
  }, [loadArtworks]);

  // Hide info overlay after 5 seconds when shown
  useEffect(() => {
    if (showInfo) {
      const timeout = setTimeout(() => {
        setShowInfo(false);
      }, 8000);
      
      return () => clearTimeout(timeout);
    }
  }, [showInfo]);

  return {
    artworks,
    currentArtwork: artworks[currentIndex],
    currentIndex,
    isLoading,
    error,
    isPlaying,
    showInfo,
    nextArtwork,
    previousArtwork,
    togglePlay,
    toggleInfo,
    retry: loadArtworks,
  };
};
