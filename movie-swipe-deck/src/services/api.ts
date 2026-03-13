import type { Movie } from '@/types/movieTypes';

const BASE_URL = 'https://jsonfakery.com';
export const movieApi = {
  getRandomMovies: async (): Promise<Movie[]> => {
    try {
      console.log('🎬 Загрузка фильмов...');
      
      const response = await fetch(`${BASE_URL}/movies/random/20`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log(`Загружено ${data.length} фильмов`);
      return data as Movie[];
      
    } catch (error) {
      console.error('Ошибка загрузки фильмов:', error);
      throw error;
    }
  },
};