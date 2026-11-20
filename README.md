# 🌴 Paradise Travel — Southern India, Season by Season

An interactive, responsive travel web application showcasing 14 curated destinations across Southern India (Kerala, Karnataka, Goa, and the Andaman Islands). Built with modern front-end best practices, asynchronous REST API integration, live weather telemetry, and interactive mapping.

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white)
![JavaScript ES6+](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=flat-square&logo=javascript&logoColor=black)
![Bootstrap 5](https://img.shields.io/badge/Bootstrap-5.3-7952B3?style=flat-square&logo=bootstrap&logoColor=white)
![Open--Meteo](https://img.shields.io/badge/API-Open--Meteo-0E7C7B?style=flat-square)
![Google Maps](https://img.shields.io/badge/Google-Maps_Embed_API-4285F4?style=flat-square&logo=googlemaps&logoColor=white)

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

## 📂 Project Structure

```
paradise/
├── index.html               # Main entry point (optimized for GitHub Pages)
├── destinations.json        # Asynchronous JSON dataset with coordinates & itineraries
├── css/
│   └── style.css            # Responsive styles, CSS custom properties, and dark mode
├── js/
│   └── app.js               # Application logic, REST API calls, state & event handlers
├── .gitignore               # Standard git ignore rules (OS, IDE, temporary files)
└── README.md                # Project documentation
```

---

## 🚀 Getting Started Locally

Because the application loads `destinations.json` via the Fetch API, browsers require an HTTP origin rather than the restricted `file:///` protocol.

### Option 1: Using Python (Recommended)
In your terminal, navigate to the project directory and run:
```bash
python -m http.server 8000
```
Open **[http://localhost:8000](http://localhost:8000)** in your browser.

### Option 2: Using Node.js
```bash
npx serve .
```

### Option 3: VS Code / Antigravity IDE
Install the **Live Server** extension, right-click `index.html`, and select **"Open with Live Server"**.

---

## 📤 How to Push to GitHub

Follow these steps to upload this project to your GitHub account:

### Step 1: Initialize Git
Open PowerShell or your terminal inside the project directory:
```bash
git init
```

### Step 2: Stage and Commit the Files
```bash
git add .
git commit -m "Initial commit: Paradise Travel modular web application"
```

### Step 3: Link to Your GitHub Repository
1. Go to [GitHub](https://github.com/new) and create a new repository (e.g., `paradise-travel`).
2. Do **not** initialize it with a README, .gitignore, or license (we already created them).
3. Copy the repository URL and run:
```bash
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPOSITORY_NAME.git
git push -u origin main
```

---

## 🌐 Free Hosting with GitHub Pages

Once pushed to GitHub, you can publish the live website for free in seconds:
1. In your GitHub repository, go to **Settings** → **Pages** (in the left sidebar).
2. Under **Build and deployment** → **Source**, select **Deploy from a branch**.
3. Choose branch **`main`** and folder **`/ (root)`**, then click **Save**.
4. Within 1–2 minutes, your website will be live at:
   `https://YOUR_USERNAME.github.io/YOUR_REPOSITORY_NAME/`

---

## 🛠️ Built With
- **HTML5 & CSS3** (CSS Variables, Flexbox, CSS Grid)
- **Vanilla JavaScript (ES6+)** (Fetch API, async/await, IntersectionObserver)
- **Bootstrap 5.3** (Responsive utilities, Spinners, Toasts, Alerts)
- **Open-Meteo API** (Free live weather forecasts without API keys)
- **Google Maps Embed API** (Search mode location explorer)
- **Formspree** (REST form endpoint)
