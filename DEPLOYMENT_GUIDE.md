# Vercel Deployment Configuration

## Option 1: Deploy Frontend Only (Recommended)

1. **Go to [Vercel.com](https://vercel.com)**
2. **Sign in with GitHub**
3. **Import your repository**
4. **Configure the deployment:**
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`
   - **Install Command**: `npm install`

## Option 2: Deploy from Root Directory

If you want to deploy from the root directory, use the `vercel.json` configuration that's already set up.

## Current Configuration

The project has two `vercel.json` files:
- Root `vercel.json`: For deploying the entire project
- `frontend/vercel.json`: For deploying just the frontend

## Deployment Steps

1. **Push all changes to GitHub**
2. **Go to Vercel dashboard**
3. **Click "New Project"**
4. **Select your AgriGuru repository**
5. **Choose deployment option:**
   - **Option A**: Set root directory to `frontend`
   - **Option B**: Use root directory with existing config

## Troubleshooting

If the frontend is not showing as directories:
- Make sure the `frontend` folder is committed to Git
- Check that `package.json` exists in the frontend folder
- Verify the build command works locally

## Files Created

- `vercel.json` (root): Configuration for full project deployment
- `frontend/vercel.json`: Configuration for frontend-only deployment
- `frontend/public/_redirects`: SPA routing configuration
