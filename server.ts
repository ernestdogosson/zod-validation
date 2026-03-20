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
    })
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

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
