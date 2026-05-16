import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const db = new Database("barbearia.db");

// Initialize Database
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE,
    password TEXT
  );

  CREATE TABLE IF NOT EXISTS clients (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    phone TEXT UNIQUE,
    visits INTEGER DEFAULT 0,
    last_visit DATETIME
  );

  CREATE TABLE IF NOT EXISTS barbers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    photo TEXT,
    specialty TEXT
  );

  CREATE TABLE IF NOT EXISTS services (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    price REAL,
    duration INTEGER
  );

  CREATE TABLE IF NOT EXISTS appointments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    client_id INTEGER,
    barber_id INTEGER,
    service_id INTEGER,
    date TEXT,
    time TEXT,
    status TEXT DEFAULT 'Agendado',
    FOREIGN KEY(client_id) REFERENCES clients(id),
    FOREIGN KEY(barber_id) REFERENCES barbers(id),
    FOREIGN KEY(service_id) REFERENCES services(id)
  );
`);

// Seed Admin User if not exists
const adminEmail = "admin@barbearia.com";
const user = db.prepare("SELECT * FROM users WHERE email = ?").get(adminEmail);
if (!user) {
  const hashedPassword = bcrypt.hashSync("admin123", 10);
  db.prepare("INSERT INTO users (email, password) VALUES (?, ?)").run(adminEmail, hashedPassword);
}

// Seed some services if empty
const servicesCount = (db.prepare("SELECT COUNT(*) as count FROM services").get() as any).count;
if (servicesCount === 0) {
  const defaultServices = [
    ["Corte Masculino", 40.00, 30],
    ["Barba", 30.00, 20],
    ["Corte + Barba", 60.00, 50],
    ["Sobrancelha", 15.00, 10],
    ["Pigmentação", 45.00, 40],
    ["Pezinho", 10.00, 10],
    ["Hidratação", 25.00, 15]
  ];
  const stmt = db.prepare("INSERT INTO services (name, price, duration) VALUES (?, ?, ?)");
  defaultServices.forEach(s => stmt.run(s[0], s[1], s[2]));
}

// Seed some barbers if empty
const barbersCount = (db.prepare("SELECT COUNT(*) as count FROM barbers").get() as any).count;
if (barbersCount === 0) {
  const defaultBarbers = [
    ["Hudson", "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=200", "Master Barber"],
    ["Carlos", "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200", "Cortes Modernos"],
    ["Davi", "https://images.unsplash.com/photo-1633332755192-727a05c4013d?auto=format&fit=crop&q=80&w=200", "Barbas e Relaxamento"]
  ];
  const stmt = db.prepare("INSERT INTO barbers (name, photo, specialty) VALUES (?, ?, ?)");
  defaultBarbers.forEach(b => stmt.run(b[0], b[1], b[2]));
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  const JWT_SECRET = process.env.JWT_SECRET || "hudson-master-key-2024";

  // Auth Middleware
  const authenticateToken = (req: any, res: any, next: any) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.sendStatus(401);

    jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
      if (err) return res.sendStatus(403);
      req.user = user;
      next();
    });
  };

  // --- API ROUTES ---

  // Auth
  app.post("/api/auth/login", (req, res) => {
    const { email, password } = req.body;
    const user = db.prepare("SELECT * FROM users WHERE email = ?").get(email) as any;
    if (user && bcrypt.compareSync(password, user.password)) {
      const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '24h' });
      res.json({ token });
    } else {
      res.status(401).json({ message: "Credenciais inválidas" });
    }
  });

  // Dashboard Stats
  app.get("/api/stats", authenticateToken, (req, res) => {
    const today = new Date().toISOString().split('T')[0];
    const totalClients = (db.prepare("SELECT COUNT(*) as count FROM clients").get() as any).count;
    const totalAppointments = (db.prepare("SELECT COUNT(*) as count FROM appointments").get() as any).count;
    const todayAppointments = (db.prepare("SELECT COUNT(*) as count FROM appointments WHERE date = ?").get(today) as any).count;
    const revenue = (db.prepare(`
      SELECT SUM(s.price) as total 
      FROM appointments a 
      JOIN services s ON a.service_id = s.id 
      WHERE a.status = 'Finalizado'
    `).get() as any).total || 0;

    const topServices = db.prepare(`
      SELECT s.name, COUNT(a.id) as count 
      FROM appointments a 
      JOIN services s ON a.service_id = s.id 
      GROUP BY s.id 
      ORDER BY count DESC 
      LIMIT 5
    `).all();

    res.json({ totalClients, totalAppointments, todayAppointments, revenue, topServices });
  });

  // Appointments
  app.get("/api/appointments", (req, res) => {
    const appointments = db.prepare(`
      SELECT a.*, c.name as clientName, c.phone as clientPhone, b.name as barberName, s.name as serviceName, s.price as price
      FROM appointments a
      JOIN clients c ON a.client_id = c.id
      JOIN barbers b ON a.barber_id = b.id
      JOIN services s ON a.service_id = s.id
      ORDER BY a.date DESC, a.time ASC
    `).all();
    res.json(appointments);
  });

  app.post("/api/appointments", (req, res) => {
    const { clientName, clientPhone, barberId, serviceId, date, time } = req.body;

    // Check availability
    const conflict = db.prepare("SELECT * FROM appointments WHERE barber_id = ? AND date = ? AND time = ? AND status != 'Cancelado'").get(barberId, date, time);
    if (conflict) {
      return res.status(400).json({ message: "Horário já ocupado por este barbeiro" });
    }

    // Find or create client
    let client = db.prepare("SELECT * FROM clients WHERE phone = ?").get(clientPhone) as any;
    if (!client) {
      const info = db.prepare("INSERT INTO clients (name, phone) VALUES (?, ?)").run(clientName, clientPhone);
      client = { id: info.lastInsertRowid };
    }

    // Insert appointment
    db.prepare("INSERT INTO appointments (client_id, barber_id, service_id, date, time) VALUES (?, ?, ?, ?, ?)").run(client.id, barberId, serviceId, date, time);
    
    // Update client stats
    db.prepare("UPDATE clients SET visits = visits + 1, last_visit = ? WHERE id = ?").run(new Date().toISOString(), client.id);

    res.status(201).json({ message: "Agendamento realizado com sucesso!" });
  });

  app.patch("/api/appointments/:id", authenticateToken, (req, res) => {
    const { status } = req.body;
    db.prepare("UPDATE appointments SET status = ? WHERE id = ?").run(status, req.params.id);
    res.json({ message: "Status atualizado" });
  });

  // Clients
  app.get("/api/clients", authenticateToken, (req, res) => {
    const clients = db.prepare("SELECT * FROM clients ORDER BY visits DESC").all();
    res.json(clients);
  });

  // Barbers
  app.get("/api/barbers", (req, res) => {
    const barbers = db.prepare("SELECT * FROM barbers").all();
    res.json(barbers);
  });

  // Services
  app.get("/api/services", (req, res) => {
    const services = db.prepare("SELECT * FROM services").all();
    res.json(services);
  });


  // --- VITE / STATIC SERVING ---

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
