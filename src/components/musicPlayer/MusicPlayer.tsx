import { useState, useRef, useEffect } from "react";

export default function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const toggleAudio = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  useEffect(() => {
    const audio = audioRef.current;

    if (audio) {
      const updateCurrentTime = () => setCurrentTime(audio.currentTime);
      const updateDuration = () => setDuration(audio.duration);

      audio.addEventListener("timeupdate", updateCurrentTime);
      audio.addEventListener("loadedmetadata", updateDuration);

      return () => {
        audio.removeEventListener("timeupdate", updateCurrentTime);
        audio.removeEventListener("loadedmetadata", updateDuration);
      };
    }
  }, []);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (audioRef.current) {
      const newTime = parseFloat(e.target.value);
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  return (
    <div className="music-player">
      <audio ref={audioRef} src="/music/saf45929324.mp3" preload="auto"></audio>
      <div className="player-container">
        <button onClick={toggleAudio} className="play-pause-button">
          {isPlaying ? "❚❚" : "▶"}
        </button>
        <div className="time-slider-container">
          <span className="time">{formatTime(currentTime)}</span>
          <input
            type="range"
            min="0"
            max={duration}
            step="0.1"
            value={currentTime}
            onChange={handleSliderChange}
            className="slider"
          />
          <span className="time">{formatTime(duration)}</span>
        </div>
      </div>

      <style jsx>{`
        audio {
          appearance: none; /* 모든 브라우저에서 기본 스타일 제거 */
          -webkit-appearance: none;
        }
        .music-player {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          margin: 20px 0;
        }
        .player-container {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
        }
        .play-pause-button {
          background: none; /* 배경 제거 */
          border: none;
          color: #000; /* 버튼 아이콘 색상 설정 */
          font-size: 24px; /* 아이콘 크기 조정 */
          width: auto; /* 버튼 크기 자동 조정 */
          height: auto;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          outline: none;
        }
        .time-slider-container {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .time {
          font-size: 14px;
          color: #333;
        }
        .slider {
          -webkit-appearance: none;
          width: 200px;
          height: 5px;
          background: #ccc;
          border-radius: 5px;
          outline: none;
        }
        .slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 10px;
          height: 10px;
          background: #333;
          border-radius: 50%;
          cursor: pointer;
        }
        .slider::-moz-range-thumb {
          width: 10px;
          height: 10px;
          background: #333;
          border-radius: 50%;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}
