const express = require("express");
const {userById, allUsers} = require("../controllers/user");
const router = express.Router();

router.get("/users", allUsers);

router.param("userId", userById);
// any route containing userId, our app will execute userById method
module.exports = router;