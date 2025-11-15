# Fitness/Calorie Calculator App
## Házi Feladat Specifikáció

## Alkalmazás célja:
Kalória- és makrotápanyag-követő alkalmazás, amely segít nyomon követni a napi étkezéseket, edzéseket, súlyváltozást és táplálkozási célokat.

## Főbb funkciók:
1. **Profil és célok**: A felhasználó megadja alapadatait (nem, életkor, magasság, súly, aktivitási szint) és célját (fogyás/hízás/súlytartás). Az app kiszámítja a napi kalória- és makrócélt.

2. **Étkezések naplózása intelligens kereséssel**: Ételek hozzáadása napi étkezésekhez (reggeli, ebéd, vacsora, nasi). A keresés először a Local Storage-ban lévő adatbázisban keres (30+ előre feltöltött étel), ha nincs találat, akkor API-ból (Spoonacular) kérdezi le és cache-eli. Minden ételnél kalória, fehérje, szénhidrát, zsír adatok.

3. **Edzések naplózása**: Edzések hozzáadása kategóriánként (kardió, erősítés, rugalmasság, sport), kalóriaégetés számítással. Egyedi edzések létrehozásának lehetősége.

4. **Súly változás követése**: Napi mérések megadása, vizuális grafikon a változásról, célkövetés és gratulációs modal cél elérésekor.

5. **Napi dashboard**: Összesítő nézet a napi kalóriabevitelről vs. cél, makró eloszlás diagrammal (pie chart), progress bar-ok, nettó kalória számítás (bevitel - elégetés).

6. **Statisztikák**: Heti grafikonok (Recharts) a kalória és makró bevitelről, átlag értékek megjelenítése.

7. **Kedvencek**: Gyakran fogyasztott ételek mentése gyors hozzáadáshoz.

8. **Gamifikáció**: Sorozat követés (streak), kitüntetések rendszer motivációs célból.

9. **Dark mode**: Teljes dark mode támogatás szemkímélő használathoz.

10. **Perzisztencia**: Minden adat Local Storage-ban (profil, étkezések, edzések, súly mérések, kedvencek, előzmények, gamifikációs adatok). Automatikus napi reset funkció.

---

## Technikai részletek:

### 1. Profil és célok
- A felhasználó megadja alapadatait:
  - Nem (férfi/nő)
  - Életkor
  - Magasság (cm)
  - Jelenlegi súly (kg)
  - Aktivitási szint (ülő, közepes, aktív, nagyon aktív, extrém aktív)
  - Cél (fogyás/hízás/súlytartás)
- Az app automatikusan kiszámítja:
  - Napi kalóriacélt (Mifflin-St Jeor egyenlet alapján)
  - Makrócélokat (fehérje, szénhidrát, zsír)
  - Ajánlott célsúlyt (BMI alapján, manuális felülírás lehetséges)
- A célsúly megadásakor automatikusan beállítja a cél típusát (fogyás/hízás/súlytartás)
- Profil szerkesztése modal ablakban, kalória és makró újraszámítással

### 2. Étkezések naplózása intelligens kereséssel
- Ételek hozzáadása napi étkezésekhez kategóriák szerint:
  - Reggeli
  - Ebéd
  - Vacsora
  - Snack/nasi
- Kétfázisú keresési rendszer:
  1. **Első fázis**: Local Storage-ban lévő adatbázisban keres (30+ előre feltöltött magyar étel)
  2. **Második fázis**: Ha nincs találat, Spoonacular API-ból kérdezi le és cache-eli
  3. **Harmadik fázis**: API hiba esetén mock adat generálás
- Minden ételnél részletes adatok:
  - Kalória
  - Fehérje (g)
  - Szénhidrát (g)
  - Zsír (g)
  - Kép (ha elérhető)
  - Adag méret (g)
- Tab alapú keresés:
  - **Keresés fül**: Új ételek keresése
  - **Kedvencek fül**: Gyorsan elérhető kedvenc ételek
- Mennyiség szabályozás (gramm alapon) dinamikus kalória/makró számítással
- Törlés megerősítő modal-lal (véletlen törlés megelőzése)
- Loading state API hívások során
- Hibaüzenetek kezelése
- Üres állapot kezelés (nincs étel a listán)

### 3. Edzés naplózás
- Edzések hozzáadása kategóriák szerint:
  - Kardió (futás, kerékpározás, úszás, stb.)
  - Erősítés (súlyzó, testesúly gyakorlatok, stb.)
  - Rugalmasság (jóga, nyújtás, stb.)
  - Sport (foci, kosár, tenisz, stb.)
- Előre definiált edzés adatbázis 50+ gyakorlattal
- Egyedi edzések létrehozása lehetséges
- Időtartam megadása (perc)
- Automatikus kalóriaégetés számítás időtartam alapján
- Napi összesített edzéskalória megjelenítés
- Törlés megerősítő modal-lal

