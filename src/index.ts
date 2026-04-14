import express from "express";
import authRouter from "./routers/authRouter";
import serviceRouter from "./routers/serviceRouter";
import appointmentRouter from "./routers/appointmentRouter";
import providersRouter from "./routers/providerRouter";
import { authMiddleware } from "./middlewares/authMiddleware";

const app = express();
app.use(express.json());
const PORT = 3000;

app.use("/auth", authRouter);
app.use("/services", authMiddleware, serviceRouter);
app.use("/appointments", authMiddleware, appointmentRouter);
app.use("/providers", authMiddleware, providersRouter);

app.listen(PORT, () => {
  console.log(`Server is running on PORT: ${PORT}`);
});
