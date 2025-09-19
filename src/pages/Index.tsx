import { ArtworkDisplay } from '@/components/ArtworkDisplay';
import { LoadingScreen } from '@/components/LoadingScreen';
import { ErrorScreen } from '@/components/ErrorScreen';
import { useArtworkSlideshow } from '@/hooks/useArtworkSlideshow';

const Index = () => {
  const {
    currentArtwork,
    isLoading,
    error,
    isPlaying,
    showInfo,
    nextArtwork,
    previousArtwork,
    togglePlay,
    toggleInfo,
    retry,
  } = useArtworkSlideshow();

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (error || !currentArtwork) {
    return <ErrorScreen error={error || 'No artwork available'} onRetry={retry} />;
  }

  return (
    <ArtworkDisplay
      artwork={currentArtwork}
      onNext={nextArtwork}
      onPrevious={previousArtwork}
      isPlaying={isPlaying}
      onTogglePlay={togglePlay}
      showInfo={showInfo}
      onToggleInfo={toggleInfo}
    />
  );
};

export default Index;
