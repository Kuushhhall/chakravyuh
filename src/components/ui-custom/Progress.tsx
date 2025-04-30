
import * as React from "react";
import { cn } from "@/lib/utils";

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number;
  max?: number;
  variant?: "default" | "success" | "warning" | "danger";
  showValue?: boolean;
  size?: "sm" | "default" | "lg";
  animate?: boolean;
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ 
    className, 
    value, 
    max = 100, 
    variant = "default", 
    showValue = false, 
    size = "default", 
    animate = true,
    ...props 
  }, ref) => {
    const percentage = (value / max) * 100;
    
    const variantStyles = {
      default: "bg-black",
      success: "bg-green-500",
      warning: "bg-amber-500",
      danger: "bg-red-500"
    };
    
    const sizeStyles = {
      sm: "h-1",
      default: "h-2",
      lg: "h-3"
    };
    
    return (
      <div
        className={cn("w-full flex items-center gap-2", className)}
        {...props}
      >
        <div
          ref={ref}
          className={cn(
            "w-full overflow-hidden rounded-full bg-secondary",
            sizeStyles[size]
          )}
        >
          <div
            className={cn(
              variantStyles[variant],
              "transition-all duration-300",
              animate && "animate-pulse-soft",
              sizeStyles[size]
            )}
            style={{ width: `${percentage}%` }}
          />
        </div>
        {showValue && (
          <span className="text-xs font-medium">{Math.round(percentage)}%</span>
        )}
      </div>
    );
  }
);
Progress.displayName = "Progress";

export { Progress };
