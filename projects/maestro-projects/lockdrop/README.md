# LockDrop

Pay-to-unlock file delivery for freelancers.

## Stack
- Frontend: Next.js 14 → Vercel (lockdrop.co)
- Backend: Node.js Express → Railway (lockdrop-api-production.up.railway.app)
- Database: Postgres → Railway
- Payments: Stripe
- Email: SendGrid

## Local development

### Backend
```bash
cd backend
npm install
cp .env.example .env
# fill in .env
node index.js
```

### Frontend
```bash
cd frontend
npm install
NEXT_PUBLIC_API_URL=http://localhost:3001 npm run dev
```

## Deploy
- Backend: Railway (connected to this repo at lockdrop/backend)
- Frontend: Vercel (connected to this repo at lockdrop/frontend)
