# Business Partner AI

Production-ready AI SaaS starter for business analysis, finance tracking, collections, recovery planning, subscriptions, and admin operations.

## Stack

- React + TypeScript + Vite
- Tailwind CSS
- Firebase Authentication, Firestore, Hosting, Cloud Functions
- OpenAI Responses API through Firebase Functions
- PWA support
- Dark/light mode
- Responsive dashboard UX

## Local Setup

1. Install dependencies:

```bash
npm install
npm --prefix functions install
```

2. Copy `.env.example` to `.env` and add Firebase web app values.

Firebase environment variables are read from [src/config/firebaseConfig.ts](/Users/apple/Documents/Codex/2026-05-30/build-a-complete-production-ready-ai/src/config/firebaseConfig.ts). Vite only exposes variables prefixed with `VITE_`, so use exactly these names:

```bash
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=000000000000
VITE_FIREBASE_APP_ID=1:000000000000:web:example
VITE_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
VITE_RAZORPAY_KEY_ID=rzp_test_or_live_key_id
```

For Google Sign-In, enable **Authentication > Sign-in method > Google** in Firebase Console and add your local/production domains in **Authentication > Settings > Authorized domains**. For local development, include `localhost` and `127.0.0.1`.

3. Start the app:

```bash
npm run dev
```

4. Use demo AI without a backend by keeping:

```bash
VITE_USE_DEMO_AI=true
```

## Firebase + OpenAI

Set the OpenAI key as a Firebase Functions secret:

```bash
firebase functions:secrets:set OPENAI_API_KEY
firebase functions:secrets:set RAZORPAY_KEY_ID
firebase functions:secrets:set RAZORPAY_KEY_SECRET
```

Deploy:

```bash
npm run deploy
```

## Production Notes

- Do not expose `OPENAI_API_KEY` in the frontend.
- Do not rename Firebase variables without updating `src/config/firebaseConfig.ts`.
- Use Firebase custom claims for admin access.
- Update Firestore indexes after changing dashboard queries.
- Add Stripe or a billing provider before charging real subscriptions.
- Review `firestore.rules` against your final data model before launch.
