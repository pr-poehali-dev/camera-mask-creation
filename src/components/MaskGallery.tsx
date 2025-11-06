import { useState } from 'react';
import { cn } from '@/lib/utils';

interface Mask {
  id: string;
  icon: string;
  name: string;
}

const masks: Mask[] = [
  { id: 'bunny', icon: '🐰', name: 'Зайка' },
  { id: 'cat', icon: '😺', name: 'Котик' },
  { id: 'crown', icon: '👑', name: 'Корона' },
  { id: 'glasses', icon: '🕶️', name: 'Очки' },
  { id: 'sparkle', icon: '✨', name: 'Блёстки' },
];

interface MaskGalleryProps {
  selectedMask: string | null;
  onSelectMask: (maskId: string | null) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const MaskGallery = ({ selectedMask, onSelectMask, isOpen, onClose }: MaskGalleryProps) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl p-6 pb-8 animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-6" />
        
        <h2 className="text-2xl font-semibold mb-6 text-center">Маски</h2>
        
        <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
          {masks.map((mask) => (
            <button
              key={mask.id}
              onClick={() => {
                onSelectMask(selectedMask === mask.id ? null : mask.id);
                onClose();
              }}
              className={cn(
                "flex flex-col items-center justify-center gap-2 p-4 rounded-2xl transition-all",
                "bg-gray-50 hover:bg-gray-100 active:scale-95",
                selectedMask === mask.id && "bg-primary/10 ring-2 ring-primary"
              )}
            >
              <span className="text-5xl">{mask.icon}</span>
              <span className="text-sm font-medium">{mask.name}</span>
            </button>
          ))}
        </div>

        <button
          onClick={() => {
            onSelectMask(null);
            onClose();
          }}
          className="w-full mt-6 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 font-medium transition-colors"
        >
          Сбросить маску
        </button>
      </div>
    </div>
  );
};
