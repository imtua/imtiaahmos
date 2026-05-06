

```
██╗███╗   ███╗████████╗██╗   ██╗██████╗ ███████╗██╗   ██╗
██║████╗ ████║╚══██╔══╝██║   ██║██╔══██╗██╔════╝██║   ██║
██║██╔████╔██║   ██║   ██║   ██║██║  ██║█████╗  ██║   ██║
██║██║╚██╔╝██║   ██║   ██║   ██║██║  ██║██╔══╝  ╚██╗ ██╔╝
██║██║ ╚═╝ ██║   ██║   ╚██████╔╝██████╔╝███████╗ ╚████╔╝ 
╚═╝╚═╝     ╚═╝   ╚═╝    ╚═════╝ ╚═════╝ ╚══════╝  ╚═══╝  
```

# 🛠️ Project by ImtuDev

A minimalist, cross-platform project manager built for hardware and software makers — featuring voice control via Google Assistant, real-time sync via Supabase, and support for ingredients, collaborators, code snippets, and markdown notes.

Available as a **React Native (Expo) mobile app** and a **desktop web app**.

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Prerequisites](#-prerequisites)
- [Supabase Setup](#-supabase-setup)
- [Mobile App Setup](#-mobile-app-setup)
- [Desktop App Setup](#️-desktop-app-setup)
- [Building an APK](#-building-an-apk)
- [Google Assistant Integration](#️-google-assistant-integration)
- [Project Structure](#-project-structure)
- [Security Notes](#-security-notes)
- [Troubleshooting](#-troubleshooting)
- [License](#-license)

---

## ✨ Features

| Feature | Description |
|---|---|
| 📁 **Project CRUD** | Create, view, edit, and delete projects with full metadata support |
| 🏷️ **Categories** | Organize into Personal, Business, or Educational buckets |
| 📊 **Status Tracking** | Planning → In Progress → Review → Done → Archived |
| 🔩 **Hardware Ingredients** | Track components with auto-suggest from 100+ parts |
| 👥 **Collaborators** | Manage team members and their financial contributions |
| 💻 **Code Snippets** | Store project code directly inside each project record |
| 📝 **Markdown Notes** | Rich notes rendered in full Markdown |
| 🔍 **Search & Filter** | Filter by status, category, or keyword instantly |
| 🔄 **Cross-Device Sync** | Real-time sync via Supabase across all devices |
| 🎙️ **Voice Control** | Create and update projects hands-free via Google Assistant |

---

## 🧰 Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| 📱 Mobile | React Native + Expo | Cross-platform iOS & Android app |
| 🖥️ Desktop | HTML / CSS / JS (Electron-ready) | Lightweight desktop interface |
| 🗄️ Database | Supabase (PostgreSQL) | Real-time database with RLS |
| ⚡ Edge Functions | Supabase Edge Functions (Deno) | Serverless webhook handler |
| 🎙️ Voice | IFTTT + Google Assistant | Natural language voice commands |
| 📦 Build | EAS Build | Compile production APK/IPA |

---

## ✅ Prerequisites

Make sure the following are installed and set up before continuing:

- **Node.js** v18 or later — [nodejs.org](https://nodejs.org)
- **npm** v9+ (bundled with Node.js)
- **Expo CLI** — install globally:
  ```bash
  npm install -g expo-cli
  ```
- **EAS CLI** (for APK builds) — install globally:
  ```bash
  npm install -g eas-cli
  ```
- **Supabase account** — [supabase.com](https://supabase.com) (free tier works)
- **IFTTT account** — [ifttt.com](https://ifttt.com) (for Google Assistant integration)
- **Expo account** — [expo.dev](https://expo.dev) (required for EAS builds)

---

## 🗄️ Supabase Setup

### Step 1 — Create a Supabase project

Log in at [supabase.com](https://supabase.com), click **New Project**, choose a name, set a strong database password, and select your region. Wait ~2 minutes for provisioning.

### Step 2 — Create the `projects` table

Navigate to **SQL Editor** in your Supabase dashboard and run:

```sql
CREATE TABLE projects (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title                 TEXT NOT NULL,
  category              TEXT CHECK (category IN ('Personal', 'Business', 'Educational')),
  status                TEXT CHECK (status IN ('Planning', 'In Progress', 'Review', 'Done', 'Archived'))
                        DEFAULT 'Planning',
  created_at            TIMESTAMPTZ DEFAULT now(),
  project_note          TEXT,
  project_ingredients   JSONB DEFAULT '[]'::jsonb,
  project_code          TEXT,
  project_collaborators JSONB DEFAULT '[]'::jsonb
);
```

### Step 3 — Enable Row-Level Security (RLS)

Run the following to enable RLS and configure access policies:

```sql
-- Enable RLS on the projects table
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to read all projects
CREATE POLICY "Allow authenticated read"
  ON projects FOR SELECT TO authenticated USING (true);

-- Allow authenticated users to insert projects
CREATE POLICY "Allow authenticated insert"
  ON projects FOR INSERT TO authenticated WITH CHECK (true);

-- Allow authenticated users to update projects
CREATE POLICY "Allow authenticated update"
  ON projects FOR UPDATE TO authenticated USING (true);

-- Allow authenticated users to delete projects
CREATE POLICY "Allow authenticated delete"
  ON projects FOR DELETE TO authenticated USING (true);

-- Allow the Edge Function service role full access (for webhook actions)
CREATE POLICY "Allow service role full access"
  ON projects FOR ALL TO service_role
  USING (true) WITH CHECK (true);
```

### Step 4 — Retrieve your API keys

Go to **Project Settings → API** and note these values — you'll need them throughout setup:

```env
SUPABASE_URL=https://xxxxxxxxxxx.supabase.co
SUPABASE_ANON_KEY=your-anon-public-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key   # Edge Function only — keep secret
```

> ⚠️ **Never expose your `service_role` key in client-side code or commit it to version control.**

---

## 📱 Mobile App Setup

### Step 1 — Clone the repository

```bash
git clone https://github.com/ImtuDev/project-by-imtudev.git
cd project-by-imtudev
```

### Step 2 — Install dependencies

```bash
npm install
```

### Step 3 — Configure Supabase credentials

Open `app.config.js` and fill in your Supabase project details:

```js
// app.config.js
export default {
  expo: {
    name: "Project by ImtuDev",
    slug: "project-by-imtudev",
    extra: {
      supabaseUrl: "https://YOUR_PROJECT_ID.supabase.co",
      supabaseAnonKey: "YOUR_ANON_PUBLIC_KEY",
    },
  },
};
```

> These values are read by `supabaseClient.js` at runtime via `expo-constants`.

### Step 4 — Start the development server

```bash
npx expo start
```

| Key | Action |
|---|---|
| `a` | Open on Android emulator or device |
| `i` | Open on iOS simulator (macOS only) |
| Scan QR | Open in Expo Go on a physical device |

---

## 🖥️ Desktop App Setup

The desktop version lives in the `desktop/` folder and can be opened directly in a browser or run with Electron.

### Option A — Open in browser (quick start)

```bash
cd desktop
open index.html    # macOS
start index.html   # Windows
```

### Option B — Run with Electron

**1. Install Electron:**

```bash
cd desktop
npm init -y
npm install electron --save-dev
```

**2. Create `desktop/main.js`:**

```js
const { app, BrowserWindow } = require('electron');

app.whenReady().then(() => {
  const win = new BrowserWindow({ width: 1280, height: 800 });
  win.loadFile('index.html');
});
```

**3. Add start script to `desktop/package.json`:**

```json
{
  "main": "main.js",
  "scripts": {
    "start": "electron ."
  }
}
```

**4. Configure credentials in `desktop/.env`:**

```env
SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
SUPABASE_ANON_KEY=YOUR_ANON_PUBLIC_KEY
```

**5. Launch:**

```bash
npm start
```

---

## 📦 Building an APK

Use **EAS Build** to compile a standalone Android APK.

### Step 1 — Log in to Expo

```bash
eas login
```

### Step 2 — Configure EAS

```bash
eas build:configure
```

### Step 3 — Set APK build type in `eas.json`

```json
{
  "build": {
    "preview": {
      "android": {
        "buildType": "apk"
      }
    },
    "production": {}
  }
}
```

### Step 4 — Build the APK

```bash
eas build --platform android --profile preview
```

> ℹ️ The build runs in the cloud. Download the APK from your [Expo dashboard](https://expo.dev) when it completes.

---

## 🎙️ Google Assistant Integration

The Edge Function at `supabase/functions/google-assistant-webhook/index.ts` receives IFTTT webhooks and maps voice commands to database actions. Requests are authenticated via a `?token=` query parameter.

### Supported actions

| Action | What it does |
|---|---|
| `create_project` | Creates a new project record |
| `append_note` | Appends text to a project's markdown notes |
| `update_status` | Changes a project's status |
| `add_ingredients` | Adds hardware components to a project |

### Step 1 — Install the Supabase CLI

```bash
npm install -g supabase
```

### Step 2 — Link to your Supabase project

```bash
supabase login
supabase link --project-ref YOUR_PROJECT_ID
```

### Step 3 — Deploy the Edge Function

```bash
supabase functions deploy google-assistant-webhook
```

### Step 4 — Set the secret token

```bash
supabase secrets set WEBHOOK_TOKEN=your-secret-token
```

> Generate a long, random string for this. Treat it like a password.

### Step 5 — Set up your IFTTT Applet

Create a new IFTTT Applet:

- **If:** Google Assistant — *"Say a phrase with a text ingredient"*
- **Then:** Webhooks — *Make a web request*

Configure the webhook as follows:

```
URL:     https://YOUR_PROJECT_ID.supabase.co/functions/v1/google-assistant-webhook?token=your-secret-token
Method:  POST
Type:    application/json
Body:    {"action": "create_project", "title": "{{TextField}}"}
```

Adjust the `action` field and body per the applet's intent.

---

## 📂 Project Structure

```
project-by-imtudev/
├── App.js                         # Root component & navigation
├── app.config.js                  # Expo config & env vars
├── supabaseClient.js              # Supabase client initialisation
├── eas.json                       # EAS build profiles
├── package.json
│
├── screens/
│   ├── HomeScreen.js              # Project list, search & filter
│   ├── AddProjectScreen.js        # Create / edit a project
│   └── ProjectDetailScreen.js     # Full project view
│
├── components/
│   ├── ProjectCard.js             # Project summary card
│   └── ConfirmModal.js            # Reusable confirm dialog
│
├── desktop/
│   ├── index.html                 # Desktop entry point
│   ├── style.css                  # Desktop styles
│   └── renderer.js                # Desktop logic & Supabase calls
│
└── supabase/
    └── functions/
        └── google-assistant-webhook/
            └── index.ts           # Webhook Edge Function (Deno)
```

---

## 🔐 Security Notes

- **Never commit your `service_role` key** to version control. It bypasses all RLS policies.
- The **`WEBHOOK_TOKEN`** secret should be a long, randomly generated string — treat it like a password.
- Add `.env` and any files containing secrets to your **`.gitignore`** before your first commit.
- **RLS policies** ensure only authenticated users can read or modify data — do not disable them in production.
- **Rotate your `WEBHOOK_TOKEN`** immediately if you suspect it has been exposed.

---

## 🛠️ Troubleshooting

**App fails to connect to Supabase**
> Double-check that `supabaseUrl` and `supabaseAnonKey` in `app.config.js` are correct and match what's shown in your Supabase project's API settings.

**RLS policy error when querying**
> Make sure you created all four RLS policies from the Supabase Setup section. Confirm RLS is enabled under **Authentication → Policies** in the Supabase dashboard.

**Google Assistant webhook returns 401**
> The `?token=` query parameter in your IFTTT applet URL does not match the `WEBHOOK_TOKEN` secret. Re-run `supabase secrets set WEBHOOK_TOKEN=...` and update the IFTTT webhook URL.

**EAS build fails with "missing credentials"**
> Run `eas login` to ensure you are authenticated, and verify your Expo account has a project slug that matches the `slug` field in `app.config.js`.

**Desktop app shows a blank screen**
> Open your browser's developer console and check for CORS or network errors. Make sure `renderer.js` has the correct Supabase URL and anon key configured.

---

## 📄 License

This project is open source and available under the **MIT License**. You are free to use, modify, and distribute it for personal or commercial purposes. See the [`LICENSE`](./LICENSE) file for the full text.

Made for those who contributes in project in their daily life.

---

<div align="center">Built with ❤️ by <strong>ImtuDev</strong></div>
