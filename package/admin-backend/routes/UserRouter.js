const router = require("express").Router();
const passport = require("passport");
require("../config/passport");
const requireAuth = passport.authenticate("jwt", { session: false });
const UserCtr = require("../controller/UserController");

console.log("user router");

router
  //admin login
  .post("/admin/login", UserCtr.adminLogin)
  //logout
  .post("/logout", UserCtr.logout)
  //tokenlogin
  .get("/tokenlogin", requireAuth, UserCtr.tokenlogin)
  //getUser information
  .get("/user/", requireAuth, UserCtr.getAUser)
  //getUsers information
  .get("/users/", requireAuth, UserCtr.getAllUser)
  //update activate status
  .patch("/users/:id/activate", requireAuth, UserCtr.updateActivateStatus)
  //delete user
  .delete("/users/:id", requireAuth, UserCtr.deleteUser)

module.exports = router;
