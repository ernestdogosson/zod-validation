import express from "express";
import { z } from "zod";

const app = express();
app.use(express.json());

const PORT = 3000;

// GET ping
app.get("/ping", (req, res) => {
  res.json({ message: "pong" });
});

const randomUserSchema = z.object({
  results: z.array(
    z.object({
      name: z.object({
        first: z.string(),
        last: z.string(),
      }),
      location: z.object({
        country: z.string(),
      }),
    }),
  ),
});

// GET random user
app.get("/random-person", async (_req, res) => {
  const response = await fetch("https://randomuser.me/api/");
  const data = await response.json();

  const result = randomUserSchema.safeParse(data);
  if (!result.success) {
    res.status(502).json({ error: "Unexpected response from randomuser.me" });
    return;
  }

  const person = result.data.results[0];
  if (!person) {
    res.status(502).json({ error: "No results returned" });
    return;
  }
  res.json({
    name: `${person.name.first} ${person.name.last}`,
    country: person.location.country,
  });
});

const randomLoginSchema = z.object({
  results: z.array(
    z.object({
      login: z.object({
        username: z.string(),
      }),
      registered: z.object({
        date: z.string(),
      }),
    }),
  ),
});

// GET random login
app.get("/random-login", async (_req, res) => {
  const response = await fetch("https://randomuser.me/api/");
  const data = await response.json();

  const result = randomLoginSchema.safeParse(data);
  if (!result.success) {
    res.status(502).json({ error: "Unexpected response from randomuser.me" });
    return;
  }

  const person = result.data.results[0];
  if (!person) {
    res.status(502).json({ error: "No results returned" });
    return;
  }

  const username = person.login.username;
  const registeredDate = person.registered.date.slice(0, 10);

  res.json({
    username,
    registeredDate,
    summary: `${username} (registered on ${registeredDate})`,
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// POST /users
const userSchema = z.object({
  name: z.string().min(3).max(12),
  age: z.number().min(18).max(100).optional().default(28),
  email: z.string().regex(/^[\w.-]+@[\w.-]+\.\w+$/).toLowerCase(),
});

app.post("/users", (req, res) => {
  const result = userSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ error: result.error.issues });
    return;
  }
  res.status(201).json(result.data);
});
