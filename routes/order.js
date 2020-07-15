const express = require("express");
const { create, listOrders , getStatusValues , updateOrderStatus , orderById} = require("../controllers/order");
const {hasAuthorization, userById , addOrderToUserHistory} = require("../controllers/user");
const {requireSignin} = require("../controllers/auth");

const router = express.Router();


router.post("/order/create/:userId", requireSignin, hasAuthorization, addOrderToUserHistory, create);

router.get("/order/list/:userId", requireSignin, hasAuthorization , listOrders);

router.param("userId", userById);
router.param("orderId", orderById);

router.get(
    "/order/status-values/:userId",
    requireSignin,
    hasAuthorization,
    getStatusValues
);
router.put(
    "/order/:orderId/status/:userId",
    requireSignin,
    hasAuthorization,
    updateOrderStatus
);


module.exports = router;