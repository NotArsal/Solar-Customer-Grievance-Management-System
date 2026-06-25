# Production Pre-Launch Checklist

This checklist acts as a final gate before the Customer Grievance Management System (CGMS) is deployed to production on Vercel (Frontend) and Render (Backend).

## 1. Environment & Secrets Setup
Ensure the following variables are strictly configured in the **Render Dashboard Environment** settings. Do not commit these values to source control.
- [ ] `NODE_ENV` set to `production`
- [ ] `CLIENT_URL` set to `https://industryproject-frontend.vercel.app` (This enforces exact CORS constraints).
- [ ] `MONGO_URI` set to the production MongoDB Atlas connection string.
- [ ] `JWT_SECRET` rotated to a secure 64-character random string for production.
- [ ] `TELEGRAM_BOT_TOKEN` set with a real bot token, not a dummy token.

On the **Vercel Dashboard Environment** settings:
- [ ] `VITE_API_URL` set to `https://industryproject-backend.onrender.com`

## 2. Infrastructure & Hosting Configuration
- [ ] Verify that `client/vercel.json` contains rewrites if necessary for client-side routing. Since Vercel automatically handles standard Vite SPAs, ensure standard build output points to `dist`.
- [ ] Verify Render uses the Start Command: `npm start` (which runs `node --env-file=.env src/server.js`) inside the `server/` directory.

## 3. Database & Connectivity
- [ ] The production MongoDB database users have restricted permissions (least-privilege model).
- [ ] IP Whitelisting in MongoDB Atlas is configured to accept connections from Render's outbound IPs (or `0.0.0.0/0` if necessary, but secured with strong credentials).
- [ ] Initial Database seed (`npm run seed`) has been verified and contains standard routing categories and at least one super-admin.

## 4. Security Validations
- [ ] Rate limits are active on endpoints such as `/v1/auth/login` and `/v1/auth/verify-otp`.
- [ ] Security Headers via `helmet()` are successfully being passed to the client.
- [ ] Strict CORS policy is enforcing `https://industryproject-frontend.vercel.app`.

## 5. Rollback Strategy
### Frontend (Vercel)
Vercel offers instant rollbacks from the deployment dashboard.
- [ ] If the frontend introduces a breaking bug, navigate to Vercel -> Deployments -> find the previous stable deployment -> Click "Promote to Production". Time to rollback: < 1 minute.

### Backend (Render)
Render allows manual deployment of previous commits.
- [ ] If the backend fails, navigate to Render -> Dashboard -> Events -> select a previous successful deploy and click "Rollback to this deploy". Time to rollback: < 2 minutes.

## 6. Post-Launch Verification
Within the first 15 minutes of launch, the responsible engineer must:
1. Verify the frontend loads on `https://industryproject-frontend.vercel.app`.
2. Verify the backend health endpoint `https://industryproject-backend.onrender.com/health` returns HTTP 200 OK.
3. Test a dummy customer ticket submission to ensure the pipeline, including database persistence and Telegram notification, functions correctly.
4. Ensure no unresolved console errors or failed network requests exist in the browser DevTools.
