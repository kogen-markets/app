const User = require("../models/UserModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("../config/config");
const _ = require("lodash");

exports.adminLogin = async (req, res) => {
  try {
    await User.findOne({ email: req.body.email, delete: false }).then(
      async (user) => {
        if (!user) {
          return await res
            .status(400)
            .json({ message: "You are not registered." });
        }
        bcrypt.compare(req.body.password, user.password).then(async (matched) => {
          if (!matched) {
            return res.status(400).json({ message: "Password incorrect" });
          }
          await user.updateOne({
            $set: { status: req.body.status },
          });
          if (user.role !== 'admin') {
            return res.status(400).json({ message: "You are not admin." });
          }
          const payload = {
            id: user._id,
            fullName: user.fullName,
            email: user.email,
            avatar: user.avatar,
          };
          const token = jwt.sign(payload, config.secretOrKey, { expiresIn: "1 day" });
          res.json({
            success: "true",
            message: "Success",
            data: {
              token: token,
              id: user.id,
              fullName: user.fullName,
              avatar: user.avatar,
              email: user.email,
              file: user.file,
            }
          });
        });
      },
    );
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Server Error", err: err });
  }

};

exports.logout = async (req, res) => {
  try {
    // Find the user by their email (You might use the token to identify the user in some systems)
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Optionally update user status to "logged out"
    await user.updateOne({ $set: { status: false } });

    // Optional: If you want to invalidate the token, implement token blacklisting or just rely on the token's expiration.
    res.json({
      success: true,
      message: "Logout successful.",
    });

  } catch (error) {
    console.error("Error during logout: ", error);
    res.status(500).json({ message: "Server error, please try again later." });
  }
};

exports.tokenlogin = async (req, res) => {
  await User.findById(req.user.id).then((user) => {
    if (!user) {
      return res.status(400).json({ message: "You are not registered" });
    }
    const payload = {
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      avatar: user.avatar,
    };
    const jwtToken = jwt.sign(payload, config.secretOrKey, { expiresIn: "1 day" });
    return res.json({
      success: "true",
      token: jwtToken,
      user: user,
    });
  });
};

exports.getAUser = async (req, res) => {
  try {
    await User.findOne({ email: req.user.email }).then((user) => {
      return res.status(200).json({
        message: "Get User successfully",
        user: user,
      });
    });
  } catch (error) {
    console.log(error);
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getAllUser = async (req, res) => {
  try {
    const users = await User.find({});
    const total = await User.countDocuments({});

    res.status(200).json({
      message: "Success", users, pagination: {
        total: total,
      }
    });
  } catch (error) {
    console.log(error);
  }
};

exports.updateActivateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndUpdate(id, { is_actived: req.body.is_actived });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ message: 'User status updated successfully' });
  } catch (error) {
    console.error('Error updating user status:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
