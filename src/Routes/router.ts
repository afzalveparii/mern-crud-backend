import express from "express";
import UserControllers from "../Controllers/usersControllers";
import upload from "../multerconfig/storageConfig";

const router = express.Router();

// routes
router.post("/user/register", upload.single("user_profile"), UserControllers.userPost);
router.get("/user/details", UserControllers.userGet);
router.get("/user/:id", UserControllers.singleUserGet);
router.put("/user/edit/:id", upload.single("user_profile"), UserControllers.userEdit);
router.delete("/user/delete/:id", UserControllers.userDelete);
router.put("/user/status/:id", UserControllers.userStatus);
router.get("/userexport", UserControllers.userExport);

export default router;