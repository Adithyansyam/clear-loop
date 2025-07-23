import React, { useEffect, useState } from 'react';
import { CheckCircle2, Sparkles, Star } from 'lucide-react';

interface CelebrationSplashProps {
  show: boolean;
  onComplete: () => void;
  taskTitle: string;
}

export const CelebrationSplash: React.FC<CelebrationSplashProps> = ({
  show,
  onComplete,
  taskTitle
}) => {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; delay: number }>>([]);

  useEffect(() => {
    if (show) {
      // Generate random particles
      const newParticles = Array.from({ length: 12 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        delay: Math.random() * 0.5
      }));
      setParticles(newParticles);

      // Auto-hide after animation
      const timer = setTimeout(() => {
        onComplete();
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [show, onComplete]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/20 animate-fade-in" />
      
      {/* Main celebration content */}
      <div className="relative bg-white rounded-3xl shadow-2xl p-8 mx-4 max-w-sm w-full animate-bounce-in">
        {/* Success icon */}
        <div className="flex justify-center mb-4">
          <div className="relative">
            <CheckCircle2 className="text-green-500 animate-scale-in" size={64} />
            <div className="absolute inset-0 rounded-full bg-green-500/20 animate-ping" />
          </div>
        </div>
        
        {/* Text */}
        <div className="text-center">
          <h3 className="text-xl font-bold text-gray-900 mb-2">Task Completed! 🎉</h3>
          <p className="text-gray-600 font-medium">"{taskTitle}"</p>
          <p className="text-sm text-gray-500 mt-2">Great job staying productive!</p>
        </div>
        
        {/* Floating particles */}
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute pointer-events-none"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              animationDelay: `${particle.delay}s`
            }}
          >
            {particle.id % 3 === 0 ? (
              <Sparkles className="text-yellow-400 animate-float" size={16} />
            ) : particle.id % 3 === 1 ? (
              <Star className="text-purple-400 animate-float" size={14} />
            ) : (
              <div className="w-2 h-2 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full animate-float" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};