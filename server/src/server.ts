import express from "express";

const app = express();

const PORT = 5000;

// Middleware
app.use(express.json());

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok"
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});