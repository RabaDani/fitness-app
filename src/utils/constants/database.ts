/**
 * Database constants (foods, exercises, achievements)
 */

import { Food, ExerciseTemplate } from '../../types';

export const initialFoodsDB: Food[] = [
  { id: 1, name: "Csirkemell", calories: 165, protein: 31, carbs: 0, fat: 3.6, serving: 100 },
  { id: 2, name: "Rizs (főtt)", calories: 130, protein: 2.7, carbs: 28, fat: 0.3, serving: 100 },
  { id: 3, name: "Brokkoli", calories: 34, protein: 2.8, carbs: 7, fat: 0.4, serving: 100 },
  { id: 4, name: "Tojás", calories: 78, protein: 6.5, carbs: 0.6, fat: 5.5, serving: 50 },
  { id: 5, name: "Banán", calories: 89, protein: 1.1, carbs: 23, fat: 0.3, serving: 100 },
  { id: 6, name: "Alma", calories: 52, protein: 0.3, carbs: 14, fat: 0.2, serving: 100 },
  { id: 7, name: "Gulyásleves", calories: 80, protein: 6, carbs: 8, fat: 3, serving: 250 },
  { id: 8, name: "Pörkölt", calories: 150, protein: 15, carbs: 5, fat: 8, serving: 200 },
  { id: 9, name: "Túró Rudi", calories: 420, protein: 8, carbs: 45, fat: 22, serving: 51 },
  { id: 10, name: "Kenyér (fehér)", calories: 265, protein: 9, carbs: 49, fat: 3.2, serving: 100 },
  { id: 11, name: "Sajt (trappista)", calories: 340, protein: 25, carbs: 1, fat: 26, serving: 100 },
  { id: 12, name: "Joghurt", calories: 59, protein: 3.5, carbs: 4.7, fat: 3.3, serving: 100 },
  { id: 13, name: "Paradicsom", calories: 18, protein: 0.9, carbs: 3.9, fat: 0.2, serving: 100 },
  { id: 14, name: "Uborka", calories: 15, protein: 0.7, carbs: 3.6, fat: 0.1, serving: 100 },
  { id: 15, name: "Hús (marha)", calories: 250, protein: 26, carbs: 0, fat: 15, serving: 100 },
  { id: 16, name: "Lángos", calories: 300, protein: 6, carbs: 40, fat: 13, serving: 150 },
  { id: 17, name: "Rétes (almás)", calories: 250, protein: 4, carbs: 35, fat: 11, serving: 100 },
  { id: 18, name: "Pogácsa", calories: 350, protein: 8, carbs: 45, fat: 15, serving: 50 },
  { id: 19, name: "Kolbász", calories: 300, protein: 13, carbs: 2, fat: 27, serving: 100 },
  { id: 20, name: "Tej", calories: 42, protein: 3.4, carbs: 5, fat: 1, serving: 100 }
];

export const exerciseDatabase: ExerciseTemplate[] = [
  { id: 1, name: 'Futás', caloriesPerMinute: 10, category: 'cardio' },
  { id: 2, name: 'Gyaloglás', caloriesPerMinute: 4, category: 'cardio' },
  { id: 3, name: 'Kerékpározás', caloriesPerMinute: 8, category: 'cardio' },
  { id: 4, name: 'Úszás', caloriesPerMinute: 7, category: 'cardio' },
  { id: 5, name: 'Futópad', caloriesPerMinute: 9, category: 'cardio' },
  { id: 6, name: 'Spinning', caloriesPerMinute: 10, category: 'cardio' },
  { id: 7, name: 'Súlyzós edzés', caloriesPerMinute: 6, category: 'strength' },
  { id: 8, name: 'Testúlygyakorlatok', caloriesPerMinute: 5, category: 'strength' },
  { id: 9, name: 'CrossFit', caloriesPerMinute: 11, category: 'strength' },
  { id: 10, name: 'Jóga', caloriesPerMinute: 3, category: 'mobility' },
  { id: 11, name: 'Nyújtás', caloriesPerMinute: 2, category: 'mobility' },
  { id: 12, name: 'Foci', caloriesPerMinute: 9, category: 'sports' },
  { id: 13, name: 'Kosárlabda', caloriesPerMinute: 8, category: 'sports' },
  { id: 14, name: 'Tenisz', caloriesPerMinute: 7, category: 'sports' }
];

export const achievementsDatabase = [
  { id: 'streak-3', name: 'Elkötelezett Kezdő', description: '3 napos sorozat', icon: '🔥', target: 3, category: 'streak' as const },
  { id: 'streak-7', name: 'Heti Harcos', description: '7 napos sorozat', icon: '⚡', target: 7, category: 'streak' as const },
  { id: 'streak-30', name: 'Havi Mester', description: '30 napos sorozat', icon: '👑', target: 30, category: 'streak' as const },
  { id: 'meals-10', name: 'Napló Kezdő', description: '10 étel rögzítve', icon: '📝', target: 10, category: 'meals' as const },
  { id: 'meals-50', name: 'Étel Mester', description: '50 étel rögzítve', icon: '🍽️', target: 50, category: 'meals' as const },
  { id: 'meals-100', name: 'Napló Hős', description: '100 étel rögzítve', icon: '🏆', target: 100, category: 'meals' as const },
  { id: 'exercise-5', name: 'Kezdő Atléta', description: '5 edzés teljesítve', icon: '💪', target: 5, category: 'exercise' as const },
  { id: 'exercise-25', name: 'Fitness Rajongó', description: '25 edzés teljesítve', icon: '🏋️', target: 25, category: 'exercise' as const },
  { id: 'exercise-50', name: 'Edzés Bajnok', description: '50 edzés teljesítve', icon: '🥇', target: 50, category: 'exercise' as const },
  { id: 'burn-1000', name: 'Kalória Égető', description: '1000 kcal elégetés', icon: '🔥', target: 1000, category: 'exercise' as const },
  { id: 'burn-5000', name: 'Zsírégető Hős', description: '5000 kcal elégetés', icon: '💥', target: 5000, category: 'exercise' as const }
];

export const defaultUserStats = {
  currentStreak: 0,
  longestStreak: 0,
  totalMealsLogged: 0,
  totalExercises: 0,
  totalCaloriesBurned: 0,
  achievementsUnlocked: [],
  lastLogDate: ''
};
