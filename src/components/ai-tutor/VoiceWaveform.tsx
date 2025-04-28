
import React, { useEffect, useRef } from 'react';

interface VoiceWaveformProps {
  isActive: boolean;
  color?: string;
  type?: 'ai' | 'user';
  height?: number;
}

const VoiceWaveform: React.FC<VoiceWaveformProps> = ({ 
  isActive, 
  color = '#7c3aed',
  type = 'ai',
  height = 40
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  
  // Animation function for drawing the waveform
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas dimensions
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);
    
    let frame = 0;
    
    const animate = () => {
      frame++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const barWidth = 3;
      const barGap = 2;
      const numBars = Math.floor(rect.width / (barWidth + barGap));
      const centerY = height / 2;
      
      for (let i = 0; i < numBars; i++) {
        let barHeight;
        
        if (isActive) {
          // Dynamic height based on time and position
          if (type === 'ai') {
            // Smoother wave pattern for AI
            barHeight = Math.abs(Math.sin((frame + i * 2) / 15) * (height / 2) * 0.8);
          } else {
            // More erratic pattern for user
            barHeight = Math.abs(Math.sin((frame + i * 5) / 10) * (height / 2) * 0.6 + 
                                Math.random() * (height / 5));
          }
        } else {
          // Minimal animation when inactive
          barHeight = Math.abs(Math.sin((frame + i) / 30) * 3);
        }
        
        const x = i * (barWidth + barGap);
        
        // Draw with rounded caps
        ctx.beginPath();
        ctx.roundRect(
          x, 
          centerY - barHeight / 2, 
          barWidth, 
          barHeight,
          2 // Radius for rounded corners
        );
        ctx.fillStyle = isActive ? color : '#d1d5db'; // Gray when inactive
        ctx.fill();
      }
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isActive, color, type, height]);

  return (
    <canvas 
      ref={canvasRef} 
      className="voice-waveform" 
      style={{ 
        width: '100%', 
        height: `${height}px`
      }} 
    />
  );
};

export default VoiceWaveform;
