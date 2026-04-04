import express from "express";
import authRouter from "./routers/authRouter";

const app = express();
const PORT = 3000;

app.use("/auth", authRouter);

app.listen(PORT, () => {
  console.log(`Server is running on PORT: ${PORT}`);
});
