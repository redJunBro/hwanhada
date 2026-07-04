import * as React from "react";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import type { UseEmblaCarouselType } from "embla-carousel-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/hong/CarouselComponents";
import { Book } from "@/utils/data";
import {
  Moon,
  Sun,
  Cloud,
  Snowflake,
  CloudRain,
  Cherry,
  Volume2,
  VolumeX,
} from "lucide-react";
import WeatherEffect, { WeatherMode } from "@/components/WeatherEffect";

const TEXT_ALIGN: "left" | "center" = "left";

type Chapter = {
  label: string;
  startIndex: number;
};
const CHAPTERS: Chapter[] = [];

type CarouselApi = UseEmblaCarouselType[1];

type FullScreenModalProps = {
  bookList: Book[] | null;
  onClose: () => void;
  weatherMode: WeatherMode;
  onWeatherCycle: () => void;
  toggleTheme: () => void;
  theme: "light" | "dark";
  isPlaying: boolean;
  onToggleMusic: () => void;
};

function WeatherIcon({ mode }: { mode: WeatherMode }) {
  if (mode === "snow") return <Snowflake className="w-4 h-4 text-sky-300" />;
  if (mode === "rain")
    return <CloudRain className="w-4 h-4 text-blue-400 dark:text-blue-300" />;
  if (mode === "sakura") return <Cherry className="w-4 h-4 text-pink-400" />;
  return <Cloud className="w-4 h-4 text-stone-400 dark:text-stone-500" />;
}

