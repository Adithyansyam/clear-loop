import React, { useState, useRef, useEffect } from 'react';
import { Trash2, ArrowLeft, ArrowRight, Sparkles } from 'lucide-react';

interface Task {
  id: string;
  title: string;
  date: string;
  status: 'active' | 'draft' | 'completed';
  assignedDate: string;
  createdAt: number;
}

interface SwipeableTaskCardProps {
  task: Task;
  onSwipeLeft?: (taskId: string) => void;
  onSwipeRight: (taskId: string) => void;
  onDelete: (taskId: string) => void;
  showLeftSwipe?: boolean;
  formatDate: (dateString: string) => string;
  onAnimationComplete?: () => void;
}

export const SwipeableTaskCard: React.FC<SwipeableTaskCardProps> = ({
  task,
  onSwipeLeft,
  onSwipeRight,
  onDelete,
  showLeftSwipe = true,
  formatDate,
  onAnimationComplete
}) => {
  const [dragX, setDragX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationType, setAnimationType] = useState<'complete' | 'draft' | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    setStartX(e.touches[0].clientX);
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    
    const currentX = e.touches[0].clientX;
    const diff = currentX - startX;
    
    // Limit drag distance
    const maxDrag = 120;
    const limitedDrag = Math.max(-maxDrag, Math.min(maxDrag, diff));
    setDragX(limitedDrag);
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    
    const threshold = 60;
    
    if (dragX > threshold) {
      // Swipe right - complete task
      triggerCompleteAnimation();
    } else if (dragX < -threshold && showLeftSwipe && onSwipeLeft) {
      // Swipe left - move to draft
      triggerDraftAnimation();
    }
    
    setDragX(0);
    setIsDragging(false);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setStartX(e.clientX);
    setIsDragging(true);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    
    const currentX = e.clientX;
    const diff = currentX - startX;
    
    const maxDrag = 120;
    const limitedDrag = Math.max(-maxDrag, Math.min(maxDrag, diff));
    setDragX(limitedDrag);
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    
    const threshold = 60;
    
    if (dragX > threshold) {
      triggerCompleteAnimation();
    } else if (dragX < -threshold && showLeftSwipe && onSwipeLeft) {
      triggerDraftAnimation();
    }
    
    setDragX(0);
    setIsDragging(false);
  };

  const triggerCompleteAnimation = () => {
    setIsAnimating(true);
    setAnimationType('complete');
    setDragX(0);
    setIsDragging(false);
    
    // Trigger celebration effect
    setTimeout(() => {
      onSwipeRight(task.id);
      onAnimationComplete?.();
    }, 600);
  };

  const triggerDraftAnimation = () => {
    setIsAnimating(true);
    setAnimationType('draft');
    setDragX(0);
    setIsDragging(false);
    
    setTimeout(() => {
      if (onSwipeLeft) {
        onSwipeLeft(task.id);
      }
    }, 400);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, dragX, startX]);

  const getBackgroundColor = () => {
    if (isAnimating && animationType === 'complete') return 'bg-gradient-to-r from-green-400 to-emerald-500';
    if (isAnimating && animationType === 'draft') return 'bg-gradient-to-r from-orange-400 to-amber-500';
    if (dragX > 60) return 'bg-green-100';
    if (dragX < -60 && showLeftSwipe) return 'bg-orange-100';
    return 'bg-white';
  };

  const getActionIcon = () => {
    if (dragX > 60) {
      return <ArrowRight className="text-green-600" size={24} />;
    }
    if (dragX < -60 && showLeftSwipe) {
      return <ArrowLeft className="text-orange-600" size={24} />;
    }
    return null;
  };

  const getCardTransform = () => {
    if (isAnimating && animationType === 'complete') {
      return 'translateX(100%) scale(0.8) rotate(12deg)';
    }
    if (isAnimating && animationType === 'draft') {
      return 'translateX(-100%) scale(0.9) rotate(-8deg)';
    }
    return `translateX(${dragX}px)`;
  };

  return (
    <div className="relative overflow-hidden rounded-2xl group">
      {/* Background actions */}
      <div className="absolute inset-0 flex items-center justify-between px-8">
        {showLeftSwipe && (
          <div className="flex items-center gap-3 text-orange-600">
            <div className="w-8 h-8 bg-orange-500 rounded-xl flex items-center justify-center">
              <ArrowLeft className="text-white" size={16} />
            </div>
            <span className="font-semibold">Move to Draft</span>
          </div>
        )}
        <div className="flex items-center gap-3 text-green-600 ml-auto">
          <span className="font-semibold">Mark Complete</span>
          <div className="w-8 h-8 bg-green-500 rounded-xl flex items-center justify-center">
            <ArrowRight className="text-white" size={16} />
          </div>
        </div>
      </div>

      {/* Main card */}
      <div
        ref={cardRef}
        className={`relative ${getBackgroundColor()} rounded-2xl shadow-sm border border-gray-100 p-6 cursor-grab active:cursor-grabbing select-none ${
          isAnimating ? 'transition-all duration-500 ease-out' : 'transition-all duration-200'
        } ${isAnimating && animationType === 'complete' ? 'shadow-2xl shadow-green-500/30' : ''} ${
          isAnimating && animationType === 'draft' ? 'shadow-xl shadow-orange-500/20' : ''
        }`}
        style={{
          transform: getCardTransform(),
          transition: isDragging ? 'none' : isAnimating ? 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)' : 'transform 0.3s ease-out, background-color 0.2s ease',
          opacity: isAnimating ? 0.8 : 1
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
      >
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h3 className={`font-semibold text-lg mb-2 ${
              isAnimating && animationType === 'complete' ? 'text-white' : 
              isAnimating && animationType === 'draft' ? 'text-white' : 'text-gray-900'
            }`}>
              {task.title}
            </h3>
            {task.status === 'draft' && (
              <div className={`flex items-center gap-2 text-sm ${
                isAnimating && animationType === 'complete' ? 'text-green-100' : 'text-gray-600'
              }`}>
                <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                <span>Originally assigned on {formatDate(task.assignedDate)}</span>
              </div>
            )}
          </div>
          
          {/* Celebration sparkles for completion */}
          {isAnimating && animationType === 'complete' && (
            <div className="absolute inset-0 pointer-events-none">
              <Sparkles className="absolute top-3 right-3 text-yellow-300 animate-pulse" size={18} />
              <Sparkles className="absolute top-6 left-6 text-yellow-200 animate-pulse" size={14} style={{ animationDelay: '0.2s' }} />
              <Sparkles className="absolute bottom-4 right-12 text-yellow-400 animate-pulse" size={16} style={{ animationDelay: '0.4s' }} />
              <Sparkles className="absolute bottom-6 left-8 text-yellow-300 animate-pulse" size={12} style={{ animationDelay: '0.6s' }} />
            </div>
          )}
          
          {/* Action icon during swipe */}
          {getActionIcon() && (
            <div className="ml-6">
              {getActionIcon()}
            </div>
          )}
          
          {/* Delete button (always visible on hover) */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(task.id);
            }}
            className={`p-2.5 text-red-500 hover:bg-red-50 rounded-xl transition-colors ml-4 ${
              isAnimating ? 'opacity-0' : 'opacity-0 group-hover:opacity-100'
            }`}
            title="Delete Task"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};