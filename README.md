# NZANGO KINETIC

E-sport — Jeu de Nzango, tournois Mobile Money

**Organisation :** Nzango Kinetic

## Structure

```
13-nzango-kinetic/
├── backend/          # Express.js API (Port 3013)
│   ├── server.js
│   ├── package.json
│   └── db.json
├── web/              # React frontend (HTML + Babel standalone)
│   └── index.html
└── mobile/           # Flutter app
    └── lib/main.dart
```

## Démarrage

```bash
# Backend
cd 13-nzango-kinetic/backend
npm install
npm start

# Web — Ouvrir 13-nzango-kinetic/web/index.html dans un navigateur
# ou servir avec: npx serve 13-nzango-kinetic/web

# Mobile
cd 13-nzango-kinetic/mobile
flutter pub get
flutter run
```

## API

| Endpoint | Description |
|----------|-------------|
| GET /api/health | Health check |
| GET /api/stats | Statistiques |
