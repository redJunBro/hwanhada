"use client";
import { useEffect, useState } from "react";

export type WeatherMode = "none" | "snow" | "rain" | "sakura";

type Particle = {
  left: number;
  delay: number;
  duration: number;
  width: number;
  height: number;
  opacity: number;
};

export default function WeatherEffect({ mode }: { mode: WeatherMode }) {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (mode === "none") {
      setParticles([]);
      return;
    }
    setParticles(
      Array.from({ length: 50 }, () => ({
        left: Math.random() * 100,
        delay: Math.random() * 4,
        duration:
          mode === "rain"
            ? 1.7 + Math.random() * 2.5
            : mode === "snow"
              ? 4 + Math.random() * 6
              : 5 + Math.random() * 7,
        width:
          mode === "rain" ? 1.5 : mode === "snow" ? 4 + Math.random() * 5 : 7 + Math.random() * 7,
        height:
          mode === "rain"
            ? 12 + Math.random() * 20
            : mode === "snow"
              ? 4 + Math.random() * 5
              : 4 + Math.random() * 5,
        opacity: 0.5 + Math.random() * 0.5,
      })),
    );
  }, [mode]);

  if (mode === "none" || particles.length === 0) return null;

  return (
    <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden z-50">
      {particles.map((p, i) => (
        <div
          key={i}
          className={`weather-particle weather-${mode}`}
          style={{
            left: `${p.left}%`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            width: `${p.width}px`,
            height: `${p.height}px`,
            opacity: p.opacity,
          }}
        />
      ))}
      <style jsx>{`
        .weather-particle {
          position: absolute;
          top: -10%;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }

        /* 비 */
        .weather-rain {
          background: rgba(120, 180, 255, 0.7);
          border-radius: 1px;
          animation-name: rain-drop;
        }
        @keyframes rain-drop {
          0% { transform: translateY(0); opacity: 1; }
          100% { transform: translateY(110vh); opacity: 0.4; }
        }

        /* 눈 */
        .weather-snow {
          background: rgba(220, 235, 255, 0.95);
          border-radius: 50%;
          animation-name: snow-fall;
          animation-timing-function: ease-in-out;
        }
        @keyframes snow-fall {
          0%   { transform: translateY(0)     translateX(0)    rotate(0deg);   opacity: 1; }
          33%  { transform: translateY(33vh)  translateX(18px) rotate(120deg); }
          66%  { transform: translateY(66vh)  translateX(-14px) rotate(240deg); }
          100% { transform: translateY(110vh) translateX(6px)  rotate(360deg); opacity: 0.3; }
        }

        /* 벚꽃 */
        .weather-sakura {
          background: rgba(255, 182, 200, 0.85);
          border-radius: 60% 40% 60% 40%;
          animation-name: sakura-fall;
          animation-timing-function: ease-in-out;
        }
        @keyframes sakura-fall {
          0%   { transform: translateY(0)     translateX(0)     rotate(0deg);   opacity: 1; }
          25%  { transform: translateY(25vh)  translateX(28px)  rotate(80deg);  }
          50%  { transform: translateY(50vh)  translateX(-18px) rotate(170deg); }
          75%  { transform: translateY(75vh)  translateX(22px)  rotate(260deg); }
          100% { transform: translateY(110vh) translateX(-8px)  rotate(360deg); opacity: 0.3; }
        }
      `}</style>
    </div>
  );
}
