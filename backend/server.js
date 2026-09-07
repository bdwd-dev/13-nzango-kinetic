const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

const DB_PATH = path.join(__dirname, 'db.json');

function loadDB() {
  try { return JSON.parse(fs.readFileSync(DB_PATH, 'utf8')); }
  catch { return { players: [], tournaments: [], matches: [], transactions: [] }; }
}

function saveDB(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'nzango-kinetic', version: '1.0.0' });
});

// Stats
app.get('/api/stats', (req, res) => {
  const db = loadDB();
  res.json({
    players: db.players.length,
    tournaments: db.tournaments.length,
    matches: db.matches.length,
    transactions: db.transactions.length
  });
});

// Players
app.get('/api/players', (req, res) => {
  const db = loadDB();
  res.json(db.players);
});

app.post('/api/players', (req, res) => {
  const db = loadDB();
  const player = { id: Date.now(), ...req.body, points: 0, wins: 0, losses: 0, created_at: new Date().toISOString() };
  db.players.push(player);
  saveDB(db);
  res.json(player);
});

// Tournaments
app.get('/api/tournaments', (req, res) => {
  const db = loadDB();
  res.json(db.tournaments);
});

app.post('/api/tournaments', (req, res) => {
  const db = loadDB();
  const tournament = { id: Date.now(), ...req.body, status: 'open', participants: [], created_at: new Date().toISOString() };
  db.tournaments.push(tournament);
  saveDB(db);
  res.json(tournament);
});

// Join tournament
app.post('/api/tournaments/:id/join', (req, res) => {
  const db = loadDB();
  const tournament = db.tournaments.find(t => t.id == req.params.id);
  if (!tournament) return res.status(404).json({ error: 'Tournoi non trouvé' });
  const { player_id, player_name } = req.body;
  if (!tournament.participants.find(p => p.player_id == player_id)) {
    tournament.participants.push({ player_id, player_name, joined_at: new Date().toISOString() });
  }
  saveDB(db);
  res.json(tournament);
});

// Matches
app.get('/api/matches', (req, res) => {
  const db = loadDB();
  res.json(db.matches);
});

app.post('/api/matches', (req, res) => {
  const db = loadDB();
  const match = { id: Date.now(), ...req.body, status: 'completed', created_at: new Date().toISOString() };
  db.matches.push(match);
  saveDB(db);
  res.json(match);
});

// Payment (Mobile Money entry fee)
app.post('/api/pay', (req, res) => {
  const db = loadDB();
  const { player_id, tournament_id, amount } = req.body;
  const tx = {
    id: Date.now(),
    type: 'entry_fee',
    player_id,
    tournament_id,
    amount,
    provider: 'MTN',
    status: 'success',
    reference: 'NZ' + Date.now(),
    timestamp: new Date().toISOString()
  };
  db.transactions.push(tx);
  saveDB(db);
  res.json({ success: true, transaction: tx, message: `Paiement ${amount} XAF validé` });
});

const PORT = process.env.PORT || 3013;
app.listen(PORT, () => {
  console.log(`╔═══════════════════════════════════════════════╗`);
  console.log(`║  ⚡ NZANGO KINETIC — E-Sport               ║`);
  console.log(`║  Port: ${PORT}                                  ║`);
  console.log(`║  API: http://localhost:${PORT}/api            ║`);
  console.log(`╚═══════════════════════════════════════════════╝`);
});
