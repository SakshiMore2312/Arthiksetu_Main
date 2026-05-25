# Vercel Production Deployment Guide: ArthikSetu Frontend

This guide walk you through deploying the **ArthikSetu** frontend on Vercel, connecting it to a live FastAPI backend (e.g., hosted on Render), and configuring Firebase Authentication.

---

## 1. Vercel Project Configuration

When importing your project into Vercel, configure these settings:

| Setting | Value | Description |
| :--- | :--- | :--- |
| **Framework Preset** | `Vite` | Matches the React + Vite + TypeScript build configuration. |
| **Root Directory** | `Frontend` | Crucial! Points Vercel to the frontend sub-folder. |
| **Build Command** | `npm run build` | Compiles the production bundle via Vite. |
| **Output Directory** | `dist` | Where Vite outputs the compiled assets. |
| **Install Command** | `npm install` | Restores dependencies before building. |

---

## 2. Environment Variables Configuration

You must add the following environment variables in the Vercel dashboard under **Project Settings > Environment Variables**:

### A. Firebase Configuration
*Get these values from your **Firebase Console > Project Settings > General > Your Apps (Web App)**.*

*   `VITE_FIREBASE_API_KEY`
*   `VITE_FIREBASE_AUTH_DOMAIN`
*   `VITE_FIREBASE_PROJECT_ID`
*   `VITE_FIREBASE_STORAGE_BUCKET`
*   `VITE_FIREBASE_MESSAGING_SENDER_ID`
*   `VITE_FIREBASE_APP_ID`
*   `VITE_FIREBASE_MEASUREMENT_ID` *(Optional, for analytics)*

### B. Backend API URL
*Get this value from your FastAPI deployment on Render (or other hosting).*

*   `VITE_API_URL`: Set this to your production backend URL (e.g., `https://arthiksetu-backend.onrender.com`).
    *   *Note: Do NOT add a trailing slash (e.g., use `https://arthiksetu-backend.onrender.com` instead of `https://arthiksetu-backend.onrender.com/`).*

---

## 3. Firebase Console Configuration

To prevent authentication errors on your production build, you must whitelist your Vercel domains.

### Step 1: Add Authorized Domains
1. Go to the [Firebase Console](https://console.firebase.google.com/).
2. Select your **ArthikSetu** project.
3. Navigate to **Authentication > Settings > Authorized domains** (under the "User actions" or settings menu).
4. Click **Add domain** and enter your production domains:
   *   Your deployment domain: `<your-project-name>.vercel.app`
   *   Your custom domain (if any): `arthiksetu.in`
   *   *Note: Do not include `https://` or path prefixes.*

### Step 2: Validate OAuth Redirect Configuration
Firebase Google Sign-In relies on popup redirects. By whitelisting the Vercel domains above, Firebase's OAuth handler will automatically authorize requests coming from your live web app.

---

## 4. Backend CORS Configuration (Render)

For the frontend to successfully send requests to the FastAPI backend, the backend must authorize the frontend domain.

1. In your **Render Dashboard** for the FastAPI service, go to **Environment**.
2. Add or update the `ALLOWED_ORIGINS` variable:
   *   `ALLOWED_ORIGINS=https://your-project.vercel.app,https://your-custom-domain.com`
   *   *Note: Multiple domains should be comma-separated with NO spaces.*

---

## 5. Step-by-Step GitHub Integration

### Initial Deployment
1. Log in to the [Vercel Dashboard](https://vercel.com).
2. Click **Add New > Project**.
3. Select your GitHub repository.
4. Expand **Build and Development Settings**:
   *   Toggle the **Root Directory** field, click **Edit**, and select the `Frontend` folder.
   *   Verify that the preset switches to **Vite**.
5. Expand **Environment Variables** and enter the keys and values from Section 2.
6. Click **Deploy**.

### Future Updates (Continuous Integration)
Vercel sets up automatic Git hooks:
*   **Production Deployments**: Every push to your `main` or `master` branch automatically triggers a production build and deployment.
*   **Preview Deployments**: Every push to a non-main branch (e.g., a feature branch or Pull Request) automatically builds a temporary "preview" link so you can test features before merging.

---

## 6. How to Add a Custom Domain Later

1. In the Vercel project dashboard, go to **Settings > Domains**.
2. Type your domain name (e.g., `arthiksetu.in`) and click **Add**.
3. Vercel will show the required DNS records (e.g., `CNAME` or `A` record).
4. Go to your domain registrar (Namecheap, GoDaddy, Cloudflare, etc.) and add the DNS records specified by Vercel.
5. Once DNS propagates (usually takes 5–30 minutes), Vercel will automatically provision a free SSL certificate.
6. Remember to add your new custom domain to the **Firebase Authorized Domains** list (Section 3).

---

## 7. Production Troubleshooting & Stability Checklist

*   **Blank Screen on Startup**: The frontend has dynamic safeguards in `src/firebase.ts`. If environment variables are missing, the console prints a clear warning instead of crashing the site. Check your browser's console (`F12`) to verify if Firebase initialization variables are missing.
*   **404 on Page Refresh (SPA Routing)**: Vite handles routing inside the browser (client-side). When a user reloads `vercel.app/profile`, Vercel looks for a physical `profile/index.html` file and fails. This is resolved by the `vercel.json` we added inside the `Frontend` folder, which rewrites all traffic to `/index.html`.
*   **Chunk Loading Failure**: If you deploy a new version while a user is browsing, their browser might try to fetch old, deleted chunk files. Our `vite.config.ts` uses Rollup code-splitting to separate Firebase, Charts, Icons, and PDF packages, reducing the chance of large chunk load failures and optimizing load speeds.
*   **Auth Persistence Issues**: Firebase stores login states in `IndexedDB`/`LocalStorage` under the hood. Since the app checks `onAuthStateChanged` on load, your session is automatically persisted. No additional setup is required.
