const express = require("express");
const { createOrder } = require("../controllers/order");
const {hasAuthorization, userById} = require("../controllers/user");
const {requireSignin} = require("../controllers/auth");

const router = express.Router();


router.post("/order/create/:userId", requireSignin, hasAuthorization, createOrder);


router.param("userId", userById);


module.exports = router;