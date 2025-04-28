
import { ReactNode, useState } from 'react';
import { Plus, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FloatingActionButtonProps {
  children: ReactNode;
  className?: string;
}

export function FloatingActionButton({
  children,
  className,
}: FloatingActionButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={cn("fixed bottom-6 right-6 z-50", className)}>
      <div className="relative">
        {/* Action menu */}
        {isOpen && (
          <div className="absolute bottom-16 right-0 flex flex-col gap-3 items-end animate-in slide-in-from-bottom-5 duration-300">
            {children}
          </div>
        )}
        
        {/* Main button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="h-14 w-14 rounded-full shadow-neo flex items-center justify-center bg-gradient-to-br from-primary to-secondary hover:shadow-glow transition-all duration-300"
          aria-label={isOpen ? "Close menu" : "Open menu"}
        >
          {isOpen ? (
            <X className="h-6 w-6 text-primary-foreground" />
          ) : (
            <Plus className="h-6 w-6 text-primary-foreground" />
          )}
          <span className="sr-only">{isOpen ? "Close menu" : "Open actions"}</span>
        </button>
      </div>
    </div>
  );
}

export interface FloatingActionItemProps {
  icon: ReactNode;
  label: string;
  onClick: () => void;
}

export function FloatingActionItem({
  icon,
  label,
  onClick,
}: FloatingActionItemProps) {
  return (
    <div className="flex items-center gap-3 animate-in fade-in zoom-in duration-300">
      <span className="glass text-foreground px-3 py-2 rounded-lg text-sm">
        {label}
      </span>
      <button
        onClick={onClick}
        className="h-12 w-12 rounded-full shadow-neo-sm flex items-center justify-center bg-gradient-to-br from-primary/80 to-secondary/80 hover:shadow-glow-sm transition-all duration-300"
        aria-label={label}
      >
        {icon}
        <span className="sr-only">{label}</span>
      </button>
    </div>
  );
}
