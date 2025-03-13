import express from "express";
import cors from "cors";
import eventRoutes from "./routes/events";
import dotenv from "dotenv";
dotenv.config();

function main() {
  const app = express();

  app.use(cors({ origin: "*" }));
  app.use(express.json());
  app.use("/api", eventRoutes);

  const port = process.env.PORT || 8000;
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}

main();
