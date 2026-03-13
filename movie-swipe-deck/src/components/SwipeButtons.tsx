import useMovieStore from "@/store/movieStore";

export default function SwipeButtons() {
  const deck = useMovieStore((s) => s.deck);
  const swipeLeft = useMovieStore((s) => s.swipeLeft);
  const swipeRight = useMovieStore((s) => s.swipeRight);

  const movie = deck[deck.length - 1];
  if (!movie) return null;

  return (
    <div className="flex gap-6 mt-4">
      <button
        onClick={() => swipeLeft(movie)}
        className="px-6 py-2 bg-red-500 rounded-lg"
      >
        Пропустить
      </button>

      <button
        onClick={() => swipeRight(movie)}
        className="px-6 py-2 bg-green-500 rounded-lg"
      >
        Сохранить
      </button>
    </div>
  );
}