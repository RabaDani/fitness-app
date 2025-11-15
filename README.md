# Fitness Tracker Application

A comprehensive fitness tracking web application built with Preact and TypeScript. Track your meals, exercises, weight progress, and achieve your health goals with an intuitive interface and gamification features.

## Features

### Core Functionality
- **Meal Tracking**: Log daily meals with detailed nutritional information
  - Search from local database or Spoonacular API
  - Favorite foods for quick access
  - Track calories, protein, carbs, and fats
  - Organize by meal type (breakfast, lunch, dinner, snacks)

- **Exercise Logging**: Monitor your workouts and calorie burn
  - Pre-defined exercise database by category (cardio, strength, flexibility, sports)
  - Create custom exercises
  - Track duration and calories burned
  - Net calorie calculation (intake - burned)

- **Weight Tracking**: Monitor your progress over time
  - Visual weight chart with trend analysis
  - Goal progress tracking
  - Congratulations modal when reaching goals
  - Pre-filled weight entries for convenience

- **Statistics & Analytics**: View your progress with interactive charts
  - Weekly calorie intake trends
  - Macro distribution (protein, carbs, fats)
  - Visual progress indicators

### User Experience
- **Profile Management**: Personalized fitness profile
  - BMI-based calculations (Mifflin-St Jeor equation)
  - Activity level adjustment
  - Auto-calculated goal weight with manual override
  - Automatic goal type adjustment (lose/gain/maintain)

- **Gamification**: Stay motivated with achievement system
  - Streak tracking (current and longest)
  - Unlockable achievements
  - Progress badges for milestones

- **Dark Mode**: Eye-friendly interface with full dark mode support
  - Seamless theme switching
  - Persistent preference storage

- **Daily Reset**: Automatic meal and exercise reset for new days
  - History preservation
  - Streak tracking across days

- **Progressive Web App (PWA)**: Install and use offline
  - Installable on mobile and desktop
  - Offline functionality with Service Worker
  - App-like experience
  - Auto-updates

## Tech Stack

### Frontend
- **Preact** - Lightweight React alternative (3KB)
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Vite** - Fast build tool and dev server

### Libraries
- **Recharts** - Interactive charts and graphs
- **Lucide Preact** - Beautiful icon set
- **localStorage** - Client-side data persistence

### APIs
- **Spoonacular API** (optional) - Food nutrition data