### 4. Súly követés
- Súlymérések naplózása (max 1/nap)
- Vizuális súlygrafikon (Recharts):
  - Időbeli változás kimutatása
  - Célsúly jelölés a grafikonon
  - Trend megjelenítés
- Előrehaladás számítás:
  - Aktuális súly vs. kezdő súly
  - Haladás százalékban
  - Célhoz hátralévő kg
- Legutóbbi mérés automatikus előtöltése új méréskor
- Gratulációs modal a súlycél elérésekor:
  - Sikeres cél elérésének kijelzése
  - Új cél beállítás lehetősége azonnal
  - Automatikus cél típus beállítás
- Törlés megerősítő modal-lal

### 5. Napi Dashboard
- Összesítő nézet több szekció:
  - **Kalória követés**:
    - Bevitt kalória (ételekből)
    - Elégetett kalória (edzésekből)
    - Nettó kalória (bevitel - elégetés)
    - Progress bar célhoz viszonyítva
  - **Makrók követése**:
    - Fehérje progress bar
    - Szénhidrát progress bar
    - Zsír progress bar
    - Aktuális vs. cél érték minden makrónál
  - **Makró eloszlás diagram** (Pie chart):
    - Vizuális ábrázolás az arányokról
    - Színkódolt szegmensek
  - **Mai ételek listája**:
    - Étkezés típus szerinti csoportosítás
    - Gyors áttekintés kép és kalória adatokkal
  - **Sorozat számláló**:
    - Jelenlegi napi sorozat
    - Leghosszabb sorozat rekord
    - Motivációs üzenetek
  - **Kitüntetések badge**:
    - Feloldott kitüntetések száma
    - Kattintásra teljes lista modal-ban

### 6. Statisztikák
- Heti grafikonok (Recharts):
  - **Kalória bevitel vonal grafikon**:
    - Napi kalória az elmúlt 7 napból
    - Cél vonal jelzés
  - **Makró oszlop grafikon**:
    - Fehérje/Szénhidrát/Zsír heti bontásban
    - Színkódolt oszlopok
- Napi összesítők:
  - Átlag kalória
  - Átlag fehérje
  - Átlag szénhidrát
  - Átlag zsír
- Üres állapot kezelés (nincs még adat)

### 7. Gamifikáció
- **Sorozat rendszer**:
  - Automatikus sorozat számolás napi bejelentkezéskor
  - Törés észlelés (1+ nap kimaradás)
  - Jelenlegi és leghosszabb sorozat nyilvántartás
- **Kitüntetések rendszer**:
  - 15+ feloldható achievement
  - Három kategória:
    - Sorozat kitüntetések (3, 7, 14, 30 nap)
    - Étkezés kitüntetések (10, 50, 100, 250 étel)
    - Edzés kitüntetések (5, 20, 50 edzés, 1000/5000 kalória égetés)
  - Progress bar feloldatlan achievement-eknél
  - Vizuális visszajelzés (emoji ikonok, színkódolás)
- **Achievements modal**:
  - Kategóriánkénti csoportosítás
  - Feloldott/feloldatlan állapot
  - Progress megjelenítés
  - Összesített statisztika (X/Y feloldva)

### 8. Kedvencek
- Gyakran fogyasztott ételek mentése
- Szív ikon toggle minden ételnél
- Dedikált "Kedvencek" fül az étel hozzáadás modal-ban
- Gyors hozzáférés a kedvenc ételekhez
- Üres állapot kezelés (nincs kedvenc)

### 9. Dark Mode
- Teljes dark mode támogatás minden nézetben
- Központi dark mode helper függvények:
  - `getHeadingClass()`
  - `getCardClass()`
  - `getTextClass()`
  - `getBgClass()`
  - `getModalClass()`
  - `getInputClass()`
  - `getButtonClass()`
  - `getChartColors()`
- Téma váltó gomb a navigációban
- Perzisztens beállítás (localStorage)
- Szembarát színpaletta dark módban

### 10. Napi reset funkció
- Automatikus daily reset rendszer:
  - Ételek törlése új nap kezdetekor
  - Edzések törlése új nap kezdetekor
  - Előzmények megőrzése statisztikákhoz
  - Sorozat automatikus frissítés
- `useDailyReset` custom hook implementáció
- localStorage alapú dátum ellenőrzés
- Zökkenőmentes háttérben működés

### 11. Perzisztencia
Minden adat Local Storage-ban mentve:
- Felhasználói profil
- Napi ételek
- Napi edzések
- Étel adatbázis (cache)
- Kedvenc ételek
- Súly történet
- Napi előzmények (statisztikákhoz)
- Egyedi edzések
- Gamifikációs statisztikák (sorozatok, achievements)
- Dark mode beállítás

### 12. Egyéb funkciók
- **Profil reset**:
  - Teljes adattörlés lehetősége
  - Megerősítő modal (véletlen törlés megelőzése)
  - Kezdő étel adatbázis visszaállítás
