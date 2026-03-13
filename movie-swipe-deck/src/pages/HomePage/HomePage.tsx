import { useEffect, useState } from "react";
import MovieDeck from "@/components/MovieDeck";
import useMovieStore from "@/store/movieStore";

interface Props {
  onOpenSaved?: () => void;
}

export default function HomePage({ onOpenSaved }: Props) {
  const fetchDeck = useMovieStore((s) => s.fetchDeck);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const load = async () => {
      await fetchDeck();
      setReady(true);
    };
    load();
  }, []);

  if (!ready) {
    return (
      <div className="flex items-center justify-center h-screen text-white text-2xl">
        Загрузка...
      </div>
    );
  }

  return <MovieDeck onOpenSaved={onOpenSaved} />;
}