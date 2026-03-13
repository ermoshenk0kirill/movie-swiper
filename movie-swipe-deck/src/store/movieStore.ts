import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Movie } from '@/types/movieTypes';
import { movieApi } from '@/services/api';

interface IActionHistory {
  action: 'skip' | 'save';
  movie: Movie;
  timestamp: number;
}

interface IMovieStore {
  deck: Movie[];
  saved: Movie[];
  history: IActionHistory[];
  isLoading: boolean;
  error: string | null;

  fetchDeck: () => Promise<void>;
  swipeLeft: (movie: Movie) => void;
  swipeRight: (movie: Movie) => void;
  removeSwipedCard: (id: string) => void;
  undo: () => boolean;
  removeFromSaved: (id: string) => void;
  clearSaved: () => void;
}

const useMovieStore = create<IMovieStore>()(
  persist(
    (set, get) => ({
      deck: [],
      saved: [],
      history: [],
      isLoading: false,
      error: null,

      fetchDeck: async () => {
        if (get().isLoading) return;
        set({ isLoading: true, error: null });

        try {
          const movies = await movieApi.getRandomMovies();
          set(state => ({
            deck: [...state.deck, ...movies.filter(m => !state.deck.some(d => d.id === m.id))],
            isLoading: false
          }));
        } catch (err) {
          set({ error: 'Не удалось загрузить фильмы', isLoading: false });
        }
      },

      swipeLeft: (movie) => {
        set(state => ({
          history: [...state.history, { action: 'skip', movie, timestamp: Date.now() }]
        }));
      },

      swipeRight: (movie) => {
        set(state => {
          const alreadySaved = state.saved.some(m => m.id === movie.id);
          return {
            saved: alreadySaved ? state.saved : [...state.saved, movie],
            history: [...state.history, { action: 'save', movie, timestamp: Date.now() }]
          };
        });
      },

      removeSwipedCard: (id) =>
        set(state => {
          const newDeck = state.deck.filter(m => m.id !== id);
          
          const viewedCount = state.history.length + 1;
          if (viewedCount % 20 === 0 && viewedCount > 0) {
            setTimeout(() => get().fetchDeck(), 300);
          }
      
          return { deck: newDeck };
        }),

      undo: () => {
        const { history, deck, saved } = get();
        if (history.length === 0) return false;

        const last = history[history.length - 1];
        const newHistory = history.slice(0, -1);

        if (last.action === 'skip') {
          set({
            deck: [...deck, last.movie],
            history: newHistory
          });
        } else {
          set({
            deck: [...deck, last.movie],
            saved: saved.filter(m => m.id !== last.movie.id),
            history: newHistory
          });
        }
        return true;
      },

      removeFromSaved: (id) =>
        set(s => ({ saved: s.saved.filter(m => m.id !== id) })),

      clearSaved: () => set({ saved: [] })
    }),
    {
      name: 'movie-swipe-storage',
      partialize: (state) => ({ saved: state.saved, history: state.history.slice(-20) })
    }
  )
);

export default useMovieStore;