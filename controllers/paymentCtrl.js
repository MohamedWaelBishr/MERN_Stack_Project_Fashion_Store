const Payments = require("../models/paymentModel");
const Users = require("../models/userModel");
const Products = require("../models/productModel");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const paymentCtrl = {
  getPayments: async (req, res) => {
    try {
      const payments = await Payments.find();
      res.json(payments);
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  createPayment: async (req, res) => {
    try {
      const charge = await stripe.charges.create({
        amount: req.body.amount,
        currency: "usd",
        description: "Place an order",
        source: req.body.paymentID,
      });

      const user = await Users.findById(req.user.id).select("name email");
      if (!user) return res.status(400).json({ msg: "User does not exist." });

      const { cart, paymentID } = req.body;

      const { _id, name, email } = user;

      const newPayment = new Payments({
        user_id: _id,
        name,
        email,
        cart,
        paymentID,
        status: true,
      });

      cart.filter((item) => {
        return sold(item._id, item.quantity, item.sold);
      });

      await newPayment.save();
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.status(200).json({ msg: "Payment Success!" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  deletePayment: async (req, res) => {
    try {
      let id = req.query.id;
      const pay = await Payments.findOneAndUpdate(
        { _id: id },
        { status: false }
      );
      const allPayments = await Payments.find({});
      if (pay && allPayments) {
        return res
          .status(200)
          .json({ msg: `Order Successfully Canceled`, payments: allPayments });
      }
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
};

const sold = async (id, quantity, oldSold) => {
  await Products.findOneAndUpdate(
    { _id: id },
    {
      sold: quantity + oldSold,
    }
  );
};

module.exports = paymentCtrl;
