import { useEffect, useRef, useState } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';

interface CameraProps {
  selectedMask: string | null;
  onCapture: () => void;
}

export const Camera = ({ selectedMask, onCapture }: CameraProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { 
            facingMode: 'user',
            width: { ideal: 1280 },
            height: { ideal: 720 }
          }
        });
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setIsStreaming(true);
        }
      } catch (err) {
        setError('Не удалось получить доступ к камере');
        console.error('Camera error:', err);
      }
    };

    startCamera();

    return () => {
      if (videoRef.current?.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  useEffect(() => {
    if (!canvasRef.current || !videoRef.current || !isStreaming) return;

    const canvas = canvasRef.current;
    const video = videoRef.current;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return;

    const drawFrame = () => {
      if (video.readyState === video.HAVE_ENOUGH_DATA) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        if (selectedMask) {
          applyMaskEffect(ctx, canvas.width, canvas.height, selectedMask);
        }
      }
      
      requestAnimationFrame(drawFrame);
    };

    drawFrame();
  }, [isStreaming, selectedMask]);

  const applyMaskEffect = (ctx: CanvasRenderingContext2D, width: number, height: number, mask: string) => {
    const centerX = width / 2;
    const centerY = height / 3;

    ctx.save();
    
    switch(mask) {
      case 'bunny':
        ctx.font = `${width * 0.2}px Arial`;
        ctx.textAlign = 'center';
        ctx.fillText('🐰', centerX, centerY);
        break;
        
      case 'cat':
        ctx.font = `${width * 0.2}px Arial`;
        ctx.textAlign = 'center';
        ctx.fillText('😺', centerX, centerY);
        break;
        
      case 'crown':
        ctx.font = `${width * 0.15}px Arial`;
        ctx.textAlign = 'center';
        ctx.fillText('👑', centerX, centerY - height * 0.15);
        break;
        
      case 'glasses':
        ctx.font = `${width * 0.15}px Arial`;
        ctx.textAlign = 'center';
        ctx.fillText('🕶️', centerX, centerY);
        break;
        
      case 'sparkle':
        ctx.globalAlpha = 0.7;
        ctx.fillStyle = '#8B5CF6';
        for (let i = 0; i < 20; i++) {
          const x = Math.random() * width;
          const y = Math.random() * height;
          const size = Math.random() * 30 + 10;
          ctx.beginPath();
          ctx.arc(x, y, size, 0, Math.PI * 2);
          ctx.fill();
        }
        break;
    }
    
    ctx.restore();
  };

  const handleCapture = () => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `mask-photo-${Date.now()}.png`;
        link.click();
        URL.revokeObjectURL(url);
      }
    });
    
    onCapture();
  };

  if (error) {
    return (
      <div className="flex items-center justify-center h-full bg-black text-white">
        <div className="text-center">
          <Icon name="Camera" size={64} className="mx-auto mb-4 opacity-50" />
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full bg-black overflow-hidden">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="absolute inset-0 w-full h-full object-cover opacity-0"
      />
      
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full object-cover"
      />

      <div className="absolute bottom-8 left-0 right-0 flex justify-center items-center gap-8 z-10">
        <Button
          onClick={handleCapture}
          size="lg"
          className="w-20 h-20 rounded-full bg-white hover:bg-gray-100 border-4 border-black shadow-2xl transition-transform active:scale-95"
        >
          <Icon name="Camera" size={32} className="text-black" />
        </Button>
      </div>
    </div>
  );
};
