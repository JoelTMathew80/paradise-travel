# 🌴 Paradise Travel — Southern India, Season by Season

An interactive, responsive travel web application showcasing 14 curated destinations across Southern India (Kerala, Karnataka, Goa, and the Andaman Islands). Built with **React 18**, **Vite**, **Bootstrap 5**, and modern front-end best practices with asynchronous REST API telemetry and interactive mapping.

![React 18](https://img.shields.io/badge/React-18.3-61DAFB?style=flat-square&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?style=flat-square&logo=vite&logoColor=white)
![Bootstrap 5](https://img.shields.io/badge/Bootstrap-5.3-7952B3?style=flat-square&logo=bootstrap&logoColor=white)
![Open--Meteo](https://img.shields.io/badge/API-Open--Meteo-0E7C7B?style=flat-square)
![Google Maps](https://img.shields.io/badge/Google-Maps_Embed_API-4285F4?style=flat-square&logo=googlemaps&logoColor=white)

---

## 🚀 Quick Start

### 1. Clone the repository
```bash
git clone https://github.com/JoelTMathew80/paradise-travel.git
cd paradise-travel
```

### 2. Install dependencies
```bash
npm install
```

### 3. Start local development server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for production
```bash
npm run build
```
Creates an optimized production bundle in the `dist/` directory.

### 5. Preview production build
```bash
npm run preview
```

---

## 🌟 Key Features

### 1. Curated Destination Catalog (14 Locations)
- Covers **Beaches**, **Hills**, **History & Culture**, **Backwaters**, **Wildlife**, and **Waterfalls**.
- Features verified travel facts, nearest airports/railway stations, transit guidelines, local advisories (e.g. Eravikulam calving season closure, temple attire rules, houseboat 5:30 PM anchoring laws), and exact rupee budget breakdowns.

### 2. Live Weather Telemetry (Open-Meteo API)
- Real-time weather fetched via Open-Meteo's forecast API using latitude/longitude coordinates.
- **In-Memory Caching**: Weather data is cached in memory per destination to prevent redundant network calls.
- Interprets WMO weather codes into custom icons (`☀️`, `🌤️`, `🌫️`, `🌧️`, `⛈️`) and temperature badges on every card and in the planner.

### 3. Interactive Google Maps Explorer (Search Mode)
- Embeds Google Maps searching for tourist attractions, viewpoints, historic temples, beaches, restaurants, or hotels.
- **Lazy-Loaded**: Map `<iframe>` only loads when scrolled into the viewport via `IntersectionObserver`.
- Includes direct *"Open in Google Maps ↗"* external navigation.

### 4. Rich Itinerary Planner (2, 3, or 5 Days)
- Step through daily itineraries divided into **🌅 Morning**, **☀️ Afternoon**, and **🌙 Evening** slots.
- **Dynamic Duration Selector**: Toggle between 2-Day, 3-Day, and 5-Day plans with live re-rendering.
- **How to Reach Card**: Nearest airports, railway stations, and local transit.
- **Budget Breakdown**: Proportional color-coded progress bars (Stay, Food, Transit, Activities).
- **Live Cost Estimator**: Reactive calculator computing group estimates based on travellers $\times$ nights.

### 5. Formspree HTTP POST Enquiry Dispatch
- Asynchronous form submission sending structured `application/json` payloads.
- Submit button shows a loading spinner during network transmission.
- Displays interactive **Bootstrap 5 Toasts** for status feedback.

### 6. Collapsible REST API Network Inspector
- A floating developer drawer showing real-time network telemetry:
  - HTTP Method badges (`GET`, `POST`, `EMBED`)
  - Status codes (`200 OK`, `CACHED`, `4xx/5xx`)
  - URL endpoints and execution latency (`⚡ Xms`)

### 7. Dark / Light Mode
- Accessible theme toggle with smooth CSS variable transitions (`data-theme="dark"` / `data-theme="light"`).

---

## 📂 Project Architecture

```
paradise/
├── index.html                   # HTML entry point with #root container
├── package.json                 # Scripts and project dependencies
├── vite.config.js               # Vite configuration with React plugin
├── public/
│   └── destinations.json        # Static JSON dataset with coordinates & itineraries
└── src/
    ├── main.jsx                 # React root render entry
    ├── App.jsx                  # Main state container and layout coordinator
    ├── styles/
    │   └── style.css            # Design tokens, responsive grid, and dark mode
    ├── utils/
    │   ├── helpers.js           # Currency formatting (INR) and month constants
    │   └── weather.js           # Open-Meteo API client and in-memory cache
    └── components/
        ├── Navbar.jsx           # Responsive header, theme toggle, mobile drawer
        ├── Hero.jsx             # Hero headline, artwork, and quick search form
        ├── SceneArt.jsx         # Procedural SVG landscape generator
        ├── FilterToolbar.jsx    # Category chips & month filter dropdown
        ├── DestinationGrid.jsx  # Destination catalog grid & empty state
        ├── DestinationCard.jsx  # Individual destination card with weather badge
        ├── MapExplorer.jsx      # Google Maps embed with place-type selector
        ├── TripPlanner.jsx      # Multi-day itinerary viewer with time slots
        ├── RichDetails.jsx      # Transit info, budget bars, tips, and calculator
        ├── CostCalculator.jsx   # Reactive group budget calculator
        ├── EnquiryForm.jsx      # Asynchronous Formspree POST submission
        └── ApiLogDrawer.jsx     # Floating REST API network telemetry drawer
```

---

## 🛠️ Built With

- **[React 18](https://react.dev/)**: Component-based UI with Hooks (`useState`, `useEffect`, `useCallback`)
- **[Vite](https://vitejs.dev/)**: Next-generation frontend tooling with instant HMR
- **[Bootstrap 5](https://getbootstrap.com/)**: Responsive layout utilities, toasts, and spinners
- **[Open-Meteo](https://open-meteo.com/)**: Free open-source weather API
- **[Google Maps Embed API](https://developers.google.com/maps/documentation/embed/get-started)**: Search-mode tourist discovery
- **Google Fonts**: Bricolage Grotesque, DM Sans, and JetBrains Mono

---

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).
