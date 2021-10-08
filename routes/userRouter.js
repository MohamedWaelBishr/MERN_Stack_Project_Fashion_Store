const router = require("express").Router();
const userCtrl = require("../controllers/userCtrl");
const auth = require("../middleware/auth");

router.post("/register", userCtrl.register);

router.post("/login", userCtrl.login);

router.get("/logout", userCtrl.logout);

router.get("/refresh_token", userCtrl.refreshToken);

router.get("/infor", auth, userCtrl.getUser);

router.patch("/addcart", auth, userCtrl.addCart);

router.get("/history", auth, userCtrl.history);

router.get("/all", auth, userCtrl.getAll);

router.get("/info", auth, userCtrl.info);

router.put("/update", auth, userCtrl.updateUser);

router.post("/createAdmin", auth, userCtrl.createUserAdmin);

router.delete("/delete", auth, userCtrl.deleteUser);

router.put("/edit", auth, userCtrl.updateUserInfo);

module.exports = router;
