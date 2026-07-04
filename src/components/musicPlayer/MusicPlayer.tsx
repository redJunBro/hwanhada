"use client";
import { Play, Pause } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";

type MusicPlayerProps = {
  isPlaying: boolean;
  onToggle: () => void;
  currentTime: number;
  duration: number;
  onSeek: (time: number) => void;
};

export default function MusicPlayer({
  isPlaying,
  onToggle,
  currentTime,
  duration,
  onSeek,
}: MusicPlayerProps) {
  const { theme } = useTheme();

  const fmt = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec < 10 ? "0" : ""}${sec}`;
  };

  const pct = duration > 0 ? (currentTime / duration) * 100 : 0;
  const fill  = theme === "light" ? "#78716c" : "#a8a29e";
  const track = theme === "light" ? "#e7e5e4" : "#44403c";
  const thumb = theme === "light" ? "#57534e" : "#d6d3d1";

  return (
    <div className="flex items-center gap-3 px-1 py-1">
      <button
        onClick={onToggle}
        aria-label={isPlaying ? "일시정지" : "재생"}
        className="
          flex-none w-9 h-9 flex items-center justify-center rounded-full
          bg-stone-200/70 dark:bg-stone-800/70
          hover:bg-stone-300/90 dark:hover:bg-stone-700/90
          active:scale-95 transition-all duration-150
          text-stone-600 dark:text-stone-300
        "
      >
        {isPlaying
          ? <Pause className="w-4 h-4" />
          : <Play  className="w-4 h-4 translate-x-px" />
        }
      </button>

      <div className="flex-1 relative flex items-center">
        <input
          type="range"
          min={0}
          max={duration || 100}
          step={0.1}
          value={currentTime}
          onChange={(e) => onSeek(parseFloat(e.target.value))}
          className="music-slider w-full h-[3px] rounded-full outline-none cursor-pointer"
          style={{
            WebkitAppearance: "none",
            appearance: "none",
            background: `linear-gradient(to right, ${fill} ${pct}%, ${track} ${pct}%)`,
            ["--thumb-color" as string]: thumb,
          }}
        />
      </div>

      <span className="flex-none text-xs tabular-nums text-stone-400 dark:text-stone-500 font-incheon whitespace-nowrap">
        {fmt(currentTime)} / {fmt(duration)}
      </span>

      <style>{`
        .music-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background: var(--thumb-color, #57534e);
          cursor: pointer;
          border: none;
          box-shadow: 0 1px 3px rgba(0,0,0,0.2);
        }
        .music-slider::-moz-range-thumb {
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background: var(--thumb-color, #57534e);
          cursor: pointer;
          border: none;
          box-shadow: 0 1px 3px rgba(0,0,0,0.2);
        }
        .music-slider::-webkit-slider-runnable-track {
          height: 3px;
          border-radius: 9999px;
        }
        .music-slider::-moz-range-track {
          height: 3px;
          border-radius: 9999px;
        }
      `}</style>
    </div>
  );
}
