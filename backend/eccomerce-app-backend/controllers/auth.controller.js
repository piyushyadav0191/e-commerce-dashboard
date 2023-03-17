const { response } = require("express");

const bcrypt = require("bcryptjs");

const User = require("../models/user");

const { jwtGenerate } = require("../helpers/jwt-generate");
const { googleVerify } = require("../helpers/google-verify");

const loginController = async (req, res = response) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }).populate({
      path: "cart",
      populate: {
        path: "category",
        populate: {
          path: "name",
        },
      }, 
    });

    if (!user) {
      return res.status(400).json({
        msg: "User / Password are not correct - email",
      });
    }

    if (!user.status) {
      return res.status(400).json({
        msg: "User not found - Status: false",
      });
    }

    const validPassword = bcrypt.compareSync(password, user.password);
    if (!validPassword) {
      return res.status(400).json({
        msg: "Password incorrect - Password",
      });
    }

    const { id } = user;
    const token = await jwtGenerate(id);

    res.json({
      msg: "OK",
      user,
      token,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: "Login failed - Talk to the administrator.",
    });
  }
};

const googleSignInController = async (req, res = response) => {
  const { id_token } = req.body;

  try {
    // console.log(id_token);
    const { payload } = await googleVerify(id_token);
    const { email, name, picture: img } = payload;

    const user = await User.findOne({ email }).populate({
      path: "cart",
      populate: {
        path: "category",
        populate: {
          path: "name",
        },
      },
    });

    if (!user || user === null) {
      const data = {
        name,
        email,
        password: ":P",
        img,
        role: "USER_ROLE",
        google: true,
      };

      const userNew = new User(data);

      const userNewFinish = await userNew.save().populate({
        path: "cart",
        populate: {
          path: "category",
          populate: {
            path: "name",
          },
        },
      });

      const token = await jwtGenerate(userNewFinish.id);

      return res.json({
        msg: "OK",
        user: userNewFinish,
        token,
      });
    }

    if (!user.status) {
      return res.status(401).json({
        msg: "Talk to administrator - User blocked",
      });
    }

    const token = await jwtGenerate(user.id);

    return res.json({
      msg: "OK",
      user,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      msg: "The token could not be verified",
    });
  }
};

const tokenRevalidate = async (req, res = response) => {
  try {
    const { _id, name, role, cart, email, data } = req.user;

    const token = await jwtGenerate(_id);

    res.json({
      msg: "OK",
      token,
      name,
      email,
      _id,
      role,
      cart,
      data,
    });
  } catch (error) {
    console.log(error);
    res.json({
      msg: "Error al renovar el token",
      error,
    });
  }
};

module.exports = {
  loginController,
  googleSignInController,
  tokenRevalidate,
};
