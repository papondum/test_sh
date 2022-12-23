This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

For demo https://checkin-8a7cd.firebaseapp.com/

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

# still unstable version

    !! Have to keep refresh while map not loaded !!

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

# Prerequisite

- firebase account, google account
- api keys,
- firebase keys config
- node version 17+

# Navigation

- / for home checkin
- /history for history of checkin
- /setting for setting markers

# Library & Technologies

- Firebase, storage (store img), realtimedb (store markers, user radius, history checkin)
- tailwindcss for theme ui

# Rooms of improve

- handle api error each request
- responsive for mobile
- UI
- performance map on load
- coding arrage directory
- eslint, prettier (set more rules)
- (can use scipt auto deploy, unit test)
- ENV key
