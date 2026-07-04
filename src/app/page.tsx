"use client";
import * as React from "react";
import { useState, useMemo, useEffect, useRef } from "react";
import Image from "next/image";
import { Moon, Sun, Cloud, Snowflake, CloudRain, Cherry } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import { Book, BookData } from "@/utils/data";
import FullScreenModal from "@/components/hong/test/FullScreenModal";
import WeatherEffect, { WeatherMode } from "@/components/WeatherEffect";
import MusicPlayer from "@/components/musicPlayer/MusicPlayer";
import { useTheme } from "@/hooks/useTheme";

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

const StyleCarousel = ({
  title,
  bookList,
  onItemClick,
  theme,
}: {
  title: string;
  bookList: Book[];
  onItemClick: (book: Book) => void;
  theme: "light" | "dark";
}) => {
  return (
    <div className="flex flex-col items-center w-full px-8 mb-20">
      <div className="w-full flex items-center gap-3 mb-10">
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-stone-400/50 dark:via-stone-500/30 to-transparent" />
        <div className="w-1.5 h-1.5 rounded-full bg-stone-400/60 dark:bg-stone-500/40" />
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-stone-400/50 dark:via-stone-500/30 to-transparent" />
      </div>
      {(() => {
        const normalized = title.replace(/[''ʼ']/g, "'");
        const parts = normalized.split("'");
        const mainTitle = parts[0].trim();
        const subTitle = parts[1]?.trim() ?? "";
        return (
          <div className="mb-6 text-center font-incheon">
            <div className="text-sm tracking-[0.15em] text-stone-500 dark:text-stone-400">
              {mainTitle}
            </div>
            {subTitle && (
              <div className="mt-1 text-xm text-stone-800 dark:text-stone-200">
                {subTitle}
              </div>
            )}
          </div>
        );
      })()}
      {bookList.length > 0 && (
        <div className="w-3/4 pr-4 book-float">
          <div className="text-center text-gray-400 text-xs mb-1">
            아래 표지를 눌러주세요
          </div>
          <div
            className="book-3d relative cursor-pointer"
            style={{
              borderRadius: "3px 10px 10px 3px",
              boxShadow:
                theme === "light"
                  ? `
                    3px 0 0 0 #e2d8cc,
                    6px 0 0 0 #d5c9bb,
                    9px 0 0 0 #c8bcaa,
                    0  8px 24px rgba(0,0,0,0.30),
                    0 24px 52px rgba(0,0,0,0.22),
                    0 50px 100px rgba(0,0,0,0.14),
                    0 80px 160px rgba(0,0,0,0.07),
                    inset 0 0 0 1px rgba(0,0,0,0.10)
                  `
                  : `
                    3px 0 0 0 #2e2216,
                    6px 0 0 0 #241a10,
                    9px 0 0 0 #1a120a,
                    0  8px 24px rgba(0,0,0,0.65),
                    0 24px 52px rgba(0,0,0,0.48),
                    0 50px 100px rgba(0,0,0,0.30),
                    0 80px 160px rgba(0,0,0,0.14),
                    0  0  50px rgba(190,140,75,0.12),
                    0  0  90px rgba(160,110,50,0.07),
                    inset 0 0 0 1px rgba(255,255,255,0.07)
                  `,
            }}
            onClick={() => onItemClick(bookList[0])}
          >
            <Image
              src={bookList[0].cover}
              width={300}
              height={400}
              alt={bookList[0].title}
              unoptimized={true}
              className="block w-full h-auto"
              style={{ borderRadius: "3px 10px 10px 3px" }}
            />
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                borderRadius: "3px 10px 10px 3px",
                background:
                  "linear-gradient(to right, rgba(0,0,0,0.38) 0%, rgba(0,0,0,0.10) 14%, transparent 30%)",
              }}
            />
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                borderRadius: "3px 10px 10px 3px",
                background:
                  "linear-gradient(135deg, rgba(255,255,255,0.16) 0%, rgba(255,255,255,0.04) 35%, transparent 55%)",
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

const CoverCarousel = ({
  bookList,
  onItemClick,
  theme,
}: {
  bookList: Book[];
  onItemClick: (book: Book) => void;
  theme: "light" | "dark";
}) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "center",
    loop: bookList.length > 2,
    startIndex: 0,
  });
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setCurrentIndex(emblaApi.selectedScrollSnap());
    emblaApi.on("select", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  return (
    <div className="w-full px-8 py-6">
      <div className="text-center mb-5">
        <span className="text-xs tracking-[0.3em] text-stone-400 dark:text-stone-500 font-incheon uppercase">
          Best Seller
        </span>
      </div>

      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex py-4">
          {bookList.map((book, index) => (
            <div
              key={book.id}
              className="flex-[0_0_65%] min-w-0 px-1.5 cursor-pointer"
              onClick={() => onItemClick(book)}
            >
              <div
                style={{
                  transform:
                    index === currentIndex ? "scale(1)" : "scale(0.87)",
                  opacity: index === currentIndex ? 1 : 0.38,
                  transition:
                    "transform 0.4s ease, opacity 0.4s ease, box-shadow 0.4s ease",
                  borderRadius: "3px 10px 10px 3px",
                  overflow: "hidden",
                  boxShadow:
                    index === currentIndex
                      ? theme === "light"
                        ? "3px 0 0 0 #e2d8cc, 6px 0 0 0 #d5c9bb, 9px 0 0 0 #c8bcaa, 0 6px 18px rgba(0,0,0,0.18), 0 2px 8px rgba(0,0,0,0.10)"
                        : "3px 0 0 0 #2e2216, 6px 0 0 0 #241a10, 9px 0 0 0 #1a120a, 0 6px 18px rgba(0,0,0,0.55), 0 2px 8px rgba(0,0,0,0.35)"
                      : "0 2px 8px rgba(0,0,0,0.06)",
                }}
              >
                <Image
                  src={book.cover}
                  width={300}
                  height={400}
                  alt={book.title}
                  unoptimized
                  className="block w-full h-auto"
                  style={{ borderRadius: "3px 10px 10px 3px" }}
                />
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    borderRadius: "3px 10px 10px 3px",
                    background:
                      "linear-gradient(to right, rgba(0,0,0,0.32) 0%, rgba(0,0,0,0.08) 14%, transparent 28%)",
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-center items-center gap-2 mt-3">
        {bookList.map((_, i) => (
          <div
            key={i}
            className="rounded-full transition-all duration-400"
            style={{
              width: i === currentIndex ? 22 : 6,
              height: 6,
              backgroundColor:
                i === currentIndex
                  ? theme === "light"
                    ? "#78716c"
                    : "#a8a29e"
                  : theme === "light"
                    ? "#d6d3d1"
                    : "#44403c",
            }}
          />
        ))}
      </div>
    </div>
  );
};

function WeatherIcon({ mode }: { mode: WeatherMode }) {
  if (mode === "snow") return <Snowflake className="w-4 h-4 text-sky-300" />;
  if (mode === "rain")
    return <CloudRain className="w-4 h-4 text-blue-400 dark:text-blue-300" />;
  if (mode === "sakura") return <Cherry className="w-4 h-4 text-pink-400" />;
  return <Cloud className="w-4 h-4 text-stone-400 dark:text-stone-500" />;
}

export default function Home() {
  const { theme, toggleTheme } = useTheme();

  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    bookList: Book[] | null;
  }>({ isOpen: false, bookList: null });

  const [weatherMode, setWeatherMode] = useState<WeatherMode>("none");
  const [profileVisible, setProfileVisible] = useState(false);
  const [sectionsVisible, setSectionsVisible] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onTime = () => setCurrentTime(audio.currentTime);
    const onLoad = () => setDuration(audio.duration);
    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("loadedmetadata", onLoad);
    return () => {
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("loadedmetadata", onLoad);
    };
  }, []);

  const toggleMusic = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying((p) => !p);
  };

  const handleSeek = (t: number) => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = t;
    setCurrentTime(t);
  };

  const cycleWeather = () => {
    setWeatherMode((prev) => {
      if (prev === "none") return "snow";
      if (prev === "snow") return "rain";
      if (prev === "rain") return "sakura";
      return "none";
    });
  };

  useEffect(() => {
    setProfileVisible(true);
    setTimeout(() => setSectionsVisible(true), 700);
  }, []);

  const stylesByCategory = useMemo(() => {
    const sortedById = [...BookData].sort((a, b) => a.id - b.id);
    return Array.from(
      sortedById.reduce((acc, item) => {
        if (!acc.has(item.title)) acc.set(item.title, []);
        acc.get(item.title)!.push(item);
        return acc;
      }, new Map<string, Book[]>()),
    );
  }, []);

  const bestStyles = useMemo(
    () => stylesByCategory.map(([, books]) => books[0]),
    [stylesByCategory],
  );

  const openModal = (book: Book) => {
    const filtered = BookData.filter((item) => item.title === book.title);
    setModalState({ isOpen: true, bookList: filtered });
  };

  const closeModal = () => setModalState({ isOpen: false, bookList: null });

  return (
    <div className="relative w-full max-w-[369px] mx-auto pb-24 min-h-screen">
      <audio ref={audioRef} src="/music/saf45929324.mp3" preload="auto" loop />

      <WeatherEffect mode={weatherMode} />

      {/* 헤더 */}
      <div
        className={`relative w-full pt-12 pb-10 px-8 transition-all duration-1000 ease-out ${
          profileVisible
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-6"
        }`}
      >
        <div className="absolute top-6 right-6 flex items-center gap-2">
          <button
            onClick={cycleWeather}
            className="p-2 rounded-full transition-all duration-200 bg-stone-200/60 dark:bg-stone-800/60 hover:bg-stone-300/80 dark:hover:bg-stone-700/80"
            aria-label="날씨 효과 변경"
          >
            <WeatherIcon mode={weatherMode} />
          </button>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full transition-all duration-200 bg-stone-200/60 dark:bg-stone-800/60 hover:bg-stone-300/80 dark:hover:bg-stone-700/80"
            aria-label="테마 변경"
          >
            {theme === "light" ? (
              <Moon className="w-4 h-4 text-stone-600" />
            ) : (
              <Sun className="w-4 h-4 text-stone-400" />
            )}
          </button>
        </div>

        <p className="text-sm tracking-[0.3em] text-stone-600 dark:text-stone-500 font-incheon mb-3 uppercase">
          Crafted by
        </p>
        <h1 className="text-3xl font-semibold tracking-wide text-stone-800 dark:text-stone-200 font-ylee mb-7">
          환하다
        </h1>

        <div className="border-l-2 border-stone-300 dark:border-stone-700 pl-4">
          <p className="text-base leading-relaxed text-stone-900 dark:text-stone-300 font-ylee">
            시 쓰는 파티쉐 세상의 습도를 느끼고 마음의 온도로 구워냅니다
          </p>
        </div>
      </div>

      {/* 뮤직 플레이어 */}
      <div
        className={`px-8 mb-4 transition-all duration-1000 ease-out ${
          profileVisible
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-6"
        }`}
      >
        <MusicPlayer
          isPlaying={isPlaying}
          onToggle={toggleMusic}
          currentTime={currentTime}
          duration={duration}
          onSeek={handleSeek}
        />
      </div>

      {/* 베스트셀러 커버 캐러셀 — 2개 이상일 때만 표시 */}
      {bestStyles.length > 1 && (
        <div
          className={`transition-all duration-1000 ease-out ${
            sectionsVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-6"
          }`}
        >
          <CoverCarousel
            bookList={bestStyles}
            onItemClick={openModal}
            theme={theme}
          />
        </div>
      )}

      {/* 시리즈 목록 */}
      <div
        className={`transition-all duration-1000 ease-out mt-8 ${
          sectionsVisible
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-6"
        }`}
      >
        {stylesByCategory.map(([styleName, books]) => (
          <StyleCarousel
            key={styleName}
            title={styleName}
            bookList={books}
            onItemClick={openModal}
            theme={theme}
          />
        ))}
      </div>

      {/* 모달 */}
      {modalState.isOpen &&
        modalState.bookList &&
        modalState.bookList.length > 0 && (
          <FullScreenModal
            bookList={modalState.bookList}
            onClose={closeModal}
            weatherMode={weatherMode}
            onWeatherCycle={cycleWeather}
            toggleTheme={toggleTheme}
            theme={theme}
            isPlaying={isPlaying}
            onToggleMusic={toggleMusic}
          />
        )}
    </div>
  );
}
