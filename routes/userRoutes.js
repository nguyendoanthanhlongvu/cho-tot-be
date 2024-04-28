import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../models/userModel.js";
import { checkAccessToken } from "../middleware/authMiddleware.js";
import cors from "cors";
import { WebSocketServer } from "ws";
import { webSocketMessage } from "../middleware/sendWebSocketMessage.js";

const userRouter = express.Router();
userRouter.use(cors());
const wss = new WebSocketServer({ port: 8084 });

userRouter.post("/register", async (req, res) => {
  const { fullname, password, phone } = req.body;

  try {
    const existingUser = await User.findOne({ phone });
    if (existingUser) {
      return res.status(201).json({
        message: "Số điện thoại tài khoản đã tồn tại.",
        status: "UNSUCCESS",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ fullname, password: hashedPassword, phone });
    await user.save();
    webSocketMessage(wss, "new-account", fullname);
    res.status(201).json({
      message: "Tài khoản được đăng ký thành công.",
      status: "SUCCESS",
    });
  } catch (error) {
    res.status(500).json({ error: "Xin vui lòng hãy thử lại sau." });
  }
});

userRouter.post("/login", async (req, res) => {
  const { phone, password } = req.body;
  try {
    const user = await User.findOne({ phone });
    if (!user) {
      return res
        .status(200)
        .json({ message: "Tài khoản không tìm thấy.", status: "NOT_FOUND" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (isPasswordValid) {
      const token = jwt.sign({ id: user._id }, "VinalinkGroup!2020");
      res
        .status(200)
        .json({ token, message: "Đăng nhập thành công.", status: "SUCCESS" });
    } else {
      res.status(200).json({
        message: "Sai mật khẩu hoặc số điện thoại.",
        status: "UNSUCCESS",
      });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

userRouter.put("/change-profile", checkAccessToken, async (req, res) => {
  const {
    address,
    introduction,
    identifyCard,
    favouriteList,
    rememberName,
    faxNumber,
    sex,
    birthdate,
  } = req.body;

  try {
    const userId = req.user.id;

    const updates = {
      address,
      introduction,
      rememberName,
      identifyCard,
      faxNumber,
      favouriteList,
      sex,
      birthdate,
    };

    const updatedUser = await User.findByIdAndUpdate(userId, updates, {
      new: true,
      select: "-password",
    });

    res
      .status(200)
      .json({ message: "Chỉnh sửa thông tin thành công.", user: updatedUser });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});
userRouter.put("/change-password", checkAccessToken, async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  try {
    const userId = req.user.id;
    const user = await User.findById(userId);

    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password
    );
    if (!isPasswordValid) {
      return res.status(200).json({ message: "Mật khẩu hiện tại không đúng." });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedNewPassword;
    await user.save();

    res.status(200).json({
      message: "Mật khẩu đã được thay đổi thành công.",
      success: true,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

userRouter.get("/get-profile", checkAccessToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    res.status(200).json({ user: user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

export default userRouter;