import express, { Request, Response } from "express";
import cors from "cors";
import { connectDB } from "../dbSettings/dbConnect";
import { StatusCodes } from "http-status-codes";
import { router as AuthRouter } from "../routers/authRouter";
import { router as UserRouter } from "../routers/userRouter";
import { router as PostRouter } from "../routers/postRouter";
import { router as chatRouter } from "../routers/chatRouter";
import { authenticaton } from "../middleware/AuthenticationMiddleware";
const app = express();
app.use(express.json());
app.use(cors());

app.use("/api/auth", AuthRouter);
app.use("/api/user", authenticaton, UserRouter);
app.use("/api/post", authenticaton, PostRouter);
app.use("/api/chat", authenticaton, chatRouter);

const port = 8000 || process.env.PORT;
const startServer = async () => {
  try {
    // atlas ->
    // special char are encoded so @ -> %40
    //mongodb+srv://root:<password>@cluster0.mm6h4yu.mongodb.net/?retryWrites=true&w=majority
    // replace <password> with real password : here, root12341234 (erase the <>)
    connectDB(
      "mongodb+srv://anirudhTechtic:fZK29xuvheH0j3aV@cluster0.hyodz5j.mongodb.net/CLONE?retryWrites=true&w=majority"
    );
    // compass ->connectDB('mongodb://127.0.0.1:27017/InstaDB')
    app.listen(port, () => {
      console.log("Server is running on port : ", port);
    });
  } catch (error) {
    console.log("Error in starting server.");
  }
};

startServer();

app.get("/isServerOn", (req: Request, res: Response) => {
  res.status(StatusCodes.OK).json({
    message: "server is listening",
  });
});
