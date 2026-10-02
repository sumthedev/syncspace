import { Router } from "express";
import { pool } from "../db/index.js";

const router = Router();



router.post("/", async (req, res) => {
  try {
    const { email, password } = req.body;

    const result = await pool.query(
      `INSERT INTO users (email, password)
       VALUES ($1, $2)
       RETURNING id, email, created_at`,
      [email, password]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to create user",
    });
  }
});

export default router;
