import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface SquaresBackgroundProps {
  className?: string;
  squareSize?: number;
  speed?: number;
  direction?: "right" | "left" | "up" | "down" | "diagonal";
}

export function SquaresBackground({
  className,
  squareSize = 40,
  speed = 1,
  direction = "right",
}: SquaresBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let offset = 0;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    const draw = () => {
      if (!ctx) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "rgba(var(--primary), 0.1)";

      for (let x = 0; x < canvas.width + squareSize; x += squareSize) {
        for (let y = 0; y < canvas.height + squareSize; y += squareSize) {
          let drawX = x;
          let drawY = y;

          switch (direction) {
            case "right":
              drawX = (x + offset) % (canvas.width + squareSize);
              break;
            case "left":
              drawX = (x - offset) % (canvas.width + squareSize);
              break;
            case "up":
              drawY = (y - offset) % (canvas.height + squareSize);
              break;
            case "down":
              drawY = (y + offset) % (canvas.height + squareSize);
              break;
            case "diagonal":
              drawX = (x + offset) % (canvas.width + squareSize);
              drawY = (y + offset) % (canvas.height + squareSize);
              break;
          }

          ctx.fillRect(drawX, drawY, squareSize - 2, squareSize - 2);
        }
      }

      offset += speed;
      animationFrameId = requestAnimationFrame(draw);
    };

    window.addEventListener("resize", resize);
    resize();
    draw();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [squareSize, speed, direction]);

  return (
    <canvas
      ref={canvasRef}
      className={cn("absolute inset-0 -z-10 h-full w-full", className)}
    />
  );
}