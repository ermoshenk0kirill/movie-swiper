import type { Movie } from "@/types/movieTypes";
import { useState } from "react";

interface Props {
  movie: Movie;
}

export default function MovieCard({ movie }: Props) {
  const poster =
    movie.poster_path || "https://via.placeholder.com/400x600?text=No+Poster";

  const [isCastOpen, setIsCastOpen] = useState(false);

  const sortedCast = [...movie.casts].sort(
    (a, b) => Number(b.popularity) - Number(a.popularity)
  );

  const topCast = sortedCast.slice(0, 8);

  return (
    <div
      className="card shadow-none w-full h-full rounded-3xl overflow-hidden bg-cover bg-center bg-neutral-900 relative"
      style={{ backgroundImage: `url(${poster})` }}
    >
      <div className="cardContent absolute bottom-0 left-0 right-0 p-6 from-black/90 via-black/60 to-transparent">
        <h3 className="text-2xl font-bold text-white mb-1">
          {movie.original_title}
        </h3>
        <div className="text-xl text-yellow-400 font-semibold">
          ⭐ {movie.vote_average.toFixed(1)}
        </div>

        {movie.casts?.length > 0 && (
          <div className="mt-4">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsCastOpen(!isCastOpen);
              }}
              className="text-sm text-white/90 hover:text-white bg-black/40 hover:bg-black/60 px-3 py-1.5 rounded-full transition-colors flex items-center gap-1.5"
            >
              <span>Актёры ({movie.casts.length})</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsCastOpen(!isCastOpen);
                }}
                className="text-sm text-white/90 hover:text-white bg-black/40 hover:bg-black/60 px-3 py-1.5 rounded-full transition-colors flex items-center gap-1"
              >
                <span>Актёры ({movie.casts.length})</span>
                <span
                  className={`text-white/70 transition-transform duration-200 ${isCastOpen ? "rotate-180" : ""}`}
                >
                  …
                </span>
              </button>
            </button>

            {isCastOpen && (
              <div className="mt-3 bg-black/70 backdrop-blur-sm rounded-xl p-4 text-white text-sm border border-white/10 animate-fadeIn">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 max-h-64 overflow-y-auto pr-2">
                  {topCast.map((actor) => (
                    <div key={actor.id} className="flex flex-col">
                      <span className="font-medium">{actor.name}</span>
                      <span className="text-white text-xs">
                        {actor.character ? `как ${actor.character}` : "—"}
                      </span>
                    </div>
                  ))}
                </div>

                {movie.casts.length > topCast.length && (
                  <p className="text-xs text-white mt-3 text-center">
                    + ещё {movie.casts.length - topCast.length} актёров
                  </p>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
