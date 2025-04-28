
import { useRef, useEffect, useState } from 'react';
import { Stage, Layer, Text, Line, Rect, Circle, Arrow, Image as KonvaImage } from 'react-konva';
import Konva from 'konva';

interface WhiteboardCanvasProps {
  width: number;
  height: number;
  timelineCommands?: TimelineCommand[];
  isAISpeaking: boolean;
  currentTextContent?: string;
}

export type TimelineCommand = {
  type: 'text' | 'line' | 'rect' | 'circle' | 'arrow' | 'image' | 'clear';
  time: number; // When to execute this command (seconds from start)
  content?: string; // For text
  points?: number[]; // For lines and arrows
  position?: { x: number; y: number };
  size?: { width: number; height: number };
  radius?: number; // For circles
  color?: string;
  fontSize?: number;
  fontFamily?: string;
  strokeWidth?: number;
  id?: string; // Unique identifier
  duration?: number; // Duration of the animation in seconds
  imageUrl?: string; // For images
};

const WhiteboardCanvas: React.FC<WhiteboardCanvasProps> = ({ 
  width, 
  height, 
  timelineCommands = [], 
  isAISpeaking,
  currentTextContent
}) => {
  const stageRef = useRef<Konva.Stage>(null);
  const [visibleElements, setVisibleElements] = useState<TimelineCommand[]>([]);
  const [writingText, setWritingText] = useState<string>('');
  const [writingProgress, setWritingProgress] = useState(0);
  const animationRef = useRef<number | null>(null);
  
  // Simulate writing animation when current text content changes
  useEffect(() => {
    if (currentTextContent && isAISpeaking) {
      let progress = 0;
      const textLength = currentTextContent.length;
      
      const animateWriting = () => {
        progress += 1;
        setWritingProgress(progress);
        
        if (progress <= textLength) {
          setWritingText(currentTextContent.substring(0, progress));
          animationRef.current = requestAnimationFrame(animateWriting);
        } else {
          // Animation complete
          cancelAnimationFrame(animationRef.current!);
        }
      };
      
      // Start animation
      setWritingText('');
      setWritingProgress(0);
      animationRef.current = requestAnimationFrame(animateWriting);
      
      // Cleanup
      return () => {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
      };
    }
  }, [currentTextContent, isAISpeaking]);

  // Example function to add a timeline element
  const addTimelineElement = (command: TimelineCommand) => {
    setVisibleElements(prev => [...prev, command]);
  };

  // Clear whiteboard
  const clearWhiteboard = () => {
    setVisibleElements([]);
    setWritingText('');
  };

  return (
    <div className="whiteboard-container relative bg-white rounded-lg shadow-sm overflow-hidden">
      <Stage width={width} height={height} ref={stageRef}>
        <Layer>
          {/* Render visible elements from timeline */}
          {visibleElements.map((element, index) => {
            switch (element.type) {
              case 'text':
                return (
                  <Text
                    key={element.id || `text-${index}`}
                    text={element.content || ''}
                    x={element.position?.x || 20}
                    y={element.position?.y || 20}
                    fontSize={element.fontSize || 20}
                    fontFamily={element.fontFamily || 'Patrick Hand, cursive'}
                    fill={element.color || 'black'}
                  />
                );
              case 'line':
                return (
                  <Line
                    key={element.id || `line-${index}`}
                    points={element.points || []}
                    stroke={element.color || 'black'}
                    strokeWidth={element.strokeWidth || 2}
                    lineCap="round"
                    lineJoin="round"
                  />
                );
              case 'rect':
                return (
                  <Rect
                    key={element.id || `rect-${index}`}
                    x={element.position?.x || 0}
                    y={element.position?.y || 0}
                    width={element.size?.width || 100}
                    height={element.size?.height || 100}
                    fill={element.color || 'transparent'}
                    stroke={element.color || 'black'}
                    strokeWidth={element.strokeWidth || 2}
                  />
                );
              case 'circle':
                return (
                  <Circle
                    key={element.id || `circle-${index}`}
                    x={element.position?.x || 0}
                    y={element.position?.y || 0}
                    radius={element.radius || 50}
                    fill={element.color || 'transparent'}
                    stroke={element.color || 'black'}
                    strokeWidth={element.strokeWidth || 2}
                  />
                );
              case 'arrow':
                return (
                  <Arrow
                    key={element.id || `arrow-${index}`}
                    points={element.points || []}
                    pointerLength={10}
                    pointerWidth={10}
                    fill={element.color || 'black'}
                    stroke={element.color || 'black'}
                    strokeWidth={element.strokeWidth || 2}
                  />
                );
              default:
                return null;
            }
          })}
          
          {/* Current writing animation */}
          {writingText && (
            <Text
              text={writingText}
              x={20}
              y={height - 100}
              fontSize={32}
              fontFamily="Patrick Hand, cursive"
              fill="#333"
            />
          )}
        </Layer>
      </Stage>
    </div>
  );
};

export default WhiteboardCanvas;