- **Responsive design**:
  - Desktop optimalizált (2 oszlopos layout)
  - Scroll minimalizálás
  - Grid rendszer a dashboardon
- **Hibakezelés**:
  - localStorage hibák kezelése (SecurityError, QuotaExceededError)
  - API hibák kezelése
  - Validációs hibák
  - Felhasználóbarát hibaüzenetek
- **Loading állapotok**:
  - API hívások során spinner
  - Optimista UI update-ek
- **Confirmation modal-ok**:
  - Egyedi modal komponens (nem natív confirm)
  - 3 variáns (danger/warning/info)
  - Részletes törlés információk

## Technikai specifikáció:

### Frontend stack:
- **Framework**: Preact (React alternatíva, 3KB)
- **Nyelv**: TypeScript (type safety)
- **Styling**: Tailwind CSS (utility-first)
- **Build tool**: Vite (gyors development)
- **Charts**: Recharts (interaktív grafikonok)
- **Icons**: Lucide Preact (modern ikonok)

### Architektúra:
- **Component structure**:
  - `features/` - Feature-specifikus komponensek
  - `pages/` - Navigációs oldalak
  - `layout/` - Layout komponensek
  - `shared/` - Újrafelhasználható komponensek
- **State management**: React Context API
- **Custom hooks**:
  - `useLocalStorage` - Perzisztens state
  - `useDailyHistory` - Történet nyilvántartás
  - `useDailyReset` - Automatikus napi reset
  - `useGamification` - Achievement és sorozat logika
- **Component style**: Regular function declarations (nem arrow functions)
- **Barrel exports**: index.ts fájlok tiszta importokhoz

### API integráció:
- **Spoonacular API**:
  - Food search endpoint
  - Nutrition data endpoint
  - Automatikus cache Local Storage-ban
  - Fallback mock data API hiba esetén
  - Rate limit kezelés

### Kalória számítások:
- **BMR (Basal Metabolic Rate)**: Mifflin-St Jeor egyenlet
  - Férfi: BMR = 10 × súly + 6.25 × magasság - 5 × kor + 5
  - Nő: BMR = 10 × súly + 6.25 × magasság - 5 × kor - 161
- **TDEE (Total Daily Energy Expenditure)**: BMR × aktivitási szorzó
  - Ülő (1.2)
  - Könnyű aktivitás (1.375)
  - Közepes aktivitás (1.55)
  - Aktív (1.725)
  - Extrém aktív (1.9)
- **Cél kalória**:
  - Fogyás: TDEE - 500 kcal
  - Hízás: TDEE + 500 kcal
  - Súlytartás: TDEE
- **Makró arányok**:
  - Fehérje: 2g × testsúly (kg)
  - Zsír: 25% összes kalóriából
  - Szénhidrát: maradék kalória

### Adatszerkezetek:
```typescript
Profile {
  gender, age, height, weight, goalWeight,
  activity, goal, dailyCalories, macros
}

Meal {
  id, name, mealType, amount,
  calories, protein, carbs, fat,
  serving, timestamp, image
}

Exercise {
  id, name, category, duration,
  caloriesBurned, timestamp, isCustom
}

WeightEntry {
  weight, date, note
}

Achievement {
  id, name, description, icon,
  category, target, progress, unlockedAt
}
```

## Értékelési szempontok:

✅ **TypeScript használat**: Teljes TypeScript implementáció típusokkal
✅ **Modern React patterns**: Hooks, functional components, context API
✅ **Code organization**: Jól strukturált mappák, barrel exports
✅ **State management**: Global state + local storage perzisztencia
✅ **API integráció**: Spoonacular API + cache stratégia
✅ **UI/UX**: Responsive, dark mode, loading states, error handling
✅ **Charts**: Recharts használat statisztikákhoz
✅ **Gamification**: Motivációs elemek (streaks, achievements)
✅ **Data persistence**: Comprehensive localStorage használat
✅ **Code quality**: Clean code, dokumentáció, típusbiztonság

## Bónusz funkciók (megvalósítva):
- ✅ Edzés követés kalória égetés számítással
- ✅ Súly tracking vizuális grafikonokkal
- ✅ Gamifikáció (sorozatok, achievements)
- ✅ Dark mode teljes támogatással
- ✅ Napi automatikus reset
- ✅ Célsúly elérés gratulációs modal
- ✅ Egyedi edzések létrehozása
- ✅ Confirmation modal-ok (nem natív alert)
- ✅ Progress bar-ok és vizuális feedbackek
- ✅ Célsúly automatikus számítás BMI alapján
- ✅ Üres állapot kezelések minden listában

---

**Fejlesztési idő**: ~40 óra
**Kód sorok száma**: ~3500+ sor TypeScript/TSX
**Komponensek száma**: 25+ komponens
**Custom hooks**: 4 hook
**API integrációk**: 1 (Spoonacular)