export default function FullScreenModal({
  bookList,
  onClose,
  weatherMode,
  onWeatherCycle,
  toggleTheme,
  theme,
  isPlaying,
  onToggleMusic,
}: FullScreenModalProps) {
  const [closing, setClosing] = useState(false);
  const [titleVisible, setTitleVisible] = useState(false);
  const [imageVisible, setImageVisible] = useState(false);
  const [descriptionVisible, setDescriptionVisible] = useState(false);
  const [showHint, setShowHint] = useState(true);
  const [currentContentIndex, setCurrentContentIndex] = useState(0);
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const dotsRef = useRef<HTMLDivElement | null>(null);

  if (!bookList || bookList.length === 0) return null;

  const currentBook = bookList[0];
  const totalPages = currentBook.contents.length;

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
    }
  }, [currentContentIndex]);

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    if (!dotsRef.current) return;
    const dot = dotsRef.current.children[currentContentIndex] as HTMLElement;
    if (!dot) return;
    const container = dotsRef.current;
    const dotCenter = dot.offsetLeft + dot.offsetWidth / 2;
    container.scrollTo({
      left: dotCenter - container.clientWidth / 2,
      behavior: "smooth",
    });
  }, [currentContentIndex]);

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    if (totalPages <= 1) return;
    const timer = setTimeout(() => setShowHint(false), 5000);
    return () => clearTimeout(timer);
  }, [totalPages]);

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    if (!carouselApi) return;
    const onSelect = () =>
      setCurrentContentIndex(carouselApi.selectedScrollSnap());
    carouselApi.on("select", onSelect);
    return () => {
      carouselApi.off("select", onSelect);
    };
  }, [carouselApi]);

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    setTimeout(() => setTitleVisible(true), 100);
    setTimeout(() => setImageVisible(true), 400);
    setTimeout(() => setDescriptionVisible(true), 800);
  }, []);

  const goToPage = (index: number) => carouselApi?.scrollTo(index);

  const handleClose = () => {
    setClosing(true);
    setTimeout(() => onClose(), 400);
  };

  const formatTextContents = (textContents: string): JSX.Element[] => {
    const elements: JSX.Element[] = [];

    const firstNewlineIndex = textContents.indexOf("\n");
    const rawTitle =
      firstNewlineIndex !== -1
        ? textContents.slice(0, firstNewlineIndex).trim()
        : textContents.trim();
    let body =
      firstNewlineIndex !== -1 ? textContents.slice(firstNewlineIndex + 1) : "";

    if (rawTitle.startsWith("+")) {
      const sectionTitle = rawTitle.replace(/^\+/, "").trim();
      const lines = body.split("\n").map((line) => line.trim());
      const subTitle = lines[0] || "";
      const subDescription = lines[1] || "";
      body = lines.slice(2).join("\n");

      elements.push(
        <div key="centered-block-initial" className="text-center mt-20">
          <div className="text-base font-bold">{sectionTitle}</div>
          {subTitle && (
            <div className="text-base font-semibold mt-5 mb-5">{subTitle}</div>
          )}
          {subDescription && (
            <div className="text-sm font-JejuMyeongjo">{subDescription}</div>
          )}
        </div>,
      );
    } else {
      elements.push(
        <span
          key="title"
          className="block pt-5 font-bold text-base mb-5"
          style={{ textAlign: TEXT_ALIGN }}
        >
          {rawTitle}
        </span>,
      );
    }

    const regex = /([^\n]+)(\n{1,2})?/g;
    let match;
    let index = 0;

    while ((match = regex.exec(body)) !== null) {
      const line = match[1].trim();
      const newline = match[2] || "\n";

      if (line.startsWith("+")) {
        const sectionTitle = line.replace(/^\+/, "").trim();
        const nextMatch = regex.exec(body);
        const subTitle = nextMatch?.[1]?.trim() ?? "";
        const thirdMatch = regex.exec(body);
        const subDesc = thirdMatch?.[1]?.trim() ?? "";

        elements.push(
          <div key={`centered-block-${index}`} className="text-center my-10">
            <div className="text-base font-bold">{sectionTitle}</div>
            {subTitle && (
              <div className="text-base font-semibold mt-7 mb-3">{subTitle}</div>
            )}
            {subDesc && (
              <div className="text-sm font-JejuMyeongjo text-gray-700">
                {subDesc}
              </div>
            )}
          </div>,
        );
        index++;
        continue;
      }

      elements.push(
        <span
          key={`line-${index}`}
          className={newline.length === 2 ? "block mb-5" : "block mb-1"}
          style={{ textAlign: TEXT_ALIGN }}
        >
          {line}
        </span>,
      );
      index++;
    }

    return elements;
  };

  const paginationBg =
    theme === "light"
      ? "linear-gradient(to top, #ede1c8 0%, #f5edd8cc 80%, transparent 100%)"
      : "linear-gradient(to top, #120e06 0%, #1c1208cc 80%, transparent 100%)";

  return (
    <div
      className={`fixed inset-0 z-50 min-h-screen bg-cover bg-center bg-no-repeat overflow-y-auto overscroll-contain flex flex-col items-center ${
        closing ? "animate-slide-down" : "animate-slide-up"
      }`}
      ref={scrollContainerRef}
      style={{
        scrollBehavior: "smooth",
        background:
          theme === "light"
            ? "linear-gradient(165deg, #fdfaf5 0%, #f5edd8 45%, #ede1c8 100%)"
            : "linear-gradient(165deg, #141210 0%, #1c1208 55%, #120e06 100%)",
      }}
    >
      <WeatherEffect mode={weatherMode} />

      <div className="relative w-full max-w-2xl mx-auto flex flex-col items-center min-h-screen bg-cover bg-center bg-no-repeat pb-44">
        <button
          className="absolute top-4 left-4 text-xl text-gray-600 dark:text-gray-300 font-Gabia"
          onClick={handleClose}
        >
          &larr; Back
        </button>

        <div className="absolute top-4 right-4 flex items-center gap-2">
          <button
            onClick={onToggleMusic}
            className="p-2 rounded-full transition-all duration-200 bg-stone-200/60 dark:bg-stone-800/60 hover:bg-stone-300/80 dark:hover:bg-stone-700/80"
            aria-label={isPlaying ? "음악 일시정지" : "음악 재생"}
          >
            {isPlaying ? (
              <Volume2 className="w-4 h-4 text-stone-600 dark:text-stone-300" />
            ) : (
              <VolumeX className="w-4 h-4 text-stone-400 dark:text-stone-500" />
            )}
          </button>
          <button
            onClick={onWeatherCycle}
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

        <div
          className={`w-full max-w-2xl text-center mt-12 px-3 ${
            titleVisible ? "animate-fade-in" : "hidden"
          }`}
        >
          <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200 font-JejuMyeongjo pt-3">
            {currentBook.description}
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 font-JejuMyeongjo">
            {currentBook.subTitle}
          </p>
        </div>

        <div
          className={`w-full max-w-2xl p-2 relative ${
            imageVisible ? "animate-fade-in" : "hidden"
          }`}
        >
          <Carousel className="w-full" setApi={setCarouselApi}>
            <CarouselContent>
              {currentBook.contents.map((content, index) => (
                <CarouselItem
                  key={index}
                  className="flex-[0_0_100%] px-2"
                  data-index={index}
                >
                  {content.image && (
                    <div className="relative w-full rounded-lg overflow-hidden">
                      <Image
                        src={content.image}
                        width={800}
                        height={600}
                        alt="Book image"
                        className="object-cover rounded-lg w-full h-auto"
                      />
                    </div>
                  )}
                  {index === currentContentIndex && (
                    <div
                      className={`w-full max-w-2xl mt-4 px-4 pb-48 ${
                        descriptionVisible ? "" : "hidden"
                      }`}
                    >
                      <p
                        className="text-gray-800 dark:text-gray-100 font-kopub"
                        style={{
                          letterSpacing: "-0.2px",
                          marginBottom: "calc(16px * 2.0)",
                          lineHeight: "1.9",
                          fontWeight: 400,
                          fontSize: "0.82rem",
                          textAlign: TEXT_ALIGN,
                        }}
                      >
                        {formatTextContents(content.textContents)}
                      </p>
                    </div>
                  )}
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>

          {showHint && totalPages > 1 ? (
            <div className="absolute top-10 right-8 transform -translate-y-1/2 animate-slide-icon">
              <div className="text-center text-gray-400 text-xs mb-1">
                옆으로 넘겨 감상하세요
              </div>
              <Image
                src="/images/slider.webp"
                alt="Slide hint"
                width={25}
                height={25}
                className="ml-auto"
              />
            </div>
          ) : null}
        </div>
      </div>

      <div
        className="fixed bottom-0 left-0 right-0 z-50 flex flex-col items-center pb-6 pt-8 pointer-events-none"
        style={{ background: paginationBg }}
      >
        {CHAPTERS.length > 0 && (
          <div className="flex gap-3 mb-3 pointer-events-auto">
            {CHAPTERS.map((ch) => (
              <button
                key={ch.label}
                onClick={() => goToPage(ch.startIndex)}
                className="text-xs text-stone-500 dark:text-stone-400 font-JejuMyeongjo
                  px-3 py-1 rounded-full border border-stone-300 dark:border-stone-600
                  hover:border-stone-500 dark:hover:border-stone-400
                  hover:text-stone-800 dark:hover:text-stone-200 transition-all duration-200"
              >
                {ch.label}
              </button>
            ))}
          </div>
        )}

        <div
          ref={dotsRef}
          className="flex items-center overflow-x-auto max-w-[300px] pointer-events-auto"
          style={
            {
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            } as React.CSSProperties
          }
        >
          {currentBook.contents.map((_, i) => {
            const isActive = i === currentContentIndex;
            return (
              <button
                key={i}
                onClick={() => goToPage(i)}
                aria-label={`${i + 1}페이지로 이동`}
                className="flex-none flex items-center justify-center w-9 h-9 transition-all duration-300"
              >
                {isActive ? (
                  <span
                    className="flex items-center justify-center rounded-full
                      bg-stone-700 dark:bg-stone-200
                      text-white dark:text-stone-900
                      font-incheon tabular-nums
                      transition-all duration-300"
                    style={{
                      minWidth: 28,
                      height: 28,
                      fontSize: 10,
                      padding: "0 6px",
                    }}
                  >
                    {i + 1}
                  </span>
                ) : (
                  <span
                    className="rounded-full bg-stone-300/90 dark:bg-stone-600/90
                      hover:bg-stone-400 dark:hover:bg-stone-500
                      transition-all duration-300"
                    style={{ width: 6, height: 6 }}
                  />
                )}
              </button>
            );
          })}
        </div>

        <div className="mt-1 text-[10px] text-stone-400 dark:text-stone-500 font-incheon tabular-nums pointer-events-auto tracking-wider">
          {currentContentIndex + 1} · {totalPages}
        </div>
      </div>

      <style jsx>{`
        @keyframes slide-up {
          0% { transform: translateY(100%); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
        @keyframes slide-down {
          0% { transform: translateY(0); opacity: 1; }
          100% { transform: translateY(100%); opacity: 0; }
        }
        @keyframes fade-in {
          0% { opacity: 0; transform: translateY(20%); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes slide-fade-in {
          0% { opacity: 0; transform: translateY(10%); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes slide-icon {
          0% { transform: translateX(0); }
          50% { transform: translateX(-40px); }
          100% { transform: translateX(0); }
        }
        .animate-slide-up { animation: slide-up 0.8s ease-out; }
        .animate-slide-down { animation: slide-down 1.2s ease-out; }
        .animate-fade-in { animation: fade-in 0.6s ease-out; }
        .animate-slide-fade-in { animation: slide-fade-in 0.3s ease-out; }
        .animate-slide-icon { animation: slide-icon 1.5s ease-in-out infinite; }
        div::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
}
