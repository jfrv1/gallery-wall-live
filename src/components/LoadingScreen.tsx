export const LoadingScreen = () => {
  return (
    <div className="w-full h-screen flex items-center justify-center gallery-bg">
      <div className="text-center">
        <div className="w-16 h-16 border-2 border-gallery-accent border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
        <h2 className="text-2xl font-serif-elegant text-gallery mb-2">
          Curating Masterpieces
        </h2>
        <p className="text-gallery-muted">
          Loading artwork from Harvard Art Museums...
        </p>
      </div>
    </div>
  );
};