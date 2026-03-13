import React, { useRef, useState, useEffect } from "react";
import TinderCard from "react-tinder-card";
import useMovieStore from "@/store/movieStore";
import MovieCard from "./MovieCard";
import { RotateCcw, X, Heart } from "lucide-react";
import type { Movie } from "@/types/movieTypes";

interface Props {
  onOpenSaved?: () => void;
}

interface TinderCardRef {
  swipe: (dir: "left" | "right" | "up" | "down") => Promise<void>;
  restoreCard: () => Promise<void>;
}

export default function MovieDeck({ onOpenSaved }: Props) {
  const deck = useMovieStore((s) => s.deck);
  const swipeLeftStore = useMovieStore((s) => s.swipeLeft);
  const swipeRightStore = useMovieStore((s) => s.swipeRight);
  const removeSwipedCard = useMovieStore((s) => s.removeSwipedCard);
  const undoStore = useMovieStore((s) => s.undo);

  const [lastDirection, setLastDirection] = useState<"left" | "right" | null>(null);
  const [isUndoing, setIsUndoing] = useState<boolean>(false);

  const currentIndexRef = useRef<number>(-1);
  const childRefs = useRef<Array<React.RefObject<TinderCardRef>>>([]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") swipe("left");
      if (e.key === "ArrowRight") swipe("right");
      if (e.key === "ArrowUp" || e.key === "Backspace") undo();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [deck.length]);

  useEffect(() => {
    currentIndexRef.current = deck.length > 0 ? deck.length - 1 : -1;

    childRefs.current = Array.from({ length: deck.length }, (_, i) =>
      childRefs.current[i] ?? React.createRef<TinderCardRef>()
    );
  }, [deck.length]);

  const getCurrentRef = (): TinderCardRef | null => {
    const idx = currentIndexRef.current;
    if (idx < 0 || idx >= childRefs.current.length) return null;
    return childRefs.current[idx]?.current ?? null;
  };

  const swiped = (direction: string, _movie: Movie, index: number) => {
    if (direction === "left" || direction === "right") {
      setLastDirection(direction as "left" | "right");
    }
    currentIndexRef.current = index - 1;
  };

  const cardLeftScreen = (_title: string, idx: number) => {
    const movie = deck.find((_, i) => i === idx);
    if (!movie) return;

    if (lastDirection === "left") {
      swipeLeftStore(movie);
    } else if (lastDirection === "right") {
      swipeRightStore(movie);
    }

    removeSwipedCard(movie.id);
  };

  const swipe = async (dir: "left" | "right") => {
    const ref = getCurrentRef();
    if (ref) {
      try {
        await ref.swipe(dir);
      } catch (error) {
        console.log("Swipe error:", error);
      }
    }
  };

  const undo = async () => {
    if (isUndoing) return;

    setIsUndoing(true);
    const success = undoStore();

    if (success) {
      setTimeout(() => {
        currentIndexRef.current = deck.length - 1;
        setIsUndoing(false);
      }, 100);
    } else {
      setIsUndoing(false);
    }
  };

  if (!deck.length) {
    return (
      <div className="text-center py-20 text-2xl text-white">
        Колода пуста...
      </div>
    );
  }

  return (
    <>
      <div className="flex justify-between items-center px-6 py-4 bg-neutral-900 border-b border-neutral-800">
        <div />

        <button
          onClick={onOpenSaved}
          className="px-6 py-3 from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-2xl flex items-center gap-3 shadow-lg transition-all duration-300 hover:scale-105 group cursor-pointer"
        >
          Буду смотреть
          <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium">
            {useMovieStore.getState().saved.length}
          </span>
        </button>
      </div>

      <div className="relative flex-1 flex flex-col items-center pt-8">
        <div className="cardContainer relative w-full max-w-[380px] h-[520px]">
          {deck.map((movie, index) => (
            <TinderCard
              ref={childRefs.current[index]}
              key={movie.id}
              className="swipe absolute inset-0"
              preventSwipe={["up", "down"]}
              flickOnSwipe={true}
              swipeThreshold={90}
              swipeRequirementType="position"
              onSwipe={(dir) => swiped(dir, movie, index)}
              onCardLeftScreen={() => cardLeftScreen(movie.original_title, index)}
            >
              <MovieCard movie={movie} />
            </TinderCard>
          ))}
        </div>

        <div className="buttons mt-8 flex justify-center gap-6 sm:gap-10">
          <button
            onClick={() => swipe("left")}
            disabled={isUndoing}
            className="group relative w-16 h-16 sm:w-[4.5rem] sm:h-[4.5rem] rounded-2xl bg-red-600/90 backdrop-blur-xl border border-red-400/30 text-white shadow-xl hover:bg-red-700/90 hover:border-red-400/50 hover:scale-110 active:scale-95 transition-all duration-300 disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center"
          >
            <X className="w-9 h-9 sm:w-11 sm:h-11 group-hover:rotate-90 transition-transform" />
          </button>

          <button
            onClick={undo}
            disabled={isUndoing}
            className="group relative w-16 h-16 sm:w-[4.5rem] sm:h-[4.5rem] rounded-2xl bg-zinc-700/80 backdrop-blur-xl border border-zinc-500/30 text-white shadow-xl hover:bg-zinc-600/90 hover:border-zinc-400/50 hover:scale-110 active:scale-95 transition-all duration-300 disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center"
          >
            <RotateCcw
              className={`w-9 h-9 sm:w-11 sm:h-11 ${isUndoing ? "animate-spin" : "group-hover:-rotate-45"} transition-transform duration-400`}
            />
          </button>

          <button
            onClick={() => swipe("right")}
            disabled={isUndoing}
            className="group relative w-16 h-16 sm:w-[4.5rem] sm:h-[4.5rem] rounded-2xl bg-green-600/90 backdrop-blur-xl border border-green-400/30 text-white shadow-xl hover:bg-green-700/90 hover:border-green-400/50 hover:scale-110 active:scale-95 transition-all duration-300 disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center"
          >
            <Heart className="w-9 h-9 sm:w-11 sm:h-11 group-hover:scale-125 transition-transform fill-current" />
          </button>
        </div>

      </div>
    </>
  );
}