const express = require("express");
const app = express();

// إعداد CORS
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*"); // السماح لجميع الأصول (يمكنك تحديد النطاق بدلاً من "*")
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});

app.get("/events", (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  res.write("event: connected\n");
  res.write("data: Connection established\n\n");

  const intervalId = setInterval(() => {
    const now = new Date().toISOString();
    res.write(`data: TEST\n\n`);
  }, 3000);

  req.on("close", () => {
    clearInterval(intervalId);
    console.log("Connection closed");
  });
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
