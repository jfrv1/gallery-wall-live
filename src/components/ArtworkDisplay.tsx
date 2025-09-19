import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Play, Pause, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Artwork } from '@/types/artwork';
import { HarvardArtAPI } from '@/services/harvardApi';

interface ArtworkDisplayProps {
  artwork: Artwork;
  onNext: () => void;
  onPrevious: () => void;
  isPlaying: boolean;
  onTogglePlay: () => void;
  showInfo: boolean;
  onToggleInfo: () => void;
}

export const ArtworkDisplay = ({
  artwork,
  onNext,
  onPrevious,
  isPlaying,
  onTogglePlay,
  showInfo,
  onToggleInfo,
}: ArtworkDisplayProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const imageUrl = HarvardArtAPI.getHighResImageUrl(artwork);
  const artist = artwork.people?.find(person => 
    person.role === 'Artist' || person.role === 'Painter'
  )?.displayname || 'Unknown Artist';

  useEffect(() => {
    setImageLoaded(false);
    setImageError(false);
  }, [artwork.id]);

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoaded(true);
  };

  return (
    <div className="relative w-full h-screen overflow-hidden gallery-bg">
      {/* Main Artwork Image */}
      <div className="absolute inset-0 flex items-center justify-center">
        {!imageError ? (
          <img
            src={imageUrl}
            alt={artwork.title}
            className={`max-w-full max-h-full object-contain artwork-transition ${
              imageLoaded ? 'fade-in' : 'opacity-0'
            }`}
            onLoad={handleImageLoad}
            onError={handleImageError}
          />
        ) : (
          <div className="text-gallery-muted text-center p-8">
            <p className="text-xl mb-2">Image unavailable</p>
            <p className="text-sm">{artwork.title}</p>
          </div>
        )}
      </div>

      {/* Overlay Controls */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/30">
        {/* Top Controls */}
        <div className="absolute top-6 left-6 right-6 flex justify-between items-start z-10">
          <div className="flex gap-2">
            <Button
              variant="secondary"
              size="icon"
              onClick={onTogglePlay}
              className="bg-black/20 hover:bg-black/40 border-white/20 backdrop-blur-md"
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            </Button>
            <Button
              variant="secondary"
              size="icon"
              onClick={onToggleInfo}
              className="bg-black/20 hover:bg-black/40 border-white/20 backdrop-blur-md"
            >
              <Info className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Navigation Controls */}
        <div className="absolute left-6 top-1/2 -translate-y-1/2 z-10">
          <Button
            variant="secondary"
            size="icon"
            onClick={onPrevious}
            className="bg-black/20 hover:bg-black/40 border-white/20 backdrop-blur-md"
          >
            <ChevronLeft className="w-6 h-6" />
          </Button>
        </div>

        <div className="absolute right-6 top-1/2 -translate-y-1/2 z-10">
          <Button
            variant="secondary"
            size="icon"
            onClick={onNext}
            className="bg-black/20 hover:bg-black/40 border-white/20 backdrop-blur-md"
          >
            <ChevronRight className="w-6 h-6" />
          </Button>
        </div>

        {/* Artwork Information */}
        {showInfo && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/60 to-transparent p-8 pt-16">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-3xl md:text-4xl font-serif-elegant text-white mb-2">
                {artwork.title}
              </h1>
              <p className="text-xl text-white/80 mb-4">{artist}</p>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {artwork.dated && (
                  <Badge variant="secondary" className="bg-white/10 text-white border-white/20">
                    {artwork.dated}
                  </Badge>
                )}
                {artwork.culture && (
                  <Badge variant="secondary" className="bg-white/10 text-white border-white/20">
                    {artwork.culture}
                  </Badge>
                )}
                {artwork.classification && (
                  <Badge variant="secondary" className="bg-white/10 text-white border-white/20">
                    {artwork.classification}
                  </Badge>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-white/70">
                {artwork.medium && (
                  <div>
                    <span className="text-white/90 font-medium">Medium: </span>
                    {artwork.medium}
                  </div>
                )}
                {artwork.dimensions && (
                  <div>
                    <span className="text-white/90 font-medium">Dimensions: </span>
                    {artwork.dimensions}
                  </div>
                )}
                {artwork.department && (
                  <div>
                    <span className="text-white/90 font-medium">Department: </span>
                    {artwork.department}
                  </div>
                )}
                {artwork.creditline && (
                  <div>
                    <span className="text-white/90 font-medium">Credit: </span>
                    {artwork.creditline}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};