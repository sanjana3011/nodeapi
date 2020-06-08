const express = require("express");
const { razor, razor_validate } = require("../controllers/razorpay");

const {hasAuthorization, userById} = require("../controllers/user");
const {requireSignin} = require("../controllers/auth");
const { createOrder } = require("../controllers/order");

const router = express.Router();

router.post("/razorpay", razor);
router.post("/verification", razor_validate);
router.post("/order/create/:userId", requireSignin, hasAuthorization, createOrder);


router.param("userId", userById);

module.exports = router;