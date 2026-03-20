import express from "express";
import { z } from "zod";

const app = express();
app.use(express.json());

const PORT = 3000;

// GET ping
app.get("/ping", (req, res) => {
  res.json({ message: "pong" });
});
