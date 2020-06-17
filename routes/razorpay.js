const express = require("express");
const { razor_CreateOrder, razor_success } = require("../controllers/razorpay");

const {hasAuthorization, userById} = require("../controllers/user");
const {requireSignin} = require("../controllers/auth");
//const { createOrder } = require("../controllers/order");

const router = express.Router();

router.get('/razorpay/getOrderId/:userId', requireSignin, hasAuthorization, razor_CreateOrder);
router.post('/check_success/:userId', requireSignin, hasAuthorization,razor_success);
//router.post("/verification", razor_validate);


router.param("userId", userById);

module.exports = router;