## Installation

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd fitness-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Spoonacular API (Optional)**
   - Sign up at [Spoonacular](https://spoonacular.com/food-api)
   - Get your API key
   - Add to `src/utils/constants.ts`:
     ```typescript
     export const SPOONACULAR_API_KEY = 'your_api_key_here';
     ```
   - **Note**: App works without API key using mock data

4. **Start development server**
   ```bash
   npm run start
   ```

5. **Open in browser**
   - Navigate to `http://localhost:5173`

## GitHub Pages Deployment

The project is configured to automatically deploy to GitHub Pages using GitHub Actions.

### Setup Steps:

1. **Create a GitHub repository**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/USERNAME/fitness-app.git
   git push -u origin main
   ```

2. **Enable GitHub Pages**
   - Go to your repository on GitHub
   - Navigate to Settings > Pages
   - Under "Source", select **GitHub Actions**

3. **Automatic Deployment**
   - Every push to the `main` branch triggers automatic deployment
   - The workflow builds and deploys to GitHub Pages
   - View deployment status in the "Actions" tab

4. **Access Your App**
   - Your app will be available at: `https://USERNAME.github.io/fitness-app/`

### Important Notes:

- **Repository Name**: If you change the repository name from `fitness-app`, update the `base` path in [vite.config.ts](vite.config.ts):
  ```typescript
  base: mode === 'production' ? '/YOUR-REPO-NAME/' : '/',
  ```

- **Custom Domain**: To use a custom domain, add a `CNAME` file to the `public/` folder

- **First Deployment**: The first deployment may take a few minutes

## Usage

### First Time Setup
1. Complete the profile setup form with your details:
   - Gender, age, height, weight
   - Activity level
   - Goal weight (auto-calculated or custom)

2. The app will calculate your daily calorie and macro targets

### Daily Tracking
1. **Log Meals**: Click "Étkezések" → Add meals by searching or selecting favorites
2. **Log Exercises**: Click "Edzés" → Add workouts from database or create custom
3. **Track Weight**: Click "Súly" → Add weight measurements (max 1 per day)
4. **View Progress**: Check Dashboard and Statistics for insights

### Tips
- Mark foods as favorites for quick access
- Check the Dashboard daily to monitor your net calories
- Maintain your streak for achievement unlocks
- Use dark mode for comfortable evening tracking

## Project Structure

```
fitness-app/
├── public/
│   ├── manifest.json      # PWA manifest
│   ├── sw.js             # Service Worker for offline support
│   ├── logo192.png       # PWA icons
│   └── logo512.png
├── .github/
│   └── workflows/
│       └── deploy.yml    # GitHub Actions deployment
├── src/
├── components/
│   ├── features/           # Feature-specific components
│   │   ├── meals/         # Food search, meal cards
│   │   ├── exercises/     # Exercise components
│   │   ├── weight/        # Weight tracking components
│   │   └── profile/       # Profile setup and editing
│   ├── pages/             # Main navigation pages
│   │   ├── Dashboard.tsx
│   │   ├── MealsLog.tsx
│   │   ├── ExerciseLog.tsx
│   │   ├── WeightLog.tsx
│   │   ├── Statistics.tsx
│   │   └── ProfileView.tsx
│   ├── layout/            # Layout components
│   │   └── Navigation.tsx
│   └── shared/            # Reusable components
│       ├── ConfirmationModal.tsx
│       ├── MacroProgress.tsx
│       ├── ThemeToggle.tsx
│       └── ...
├── context/
│   └── AppContext.tsx     # Global state management
├── hooks/
│   ├── useLocalStorage.ts # Persistent storage
│   ├── useDailyHistory.ts # History tracking
│   ├── useDailyReset.ts   # Daily data reset
│   └── useGamification.ts # Achievements & streaks
├── utils/
│   ├── calculations.ts    # BMR, calories, macros
│   ├── chartColors.ts     # Chart theme helpers
│   ├── dateHelpers.ts     # Date utilities
│   ├── foodApi.ts         # Spoonacular integration
│   ├── pwa.ts            # Service Worker registration
│   ├── validation.ts      # Input validation
│   └── constants/         # Constants organized by domain
│       ├── calculations.ts
│       ├── database.ts
│       └── ui.ts
├── types/                 # TypeScript definitions
│   ├── models.ts         # Core domain models
│   ├── tracking.ts       # History & achievements
│   └── context.ts        # AppContext types
├── FitnessApp.tsx         # Main app component
└── main.tsx               # App entry point
```

## Development

### Available Scripts

```bash
# Start development server
npm run start

# Build for production
npm run build

# Preview production build
npm run preview

# Type checking
npm run type-check
```

### Key Development Patterns

#### Component Style
```typescript
// Regular function syntax (not arrow functions)
export function ComponentName({ prop1, prop2 }: PropsInterface) {
  return <div>...</div>;
}
```

#### Dark Mode Helper Functions
```typescript
import { getHeadingClass, getCardClass, getTextClass } from '../utils/darkMode';

// Usage in components
<h1 className={getHeadingClass(darkMode, 'h1')}>Title</h1>
<div className={getCardClass(darkMode)}>Content</div>
```

#### State Management
- Global state via `AppContext`
- Persistent state with `useLocalStorage` hook
- Automatic history tracking with custom hooks

## File Extensions

- **`.ts`** - TypeScript files (types, utils, hooks, logic)
- **`.tsx`** - TypeScript + JSX (components that render UI)

## Data Persistence

All data is stored locally in the browser using `localStorage`:
- Profile settings
- Daily meals and exercises
- Weight history
- Favorites
- Achievements and streaks
- Theme preference

**Note**: Data is device-specific and not synced across devices.

## Browser Compatibility

- Modern browsers with ES6+ support
- localStorage required
- Tested on Chrome, Firefox, Safari, Edge

## Future Enhancements

- [ ] Backend API for cross-device sync
- [ ] Mobile app (React Native)
- [ ] Social features (share progress)
- [ ] Meal planning and recipes
- [ ] Barcode scanner for food logging
- [ ] Water intake tracking
- [ ] Sleep tracking integration
- [ ] Export data (CSV, PDF reports)

## Contributing

Contributions are welcome! Please follow these guidelines:
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is open source and available under the [MIT License](LICENSE).

## Acknowledgments

- **Spoonacular API** - Food nutrition data
- **Recharts** - Beautiful charts library
- **Lucide** - Icon set
- **Tailwind CSS** - Styling framework
- **Preact Team** - Lightweight React alternative

## Contact

For questions or suggestions, please open an issue on GitHub.

---

Built with ❤️ using Preact and TypeScript
