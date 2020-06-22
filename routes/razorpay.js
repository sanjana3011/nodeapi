const express = require("express");
const { razor_CreateOrder, razor_verify } = require("../controllers/razorpay");

const {hasAuthorization, userById} = require("../controllers/user");
const {requireSignin} = require("../controllers/auth");

const router = express.Router();

router.get('/razorpay/getOrderId/:userId', requireSignin, hasAuthorization, razor_CreateOrder);
router.post('/check_success/:userId', requireSignin, hasAuthorization, razor_verify);
//router.post("/verification", razor_validate);


router.param("userId", userById);

module.exports = router;