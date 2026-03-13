import { useState } from "react";
import HomePage from "@/pages/HomePage/HomePage";
import SavedMovies from "@/components/SavedMovies";

function App() {
  const [view, setView] = useState<'deck' | 'saved'>('deck');

  return (
    <div className="w-screen h-screen overflow-hidden bg-neutral-900">
      {view === 'deck' ? (
        <HomePage onOpenSaved={() => setView('saved')} />
      ) : (
        <SavedMovies onBack={() => setView('deck')} />
      )}
    </div>
  );
}

export default App;