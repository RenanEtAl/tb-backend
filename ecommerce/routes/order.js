const express = require("express");
const router = express.Router();

const { requireSignin, isAuth, isAdmin } = require("../controllers/auth");
const { userById, addOrderToUserHistory } = require("../controllers/user");
const {
    create,
    listOrders,
    getStatusValues,
    orderById,
    updateOrderStatus
} = require("../controllers/order");
const { decreaseQuantity } = require("../controllers/product");

// order route
router.post(
    "/order/create/:userId",
    requireSignin,
    isAuth,
    addOrderToUserHistory,
    decreaseQuantity,
    create
);

// get orders to front end
router.get("/order/list/:userId", requireSignin, isAuth, isAdmin, listOrders);
// status value for each order
router.get(
    "/order/status-values/:userId",
    requireSignin,
    isAuth,
    isAdmin,
    getStatusValues
);

// update order status
router.put(
    "/order/:orderId/status/:userId",
    requireSignin,
    isAuth,
    isAdmin,
    updateOrderStatus
);

router.param("userId", userById);
router.param("orderId", orderById);

module.exports = router;
