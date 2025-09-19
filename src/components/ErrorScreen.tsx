import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

interface ErrorScreenProps {
  error: string;
  onRetry: () => void;
}

export const ErrorScreen = ({ error, onRetry }: ErrorScreenProps) => {
  return (
    <div className="w-full h-screen flex items-center justify-center gallery-bg">
      <div className="text-center max-w-md">
        <div className="text-6xl mb-6">🎨</div>
        <h2 className="text-2xl font-serif-elegant text-gallery mb-4">
          Unable to Load Gallery
        </h2>
        <p className="text-gallery-muted mb-6">
          {error}
        </p>
        <Button 
          onClick={onRetry}
          variant="outline"
          className="bg-transparent border-gallery-accent text-gallery-accent hover:bg-gallery-accent hover:text-black"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Try Again
        </Button>
      </div>
    </div>
  );
};