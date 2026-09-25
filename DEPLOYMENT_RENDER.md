# Deploying dMAT Exam Preparation Platform on Render

This guide provides step-by-step instructions to deploy the dMAT Preparation Web Application to [Render](https://render.com).

The application is pre-configured with:
- **Production Express Server (`server/prodServer.js`)**: Serves the optimized React client build with SPA fallback for React Router and provides zero-downtime health checking (`/health`).
- **Secure Server-side AI Proxy (`/api/ai/chat`)**: Protects your Omni Route API key on the backend with SSE streaming.
- **SPA Redirection Rules (`public/_redirects`)**: Guarantees seamless client-side routing on page refreshes.
- **Render Blueprint (`render.yaml`)**: One-click configuration file ready for Render Blueprint deployments.

---

## Option 1: Render Web Service (Recommended — Full App + AI Assistant)

This is the recommended deployment method because it runs both the React app and the server-side AI Assistant proxy.

### Step 1: Push Code to GitHub / GitLab
In your terminal, initialize and push your repository:

```bash
# Navigate to the project root
cd f:\Study\dMAT

# Initialize git if not already initialized
git init

# Stage all files and commit
git add .
git commit -m "Production-ready dMAT Exam Preparation Platform"

# Link to your GitHub repository and push
git branch -M main
git remote add origin https://github.com/<YOUR_GITHUB_USERNAME>/<YOUR_REPO_NAME>.git
git push -u origin main
```

---

### Step 2: Deploy on Render

1. Log into your [Render Dashboard](https://dashboard.render.com).
2. Click **New +** and select **Web Service**.
3. Choose **Build and deploy from a Git repository** and connect your repository.
4. Configure the service settings:

| Setting | Value | Notes |
| :--- | :--- | :--- |
| **Name** | `dmat-prep-app` | Or any name of your choice |
| **Region** | `Frankfurt (EU)` or `Oregon (US)` | Choose closest to your users |
| **Branch** | `main` | |
| **Root Directory** | `dmat-app` | If you committed the whole `dMAT` folder |
| **Environment** | `Node` | |
| **Build Command** | `npm install && npm run build` | Builds frontend and installs Express |
| **Start Command** | `npm start` | Runs `node server/prodServer.js` |
| **Instance Type** | `Free` | |

5. Expand **Advanced** and set:
   - **Health Check Path**: `/health`

6. Under **Environment Variables**, add:

| Key | Value |
| :--- | :--- |
| `NODE_ENV` | `production` |
| `OMNIROUTE_API_KEY` | `sk-9641a182d5f0eb99-ed3723-298733d4` *(or your custom key)* |
| `OMNIROUTE_BASE_URL` | `http://127.0.0.1:20128/v1` *(or your deployed OmniRoute endpoint)* |
| `OMNIROUTE_MODEL` | `auto/chat` |

7. Click **Create Web Service**.

Render will install dependencies, build the Vite production bundle, launch the Express server, and provide you with a live URL (e.g. `https://dmat-prep-app.onrender.com`).

---

## Option 2: Render Blueprint (One-Click Auto-Deploy)

Both `render.yaml` files have been prepared:
1. In Render Dashboard, click **New +** → **Blueprint**.
2. Connect your repository.
3. Render will read `render.yaml` and configure the build command, start command, health checks, and environment variables automatically.
4. Click **Apply**.

---

## Option 3: Render Static Site (Frontend Only)

If you only want to host the frontend static files on Render's free static CDN:

1. Click **New +** → **Static Site**.
2. Connect your repository.
3. Configure:
   - **Root Directory**: `dmat-app`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
4. The included `_redirects` file in `public/` will automatically ensure React Router works without 404s when navigating directly to `/learning/...` or `/simulation`.

---

## Production Verification Checklist
Once your deployment finishes on Render:
- [ ] Visit the root URL: `https://<your-app>.onrender.com`
- [ ] Navigate directly to subtopic URL: `https://<your-app>.onrender.com/learning/figure-sequences/fs-position-tracking`
- [ ] Click the floating AI Assistant Orb (bottom-right) and send a prompt (e.g., *"How do I track figure positions?"*).
- [ ] Verify health status: `https://<your-app>.onrender.com/health` returns `{"status":"ok"}`.
