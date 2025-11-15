import { Food } from '../types';
import { SPOONACULAR_API_KEY } from './constants';

/**
 * Search for foods in local database
 */
export const searchLocalFoods = (foods: Food[], query: string): Food[] => {
  return foods.filter(food =>
    food.name.toLowerCase().includes(query.toLowerCase())
  );
};

/**
 * Search for foods using Spoonacular API
 * @param query - Search term
 * @returns Array of foods with nutrition information and images
 */
export const searchSpoonacularFoods = async (query: string): Promise<Food[]> => {
  if (!SPOONACULAR_API_KEY) {
    throw new Error('Spoonacular API key not configured');
  }

  // Search for ingredients
  const params = new URLSearchParams({
    query,
    number: '6',
    language: 'en'
  });
  const searchUrl = `https://api.spoonacular.com/food/ingredients/search?${params.toString()}&apiKey=${SPOONACULAR_API_KEY}`;
  const searchResponse = await fetch(searchUrl);

  if (!searchResponse.ok) {
    throw new Error(`Search failed with status ${searchResponse.status}`);
  }

  const searchData = await searchResponse.json();
  const hits = searchData.results || [];

  // Fetch detailed nutrition for each ingredient
  const detailedFoods = await Promise.all(
    hits.map(async (hit: any) => {
      try {
        const infoUrl = `https://api.spoonacular.com/food/ingredients/${hit.id}/information?amount=100&apiKey=${SPOONACULAR_API_KEY}`;
        const infoResponse = await fetch(infoUrl);

        if (!infoResponse.ok) {
          throw new Error(`Info fetch failed with status ${infoResponse.status}`);
        }

        const info = await infoResponse.json();
        const nutrients: any[] = info.nutrition?.nutrients || [];

        // Helper to find nutrient value
        const findNutrient = (name: string): number => {
          const nutrient = nutrients.find(n => n.name.toLowerCase().includes(name));
          return nutrient ? nutrient.amount : 0;
        };

        // Extract nutrition values
        const calories = Math.round(findNutrient('calories'));
        const protein = Math.round(findNutrient('protein') * 10) / 10;
        const carbs = Math.round(findNutrient('carbo') * 10) / 10;
        const fat = Math.round(findNutrient('fat') * 10) / 10;

        // Construct full image URL from Spoonacular
        const imageName = info.image || hit.image;
        const imageUrl = imageName
          ? `https://img.spoonacular.com/ingredients_100x100/${imageName}`
          : undefined;

        const food: Food = {
          id: hit.id,
          name: hit.name,
          calories,
          protein,
          carbs,
          fat,
          serving: 100,
          image: imageUrl
        };

        return food;
      } catch (err) {
        console.warn('Failed to fetch ingredient info', hit, err);
        return null;
      }
    })
  );

  return detailedFoods.filter(Boolean) as Food[];
};
