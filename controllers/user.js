const User = require("../models/user");
const { CartItem, Order } = require("../models/order");
const { errorHandler } = require("../helpers/dbErrorHandler");

exports.userById = (req, res, next, id) => {
  User.findById(id).exec((error, user) => {
    if (error || !user) {
      return res.status(400).json({
        error: "User not found",
      });
    }

    user.salt = undefined;
    user.hashed_password = undefined;

    req.profile = user;
    next();
  });
};

exports.read = (req, res) => {
  req.profile.hashed_password = undefined;
  req.profile.salt = undefined;

  return res.json(req.profile);
};

// exports.update = (req, res) => {
//   const {}
//   User.findOneAndUpdate(
//     { _id: req.profile._id },
//     { $set: req.body },
//     { new: true },
//     (err, user) => {
//       if (err) {
//         return res.status(400).json({
//           error: "You are not authorized to perform this action",
//         });
//       }
//       user.hashed_password = undefined;
//       user.salt = undefined;
//       res.json(user);
//     }
//   );
// };

exports.update = (req, res) => {
  const { name, email, oldPassword, password } = req.body;
  User.findOne({ _id: req.profile._id }, (err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: "User not found",
      });
    }

    if (password) {
      if (!user.authenticate(oldPassword)) {
        return res.status(401).json({
          error: "Old Password does not match user's records",
        });
      } else {
        if (password.length < 6) {
          return res.status(422).json({
            error: "Password requires minimum of 6 characters",
          });
        } else if (!/\d/.test(password)) {
          return res.status(422).json({
            error: "Password must contain a number",
          });
        } else {
          console.log("HASHED PASSWORD BEFORE UPDATE:  ", user.hashed_password);
          user.password = password;
          console.log("USER UPDATED PASSWORD:  ", user.password);
          console.log("HASHED PASSWORD AFTER UPDATE:  ", user.hashed_password);
        }
      }
    }

    if (name) {
      user.name = name;
    }

    if (email) {
      user.email = email;
    }

    user.save((err, updatedUser) => {
      if (err) {
        return res.status(400).json({
          error: "User could not be updated due to invalid parameters",
        });
      }
      res.json(updatedUser);
    });
  });
};

exports.addOrderToUserHistory = (req, res, next) => {
  let history = [];

  req.body.order.products.forEach((item) => {
    history.push({
      _id: item._id,
      name: item.name,
      description: item.description,
      category: item.category,
      quantity: item.count,
      transaction_id: req.body.order.transaction_id,
      amount: req.body.order.amount,
    });
  });

  User.findOneAndUpdate(
    { _id: req.profile._id },
    { $push: { history: history } },
    { new: true },
    (err, user) => {
      if (err) {
        return res.status(400).json({
          error: "Could not update user purchase history",
        });
      }
      // req.profile = user;

      next();
    }
  );
};

exports.purchaseHistory = (req, res) => {
  Order.find({ user: req.profile._id })
    .populate("user", "_id name email")
    .sort("-createdAt")
    .exec((err, orders) => {
      if (err) {
        return res.status(400).json({
          error: errorHandler(err),
        });
      }
      res.json(orders);
    });
};
