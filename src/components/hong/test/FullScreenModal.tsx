import * as React from "react";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/hong/CarouselComponents";
import { Book } from "@/utils/data"; // 데이터 구조가 변경되었으므로 import 경로도 확인해주세요.

type FullScreenModalProps = {
  bookList: Book[] | null; // 타입을 Hair에서 Book으로 변경
  onClose: () => void;
};

export default function FullScreenModal({
  bookList,
  onClose,
}: FullScreenModalProps) {
  if (!bookList || bookList.length === 0) {
    return null;
  }

  const [currentIndex, setCurrentIndex] = useState(0);

  const [closing, setClosing] = useState(false);
  const [titleVisible, setTitleVisible] = useState(false);
  const [subDescriptionVisible, setSubDescriptionVisible] = useState(false);
  const [imageVisible, setImageVisible] = useState(false);
  const [descriptionVisible, setDescriptionVisible] = useState(false);
  const [showHint, setShowHint] = useState(true); // 힌트 표시 여부
  const [animateDescription, setAnimateDescription] = useState(false); // 슬라이드 애니메이션 상태 추가
  const carouselRef = useRef<HTMLDivElement | null>(null);
  const currentBook = bookList[currentIndex];
  const [currentContentIndex, setCurrentContentIndex] = useState(0); // useState로 변경

  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0; // 스크롤 컨테이너의 스크롤을 최상단으로 설정
    }
  }, [currentContentIndex]); // currentContentIndex가 변경될 때마다 실행

  useEffect(() => {
    const carouselElement = carouselRef.current;
    if (!carouselElement) return;

    const observerOptions = {
      root: carouselElement,
      rootMargin: "0px",
      threshold: 0.5,
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const index = parseInt(
            entry.target.getAttribute("data-index") || "0",
            10
          );
          if (index < bookList[currentIndex].contents.length) {
            setCurrentContentIndex(index); // 현재 보이는 콘텐츠 인덱스 업데이트
            setTimeout(() => setShowHint(false), 5000); // 5초 후 힌트 숨기기
          }
        }
      });
    };
    const observer = new IntersectionObserver(
      observerCallback,
      observerOptions
    );
    const items = carouselElement.querySelectorAll("[data-index]");

    items.forEach((item) => observer.observe(item));

    return () => {
      items.forEach((item) => observer.unobserve(item));
    };
  }, [bookList, currentIndex]); // 의존성 배열 업데이트

  // 현재 콘텐츠에 대한 설명을 포맷팅

  useEffect(() => {
    setTimeout(() => setTitleVisible(true), 100);
    setTimeout(() => setSubDescriptionVisible(true), 300);
    setTimeout(() => setImageVisible(true), 400);
    setTimeout(() => setDescriptionVisible(true), 800);
  }, []);

  const currentContent = currentBook.contents[currentContentIndex];

  const formatTextContents = (textContents: string): JSX.Element[] => {
    const elements: JSX.Element[] = [];

    const firstNewlineIndex = textContents.indexOf("\n");
    const rawTitle =
      firstNewlineIndex !== -1
        ? textContents.slice(0, firstNewlineIndex).trim()
        : textContents.trim();
    let body =
      firstNewlineIndex !== -1 ? textContents.slice(firstNewlineIndex + 1) : "";

    // +로 시작하는 제목인 경우 (처음 챕터 블록)
    if (rawTitle.startsWith("+")) {
      const sectionTitle = rawTitle.replace(/^\+/, "").trim();

      const lines = body.split("\n").map((line) => line.trim());
      const subTitle = lines[0] || "";
      const subDescription = lines[1] || "";
      body = lines.slice(2).join("\n"); // 이후 본문은 다시 body로

      elements.push(
        <div key="centered-block-initial" className="text-center mt-20">
          <div className="text-xl font-bold">{sectionTitle}</div>
          {subTitle && (
            <div className="text-xl font-semibold mt-5 mb-5">{subTitle}</div>
          )}
          {subDescription && (
            <div className="text-lg font-Gangwon">{subDescription}</div>
          )}
        </div>
      );
    } else {
      elements.push(
        <span key="title" className="block pt-5 font-bold text-xl mb-5">
          {rawTitle}
        </span>
      );
    }

    // 본문 파싱
    const regex = /([^\n]+)(\n{1,2})?/g;
    let match;
    let index = 0;

    while ((match = regex.exec(body)) !== null) {
      let line = match[1].trim();
      const newline = match[2] || "\n";

      // 중간 삽입되는 챕터 처리
      if (line.startsWith("+")) {
        const sectionTitle = line.replace(/^\+/, "").trim();

        const nextMatch = regex.exec(body);
        const subTitle = nextMatch?.[1]?.trim() ?? "";

        const thirdMatch = regex.exec(body);
        const subDesc = thirdMatch?.[1]?.trim() ?? "";

        elements.push(
          <div key={`centered-block-${index}`} className="text-center my-10">
            <div className="text-xl font-bold">{sectionTitle}</div>
            {subTitle && (
              <div className="text-xl font-semibold mt-7 mb-3">{subTitle}</div>
            )}
            {subDesc && (
              <div className="text-lg font-JejuMyeongjo text-gray-700">
                {subDesc}
              </div>
            )}
          </div>
        );

        index++;
        continue;
      }

      elements.push(
        <span
          key={`line-${index}`}
          className={newline.length === 2 ? "block mb-5" : "block mb-1"}
        >
          {line}
        </span>
      );
      index++;
    }

    return elements;
  };

  const handleClose = () => {
    setClosing(true);
    setTimeout(() => onClose(), 400);
  };

  return (
    <div
      className={`fixed inset-0 z-50 min-h-screen bg-cover bg-center bg-no-repeat text-white overflow-y-auto flex flex-col items-center ${
        closing ? "animate-slide-down" : "animate-slide-up"
      }`}
      ref={scrollContainerRef}
      style={{
        scrollBehavior: "smooth",
        backgroundImage: "url('/images/baimage.jpg')",
      }}
    >
      <div className="relative w-full max-w-2xl mx-auto flex flex-col items-center min-h-screen bg-cover bg-center bg-no-repeat">
        <button
          className="absolute top-4 left-4 text-xl text-gray-600 font-Gabia"
          onClick={handleClose}
        >
          &larr; Back
        </button>
        <div
          className={`w-full max-w-2xl text-center mt-12 px-3 ${
            titleVisible ? "animate-fade-in" : "hidden"
          }`}
        >
          <h2 className="text-xl font-semibold text-gray-700 font-JejuMyeongjo pt-3">
            {currentBook.description}
          </h2>
          <p className="text-xs text-gray-500 font-JejuMyeongjo">
            {currentBook.subTitle}
          </p>
        </div>
        <div
          className={`w-full max-w-2xl text-center mt-2 px-3 ${
            subDescriptionVisible ? "animate-fade-in" : "hidden"
          }`}
        />
        <div
          className={`w-full max-w-2xl p-2 relative ${
            imageVisible ? "animate-fade-in" : "hidden"
          }`}
          ref={carouselRef}
        >
          <Carousel className="w-full">
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
                  <div
                    className={`w-full max-w-2xl mt-4 px-4 pb-8 ${
                      descriptionVisible
                        ? animateDescription
                          ? "animate-slide-fade-in"
                          : ""
                        : "hidden"
                    }`}
                  >
                    <p
                      className="text-gray-800 font-kopub"
                      style={{
                        letterSpacing: "-0.2px",
                        marginBottom: "calc(18px * 2.0)",
                        lineHeight: "1.9",
                        fontWeight: 400,
                      }}
                    >
                      {formatTextContents(content.textContents)}
                    </p>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
          {showHint && bookList[currentIndex].contents.length > 1 ? (
            <div className="absolute top-10 right-8 transform -translate-y-1/2 animate-slide-icon">
              <Image
                src="/images/slider2.png"
                alt="Slide hint"
                width={25}
                height={25}
              />
            </div>
          ) : null}
        </div>
      </div>
      <style jsx>{`
        @keyframes slide-up {
          0% {
            transform: translateY(100%);
            opacity: 0;
          }
          100% {
            transform: translateY(0);
            opacity: 1;
          }
        }

        @keyframes slide-down {
          0% {
            transform: translateY(0);
            opacity: 1;
          }
          100% {
            transform: translateY(100%);
            opacity: 0;
          }
        }

        @keyframes fade-in {
          0% {
            opacity: 0;
            transform: translateY(20%);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-fade-in {
          0% {
            opacity: 0;
            transform: translateY(10%);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-icon {
          0% {
            transform: translateX(0);
          }
          50% {
            transform: translateX(-40px);
          }
          100% {
            transform: translateX(0);
          }
        }

        @keyframes hint-blink {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0;
          }
        }

        .animate-slide-up {
          animation: slide-up 0.8s ease-out;
        }

        .animate-slide-down {
          animation: slide-down 1.2s ease-out;
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }

        .animate-slide-fade-in {
          animation: slide-fade-in 0.3s ease-out; /* 슬라이드 후 가볍게 표시하는 애니메이션 */
        }

        .animate-slide-icon {
          animation: slide-icon 1.5s ease-in-out infinite;
        }

        .animate-hint-blink {
          animation: hint-blink 1.5s step-start infinite;
        }
      `}</style>
    </div>
  );
}
