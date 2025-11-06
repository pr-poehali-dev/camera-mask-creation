import { useState } from 'react';
import { Camera } from '@/components/Camera';
import { MaskGallery } from '@/components/MaskGallery';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';

const Index = () => {
  const [selectedMask, setSelectedMask] = useState<string | null>(null);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [showFlash, setShowFlash] = useState(false);

  const handleCapture = () => {
    setShowFlash(true);
    setTimeout(() => setShowFlash(false), 200);
  };

  return (
    <div className="fixed inset-0 bg-black flex flex-col">
      <header className="absolute top-0 left-0 right-0 z-20 p-4 flex justify-between items-center">
        <Button
          variant="ghost"
          size="icon"
          className="w-12 h-12 rounded-full bg-black/30 backdrop-blur-md text-white hover:bg-black/40"
        >
          <Icon name="Settings" size={24} />
        </Button>
        
        <div className="text-white font-semibold text-lg tracking-tight">
          AR Camera
        </div>
        
        <Button
          variant="ghost"
          size="icon"
          className="w-12 h-12 rounded-full bg-black/30 backdrop-blur-md text-white hover:bg-black/40"
        >
          <Icon name="Zap" size={24} />
        </Button>
      </header>

      <main className="flex-1 relative">
        <Camera 
          selectedMask={selectedMask} 
          onCapture={handleCapture}
        />
        
        {showFlash && (
          <div className="absolute inset-0 bg-white animate-fade-in pointer-events-none" />
        )}
      </main>

      <footer className="absolute bottom-32 left-0 right-0 z-20 px-8">
        <div className="flex justify-center gap-4">
          <Button
            onClick={() => setIsGalleryOpen(true)}
            className="px-8 py-6 rounded-2xl bg-white/90 hover:bg-white text-black font-semibold shadow-2xl backdrop-blur-md transition-all active:scale-95"
          >
            <Icon name="Sparkles" size={24} className="mr-2" />
            Маски
          </Button>
        </div>
      </footer>

      <MaskGallery
        selectedMask={selectedMask}
        onSelectMask={setSelectedMask}
        isOpen={isGalleryOpen}
        onClose={() => setIsGalleryOpen(false)}
      />
    </div>
  );
};

export default Index;
