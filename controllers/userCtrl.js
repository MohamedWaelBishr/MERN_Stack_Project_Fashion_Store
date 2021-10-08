const Users = require("../models/userModel");
const Payments = require("../models/paymentModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userCtrl = {
  register: async (req, res) => {
    try {
      const { name, email, password } = req.body;

      const user = await Users.findOne({ email });
      if (user)
        return res.status(400).json({ msg: "The email already exists." });

      if (password.length < 6)
        return res
          .status(400)
          .json({ msg: "Password is at least 6 characters long." });

      // Password Encryption
      const passwordHash = await bcrypt.hash(password, 10);
      const newUser = new Users({
        name,
        email,
        password: passwordHash,
      });

      // Save mongodb
      await newUser.save();

      // Then create jsonwebtoken to authentication
      const accesstoken = createAccessToken({ id: newUser._id });
      const refreshtoken = createRefreshToken({ id: newUser._id });

      res.cookie("refreshtoken", refreshtoken, {
        httpOnly: true,
        path: "/user/refresh_token",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7d
      });

      res.json({ accesstoken });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  createUserAdmin: async (req, res) => {
    try {
      const { name, email, password, role, status } = req.body;

      const user = await Users.findOne({ email });
      if (user)
        return res.status(400).json({ msg: "This email already exists." });

      if (password.length < 6)
        return res
          .status(400)
          .json({ msg: "Password is at least 6 characters long." });

      if (role != "0" && role != "1") {
        return res
          .status(400)
          .json({ msg: "Role Can't Be Nothing But 0 Or 1" });
      }

      // Password Encryption
      const passwordHash = await bcrypt.hash(password, 10);
      const newUser = new Users({
        name,
        email,
        password: passwordHash,
        role,
        status,
      });

      // Save mongodb
      await newUser.save();

      // // Then create jsonwebtoken to authentication
      // const accesstoken = createAccessToken({ id: newUser._id });
      // const refreshtoken = createRefreshToken({ id: newUser._id });

      // res.cookie("refreshtoken", refreshtoken, {
      //   httpOnly: true,
      //   path: "/user/refresh_token",
      //   maxAge: 7 * 24 * 60 * 60 * 1000, // 7d
      // });

      res.json({ msg: "Account Created Successfully" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  login: async (req, res) => {
    try {
      const { email, password, status } = req.body;

      const user = await Users.findOne({ email });
      if (!user) return res.status(400).json({ msg: "User does not exist." });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ msg: "Incorrect password." });

      if (user.status === false) {
        return res.status(403).json({
          msg: "Access Denied - Your Account Has Been Disabled By Administrator",
        });
      }
      // If login success , create access token and refresh token
      const accesstoken = createAccessToken({ id: user._id });
      const refreshtoken = createRefreshToken({ id: user._id });

      res.cookie("refreshtoken", refreshtoken, {
        httpOnly: true,
        path: "/user/refresh_token",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7d
      });

      res.json({ accesstoken });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  logout: async (req, res) => {
    try {
      res.clearCookie("refreshtoken", { path: "/user/refresh_token" });
      return res.json({ msg: "Logged out" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  refreshToken: (req, res) => {
    try {
      const rf_token = req.cookies.refreshtoken;
      if (!rf_token)
        return res.status(400).json({ msg: "Please Login or Register" });

      jwt.verify(rf_token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err)
          return res.status(400).json({ msg: "Please Login or Register" });

        const accesstoken = createAccessToken({ id: user.id });

        res.json({ accesstoken });
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  getUser: async (req, res) => {
    try {
      const user = await Users.findById(req.user.id).select("-password");
      if (!user) return res.status(400).json({ msg: "User does not exist." });

      res.json(user);
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  getAll: async (req, res) => {
    try {
      const users = await Users.find({}).select("-password");
      if (!users) return res.status(400).json({ msg: "Users List Is Empty" });
      res.json({ users: users, msg: "fetched all users successfully" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  info: async (req, res) => {
    try {
      let id = req.query.id;
      const user = await Users.findById(id).select("-password");
      if (!user) return res.status(400).json({ msg: "No User With This ID" });
      res.json({ user: user, msg: "fetched user successfully" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  addCart: async (req, res) => {
    try {
      const user = await Users.findById(req.user.id);
      if (!user) return res.status(400).json({ msg: "User does not exist." });

      await Users.findOneAndUpdate(
        { _id: req.user.id },
        {
          cart: req.body.cart,
        }
      );

      return res.json({ msg: "Added to cart" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  history: async (req, res) => {
    try {
      const history = await Payments.find({ user_id: req.user.id });

      res.json(history);
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  updateUser: async (req, res) => {
    try {
      let id = req.query.id;
      const { name, email, role, status } = req.body;

      if (role != "0" && role != "1") {
        return res
          .status(400)
          .json({ msg: "Role Can't Be Nothing But 0 Or 1" });
      }

      await Users.findOneAndUpdate({ _id: id }, { name, email, role, status });
      const users = await Users.find({});
      res.json({ msg: `User ${name} Successfully Updated`, users: users });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  deleteUser: async (req, res) => {
    try {
      let id = req.query.id;
      await Users.findOneAndDelete({ _id: id });
      const users = await Users.find({}).select("-password");
      return res
        .status(200)
        .json({ msg: `User Successfully Deleted`, users: users });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  updateUserInfo: async (req, res) => {
    try {
      const { _id, name, password, role, status } = req.body;

      // const user = await Users.findOne({ email });
      // if (user)
      //   return res
      //     .status(400)
      //     .json({ msg: "There Is An Account Assigned Already To This Email" });

      if (password.length < 6)
        return res
          .status(400)
          .json({ msg: "Password is at least 6 characters long." });

      const passwordHash = await bcrypt.hash(password, 10);

      if (role && status) {
        if (role != "0" && role != "1") {
          return res
            .status(400)
            .json({ msg: "Role Can't Be Nothing But 0 Or 1" });
        }
        const newUser = await Users.findOneAndUpdate(
          { _id },
          { name, password: passwordHash, role, status }
        );

        res.status(200).json({ msg: "User Updated Successfully" });
      } else {
        const newUser = await Users.findOneAndUpdate(
          { _id },
          { name, password: passwordHash }
        );
        res.status(200).json({ msg: "User Updated Successfully" });
      }

      // Password Encryption

      // Save mongodb

      // // Then create jsonwebtoken to authentication
      // const accesstoken = createAccessToken({ id: newUser._id });
      // const refreshtoken = createRefreshToken({ id: newUser._id });

      // res.cookie("refreshtoken", refreshtoken, {
      //   httpOnly: true,
      //   path: "/user/refresh_token",
      //   maxAge: 7 * 24 * 60 * 60 * 1000, // 7d
      // });

      // res.json({ msg: "Account Created Successfully" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
};

const createAccessToken = (user) => {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1d" });
};
const createRefreshToken = (user) => {
  return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "7d" });
};

module.exports = userCtrl;
