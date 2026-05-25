# ArthikSetu — Production Deployment Checklist & Guide

This document provides a comprehensive checklist and instructions for deploying the **ArthikSetu** platform into production. It covers the frontend (Vercel/Netlify), the backend (Render/Railway), Firebase Console settings, required environment variables, production testing procedures, and troubleshooting guides for common deployment issues.

---

## 1. Frontend Deployment Guide (Vercel / Netlify)

The React frontend is built using **Vite 6** and compiles to optimized static assets in the `Frontend/dist/` directory.

### Quick Deployment Steps (Vercel)
1. Install Vercel CLI globally or use the Vercel Dashboard:
   ```bash
   npm install -g vercel
   vercel login
   ```
2. Run the deployment command from the repository root:
   ```bash
   vercel
   ```
3. Set the project root directory to `Frontend` when prompted.
4. Configure the build settings in Vercel:
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
5. Configure the environment variables (see [Environment Variables](#3-environment-variables-configuration) section).
6. Deploy to production:
   ```bash
   vercel --prod
   ```

### Client-Side Routing Configurations
Because this React application uses client-side routing, page refreshes on sub-routes (e.g. `/unified-dashboard`, `/privacy-dashboard`) will trigger HTTP 404 errors on static hosts unless redirects are configured.

#### For Vercel:
Add a `vercel.json` file inside `Frontend/` folder:
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

#### For Netlify:
Add a `_redirects` file inside the `Frontend/public/` folder:
```text
/*   /index.html   200
```

---

## 2. Backend Deployment Guide (Render / Railway)

The backend is built with **FastAPI** and served using **Uvicorn** asynchronously.

### Deployment Configuration (`render.yaml`)
A `render.yaml` template is already included in the project root:
- It runs `pip install -r Backend/requirements.txt` to install FastAPI, pydantic, numpy, Pillow, and google-generativeai.
- It boots the server via: `cd Backend && uvicorn main:app --host 0.0.0.0 --port $PORT`
- It passes the `GEMINI_API_KEY` to the service environment.

### Manual Render Setup:
1. Connect your Github repository to the Render Dashboard.
2. Select **Web Service**.
3. Set the following options:
   - **Environment:** `Python 3`
   - **Build Command:** `pip install -r Backend/requirements.txt`
   - **Start Command:** `cd Backend && uvicorn main:app --host 0.0.0.0 --port $PORT`
4. Add the required environment variables (see [Environment Variables](#3-environment-variables-configuration)).

---

## 3. Environment Variables Configuration

Ensure the following variables are configured in your production hosting dashboards. Do **NOT** commit actual values to Github.

### Backend Environment Variables (`Backend/` hosting platform)

| Variable Name | Purpose | Example / Required Format |
|---|---|---|
| `GEMINI_API_KEY` | Google Gemini API Authentication Key(s). | `AIzaSy...` (Support for key rotation: provide multiple comma-separated keys, e.g., `key1,key2,key3`). |
| `ALLOWED_ORIGINS` | Comma-separated list of allowed CORS domains. | `https://arthiksetu.vercel.app,https://arthiksetu.netlify.app` |

*Note: If `ALLOWED_ORIGINS` is not defined in the backend environment, it will fallback to local development hosts (`localhost:5173`, `localhost:3000`), blocking cross-origin production requests.*

### Frontend Environment Variables (`Frontend/` hosting platform)

All Vite environment variables **must** be prefixed with `VITE_` to be compiled into the static client build.

| Variable Name | Purpose | Required Format |
|---|---|---|
| `VITE_API_URL` | The production URL of your FastAPI backend. | `https://arthiksetu-backend.onrender.com` (Do **not** include a trailing slash). |
| `VITE_FIREBASE_API_KEY` | Public Firebase Web API Key. | `AIzaSyCL...` |
| `VITE_FIREBASE_AUTH_DOMAIN` | Firebase Authentication Domain. | `arthiksetu-2bcbd.firebaseapp.com` |
| `VITE_FIREBASE_PROJECT_ID` | Firebase Project identifier. | `arthiksetu-2bcbd` |
| `VITE_FIREBASE_STORAGE_BUCKET` | Firebase Storage Endpoint bucket. | `arthiksetu-2bcbd.firebasestorage.app` |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Firebase Messaging sender ID. | `275358318408` |
| `VITE_FIREBASE_APP_ID` | Web application ID key. | `1:275358318408:web:597b6d7c40f...` |

---

## 4. Firebase Console Configuration

To ensure Firebase Authentication functions properly in production, update the settings in your Firebase Console:

1. **Authorized Domains:**
   - Go to **Firebase Console** > **Authentication** > **Settings** > **Authorized Domains**.
   - Add your production frontend domain (e.g. `arthiksetu.vercel.app`).
   - If this is not done, the Google Sign-in popup will throw a `cors/unauthorized-domain` error and fail.
2. **Google OAuth Branding:**
   - Go to **Google Cloud Console** > **APIs & Services** > **OAuth Consent Screen**.
   - Make sure your project developer contact email is configured correctly, and the status is published.

---

## 5. Production Testing & Verification Steps

Once both backend and frontend deployments are live, run the following verification pipeline:

### 1. Verification of Route Protection (Auth Guard)
- Open an incognito browser window.
- Attempt to navigate directly to: `https://your-frontend.vercel.app/unified-dashboard`.
- **Expected Behavior:** You must be instantly blocked and redirected back to the `AuthPage` login screen. The dashboard page must not load.

### 2. Verify Google Login Flow
- Click **"Continue with Google"** on the login screen.
- **Expected Behavior:** The Google Auth popup should open, verify credentials, and log in successfully. The dashboard should render showing user-specific profile letters in the navigation header.

### 3. Verify Live Cross-Origin API Connections
- Paste the following example SMS in the **SMS Analyzer** page:
  `Your UPI transaction to Swiggy for Rs.450 is successful`
- Click **"Analyze Messages"**.
- **Expected Behavior:** The app should show a spinner, communicate with your Render FastAPI endpoint, and return the analyzed transaction showing "Swiggy" and "₹450" as a parsed credit.
- Verify the **Dashboard charts** update.

### 4. Verify AI Vision OCR Processing
- Go to the **Document Verification** tab.
- Select `PAN` or `Aadhaar`, upload a document sample, and click **"Verify"**.
- **Expected Behavior:** The live pipeline statuses should tick in real-time. The final output must mask the ID (e.g. `XXXXX 1234F`), show a confidence score, and state that the raw image was deleted from RAM.

---

## 6. Common Deployment Issues & Troubleshooting

### Issue 1: Google Sign-in Popup Instantly Closes / Fails
- **Cause:** Your production domain is not whitelisted in the Firebase Console.
- **Fix:** Add your frontend hosting domain to **Firebase Console** > **Authentication** > **Settings** > **Authorized Domains**.

### Issue 2: API Calls Fail with "CORS Error" or Pre-flight Options Failure
- **Cause:** The backend does not have your frontend deployment URL in its `ALLOWED_ORIGINS` variable.
- **Fix:** Update the `ALLOWED_ORIGINS` environment variable in your backend (e.g. Render Dashboard) with your exact frontend URL (comma-separated, no trailing slash). Restart the service.

### Issue 3: "Failed to initialize Firebase" Console Warnings
- **Cause:** Vite environment variables are missing or misconfigured in the frontend environment.
- **Fix:** Ensure all variables are prefixed with `VITE_` (e.g. `VITE_FIREBASE_API_KEY`) and are correctly copied from the Firebase web SDK config.

### Issue 4: FastAPI Document Verify returns HTTP 500
- **Cause:** Missing or expired `GEMINI_API_KEY` on the backend.
- **Fix:** Verify the `GEMINI_API_KEY` env var is present and valid. Check Render logs to verify if key rotation occurred.
