import { useState } from 'preact/hooks';
import { Food } from '../types';
import { searchLocalFoods, searchSpoonacularFoods } from '../utils/foodApi';
import { SPOONACULAR_API_KEY } from '../utils/constants/ui';

/**
 * Custom hook for food search functionality
 * Handles local database search and API fallback
 */
export function useFoodSearch(foodsDB: Food[], setFoodsDB: (foods: Food[]) => void) {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Food[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  /**
   * Search for food in local database first, then API if needed
   */
  const handleSearch = async (): Promise<void> => {
    if (!searchTerm.trim()) return;

    setIsSearching(true);
    setSearchError(null);

    // Search in local database first
    const localResults = searchLocalFoods(foodsDB, searchTerm);

    if (localResults.length > 0) {
      setSearchResults(localResults);
      setIsSearching(false);
      return;
    }

    // Fallback to Spoonacular API
    try {
      if (SPOONACULAR_API_KEY) {
        const foods = await searchSpoonacularFoods(searchTerm);

        if (foods.length > 0) {
          setFoodsDB([...foodsDB, ...foods]);
          setSearchResults(foods);
          setIsSearching(false);
          return;
        }
      }

      // No results found
      setSearchResults([]);
      setSearchError('Nem találtunk ilyen ételt. Próbálj meg más keresési kifejezést!');
    } catch (error) {
      console.error('API search failed:', error);
      setSearchError('Hiba történt a keresés során. Próbáld újra!');
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  return {
    searchTerm,
    setSearchTerm,
    searchResults,
    isSearching,
    searchError,
    handleSearch
  };
}
