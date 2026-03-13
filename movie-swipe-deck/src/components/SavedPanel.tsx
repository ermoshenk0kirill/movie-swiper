import useMovieStore from "@/store/movieStore";

export default function SavedPanel() {
  const saved = useMovieStore((s) => s.saved);
  const remove = useMovieStore((s) => s.removeFromSaved);
  const clear = useMovieStore((s) => s.clearSaved);

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        
        {saved.length > 0 && (
          <button
            onClick={clear}
            className="text-red-400 hover:text-red-600 text-sm font-medium"
          >
            Очистить всё
          </button>
        )}
      </div>

      {saved.length === 0 && (
        <div className="text-neutral-400 text-center py-12">
          Список пуст
        </div>
      )}

      <div className="space-y-3">
        {saved.map((movie) => (
          <div
            key={movie.id}
            className="flex justify-between items-center bg-neutral-700 hover:bg-neutral-600 p-4 rounded-2xl transition"
          >
            <span className="text-base font-medium">{movie.original_title}</span>
            <button
              onClick={() => remove(movie.id)}
              className="text-2xl text-red-400 hover:text-red-600 transition"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}