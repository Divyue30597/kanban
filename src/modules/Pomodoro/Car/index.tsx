import { memo, useEffect, useState, useRef } from "react";
import "./car.scss";
import car_stopped from "./sedan_car_stopped.svg";
import car_driving from "./sedan_car_driving.svg";
import VirtualizedRoadLines from "./virtualizedRoadLines";

interface CarProps {
  timer?: number; // in minutes
  isRunning?: {
    pomodoro: boolean;
    shortBreak: boolean;
    longBreak: boolean;
  };
}

const Car = memo(function Car({ timer = 25, isRunning }: CarProps) {
  const [progress, setProgress] = useState(0);
  const elapsedRef = useRef<number>(0);
  const lastUpdateRef = useRef<number>(0);

  // Reset progress when timer changes
  useEffect(() => {
    setProgress(0);
    elapsedRef.current = 0;
  }, [timer]);

  useEffect(() => {
    const initialTime = timer * 60; // Convert minutes to seconds
    let animationFrameId: number;

    // Store the current time whenever the animation starts/resumes
    if (isRunning?.pomodoro) {
      lastUpdateRef.current = Date.now();
    }

    const updateProgress = () => {
      if (isRunning?.pomodoro) {
        // Calculate time since last update
        const now = Date.now();
        const delta = (now - lastUpdateRef.current) / 1000;
        lastUpdateRef.current = now;

        // Add to total elapsed time
        elapsedRef.current += delta;

        // Calculate and set progress percentage
        const newProgress = Math.min(
          (elapsedRef.current / initialTime) * 100,
          100
        );
        setProgress(newProgress);
      }

      // Continue animation loop if running
      if (isRunning?.pomodoro) {
        animationFrameId = requestAnimationFrame(updateProgress);
      }
    };

    // Only start animation if actually running
    if (isRunning?.pomodoro) {
      animationFrameId = requestAnimationFrame(updateProgress);
    }

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [timer, isRunning?.pomodoro]);

  return (
    <div
      className="road"
      style={{ "--progress": `${progress}%` } as React.CSSProperties}
    >
      <img
        src={isRunning?.pomodoro ? car_driving : car_stopped}
        alt="a car running"
        style={{
          display: "block",
          transform: "scale(-1,1)",
          width: "20rem",
          left: "var(--progress)",
          willChange: "transform, left",
        }}
      />
      <VirtualizedRoadLines
        progress={progress}
        timer={timer}
      />
    </div>
  );
});

export default Car;
