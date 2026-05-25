# Render Production Deployment Guide: ArthikSetu FastAPI Backend

This guide walks you through deploying the **ArthikSetu** FastAPI backend on Render, configuring environment variables (CORS, Gemini, Firebase), and linking it to your Vercel frontend.

---

## 1. Render Blueprint Configuration (`render.yaml`)

We have pre-configured a [render.yaml](file:///d:/Arthiksetu/render.yaml) file in the root of the project. Render automatically detects this Blueprint file and imports your services with the following specifications:

| Setting | Value | Description |
| :--- | :--- | :--- |
| **Service Type** | `Web Service` | Standard Python web service. |
| **Name** | `arthiksetu-backend` | Name of the web service. |
| **Environment** | `Python` | Python runtime environment. |
| **Root Directory** | `Backend` | Pointing Render to run actions from the `Backend` directory. |
| **Build Command** | `pip install -r requirements.txt` | Installs pinned backend dependencies. |
| **Start Command** | `uvicorn main:app --host 0.0.0.0 --port $PORT` | Starts the server on Render's dynamic port. |

---

## 2. Environment Variables Configuration

In the Render dashboard under your service's **Environment** tab (or specified during initial Blueprint import), set these variables:

| Variable Name | Value Example | Description |
| :--- | :--- | :--- |
| `PYTHON_VERSION` | `3.10.0` | Forces Render to use Python 3.10. |
| `GEMINI_API_KEY` | `AIzaSy...` | Your Google Gemini API key. Supports rotation with comma-separated keys. |
| `ALLOWED_ORIGINS` | `https://your-frontend.vercel.app` | Comma-separated list of frontends allowed to query the API. Use `*` only for temporary testing. |

---

## 3. Dynamic CORS & Wildcard Handling

To prevent FastAPI from crashing at startup when using wildcard configurations, our backend has dynamic CORS handling built-in:
*   If `ALLOWED_ORIGINS` contains `*` (wildcard), it automatically sets `allow_credentials=False` to comply with the standard browser CORS specification (browsers block requests if credentials are enabled with `*`).
*   For specific whitelisted domains (e.g., your Vercel deployment domain), it enables `allow_credentials=True` for secure cross-origin resource sharing.

---

## 4. Connecting Vercel Frontend and Render Backend

### Step 1: Frontend Configuration (Vercel)
In your Vercel project's environment settings, set the `VITE_API_URL` to point to your new Render deployment:
*   **Key**: `VITE_API_URL`
*   **Value**: `https://arthiksetu-backend.onrender.com` (use your actual Render subdomain URL, with no trailing slash).

### Step 2: Backend CORS Configuration (Render)
In your Render backend environment variables, whitelist your frontend Vercel URL:
*   **Key**: `ALLOWED_ORIGINS`
*   **Value**: `https://arthiksetu-frontend-xxx.vercel.app` (replace with your Vercel production and/or staging domains, separated by commas).

---

## 5. Security & Production-Grade Features

*   **No Unsafe Debug Output**: All logs are configured through Python's standard `logging` library. Sensitive transaction payloads are never dumped in plaintext.
*   **Upload Restrictions**: File upload endpoints in [main.py](file:///d:/Arthiksetu/Backend/main.py) restrict accepted formats to safe MIME types (`image/jpeg`, `image/png`, `image/webp`, `application/pdf`) and enforce a strict **10MB upload limit** to protect the server from Denial-of-Service (DoS) memory overload.
*   **Sensitive Data Masking**: Extracted document IDs or transaction tokens are masked in response payloads (e.g. returning `XXXX XXXX 1234` instead of full values) to comply with data minimization principles.

---

## 6. How to Deploy on Render

### Deploying via Render Blueprints (Recommended)
1. Go to the [Render Dashboard](https://dashboard.render.com).
2. Click **New +** > **Blueprint**.
3. Select your GitHub repository.
4. Render will parse the `render.yaml` file and prepare the configurations.
5. In the prompts, supply your custom `GEMINI_API_KEY` and the `ALLOWED_ORIGINS` pointing to your Vercel domain.
6. Click **Approve** to deploy.

### Deploying Manually as a Web Service
If you do not want to use Blueprints:
1. Click **New +** > **Web Service**.
2. Connect your GitHub repository.
3. Configure the following settings:
   *   **Name**: `arthiksetu-backend`
   *   **Root Directory**: `Backend`
   *   **Runtime**: `Python`
   *   **Build Command**: `pip install -r requirements.txt`
   *   **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
4. Expand **Advanced Settings**:
   *   Add environment variables listed in Section 2.
5. Click **Create Web Service**.

---

## 7. Firebase Admin Integration (Optional Future Setup)

Currently, the backend extracts the user's email directly from the `x-user-email` custom header for demo simplicity. If you want to enable secure JWT verification in production:
1. Add your Firebase Service Account JSON key to the environment variables:
   *   **Key**: `FIREBASE_CONFIG`
   *   **Value**: Paste the raw JSON string of your Firebase Service Account private key file.
2. Initialize Firebase Admin in `main.py` using:
   ```python
   import firebase_admin
   from firebase_admin import credentials
   
   if not firebase_admin._apps:
       cred = credentials.Certificate(json.loads(os.getenv("FIREBASE_CONFIG")))
       firebase_admin.initialize_app(cred)
   ```
3. Add a middleware or dependency injection in FastAPI to decode the client's Bearer Authorization Token using `firebase_admin.auth.verify_id_token(token)`.

---

## 8. Continuous Deployment & Redeploys

Render integrates directly with your GitHub repository:
*   **Automatic Deployments**: Any commit pushed or merged into your `main` or `master` branch will trigger an automatic rebuilding and redeployment of the web service.
*   **Manual Redeploy**: You can manually trigger a build in the Render dashboard by selecting your service and clicking **Manual Deploy** > **Clear Cache & Deploy** at the top right.
