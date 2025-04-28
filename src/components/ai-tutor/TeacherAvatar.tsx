
import { useState, useEffect } from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Teacher } from '@/data/teacherProfiles';

interface TeacherAvatarProps {
  teacher: Teacher;
  isSpeaking: boolean;
  isListening: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const TeacherAvatar: React.FC<TeacherAvatarProps> = ({ 
  teacher, 
  isSpeaking, 
  isListening, 
  size = 'md' 
}) => {
  const [animation, setAnimation] = useState<'idle' | 'speaking' | 'listening'>('idle');
  
  useEffect(() => {
    if (isSpeaking) {
      setAnimation('speaking');
    } else if (isListening) {
      setAnimation('listening');
    } else {
      setAnimation('idle');
    }
  }, [isSpeaking, isListening]);

  // Determine size class based on the size prop
  const sizeClass = {
    sm: 'h-16 w-16',
    md: 'h-24 w-24',
    lg: 'h-32 w-32'
  }[size];

  return (
    <div className={`teacher-avatar relative ${animation === 'speaking' ? 'speaking' : ''}`}>
      <div className={`rounded-full overflow-hidden ${sizeClass} relative z-10`}>
        <Avatar className="h-full w-full">
          <AvatarImage src={teacher.avatar} alt={teacher.name} />
          <AvatarFallback>{teacher.name.charAt(0)}</AvatarFallback>
        </Avatar>
      </div>
      
      {/* Animated rings around avatar when speaking */}
      {isSpeaking && (
        <>
          {[...Array(3)].map((_, i) => (
            <div 
              key={`ring-${i}`}
              className="absolute inset-0 rounded-full border-2 border-primary/40 animate-ping z-0"
              style={{ 
                animationDuration: `${1.5 + i * 0.5}s`,
                animationDelay: `${i * 0.2}s`,
                opacity: 0.8 - (i * 0.2)
              }}
            />
          ))}
        </>
      )}
      
      {/* Pulse effect when listening */}
      {isListening && (
        <div className="absolute inset-0 rounded-full border-2 border-green-400/40 animate-pulse z-0" />
      )}
      
      <div className="mt-2 text-center">
        <h4 className="font-medium text-sm">{teacher.name}</h4>
        <p className="text-xs text-muted-foreground">{teacher.title}</p>
      </div>
    </div>
  );
};

export default TeacherAvatar;
