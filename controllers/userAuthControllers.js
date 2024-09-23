

const User = require("../models/user");
const bcrypt = require("bcryptjs");


class UserAuth {
    static async register(req, res) {
        try {
          console.log(req.body);
          const { email, password } = req.body;
          const errors = [];

          // Validate email
          if (!email || typeof email !== 'string' || !email.includes('@')) {
            errors.push({ msg: 'Please enter a valid email address.' });
          }
        
          // Validate password
          if (!password || typeof password !== 'string' || password.length < 6) {
            errors.push({ msg: 'Password must be at least 6 characters long.' });
          }
        
 
          // If there are validation errors, respond with them
          if (errors.length > 0) {
            return res.status(400).json({
              status: 400,
              success: false,
              errors,
            });
          }
            
          if (req.body.password == req.body.confirm) {
            const checkEmail = await User.findOne({ email: req.body.email });
            if (checkEmail) {
              return res.status(400).send({
                status: 400,
                success: false,
                message: "Someone already has that email, Try Another",
              });
            }
    
            const user = new User({
              email: req.body.email,
              password: req.body.password,
              confirm_password: req.body.confirm,
              nickname: req.body.nickname,
              ischecked: req.body.agreement,
              mobile: req.body.phone,
            });
            await user.save();
    
            res.status(200).send({
              status: 200,
              success: true,
              message: "Your account is created Successfully.",
              data: user
            });
          } else {
            return res.status(400).send({
              status: 400,
              success: false,
              message: "Password Mismatched",
            });
          }
        } catch (error) {
          console.log("Error @ user register : ", error);
          return res.status(400).send({
            status: 400,
            success: false,
            message: error.message ? error.message : "something went wrong",
          });
        }
      }
    
    
      static async login(req, res) {
        try {
          const { email, password } = req.body;
          console.log(req.body)
           // Manual Input Validation
  const errors = [];

  // Validate email
  if (!email || typeof email !== 'string' || !email.includes('@')) {
    errors.push({ msg: 'Please enter a valid email address.' });
  }

  // Validate password
  if (!password || typeof password !== 'string' || password.length < 6) {
    errors.push({ msg: 'Password must be at least 6 characters long.' });
  }
  // If there are validation errors, respond with them
  if (errors.length > 0) {
    return res.status(400).json({
      status: 400,
      success: false,
      errors,
    });
  }
    
          const user = await User.findOne({ email });
    
          if (!user) {
            return res.status(400).json({
              status: 400,
              success: false,
              message: "User not found. Please register.",
            });
          }
    console.log(user)
          const passwordMatch = await bcrypt.compare(password, user.password);
    
          if (!passwordMatch) {
            return res.status(401).json({
              status: 401,
              success: false,
              message: "Invalid password. Please try again.",
            });
          }
    
          const token = await user.generateAuthToken();
    
    
          console.log("Token: " + token);
    
          return res
            .cookie("usertoken", token, {
              maxAge: 1000 * 60 * 60 * 24 * 15,
              httpOnly: true,
              sameSite: 'None',
              secure: true, // Set to true if using HTTPS in production
            })
            .json({
              status: 200,
              success: true,
              message: "Login Successfully",
              userData: user,
            });
          
        } catch (error) {
          console.error("Error @ user login: ", error);
          return res.status(500).json({
            status: 500,
            success: false,
            message: "Internal server error.",
          });
        }
      }
    
      static async logout(req, res) {
        console.log(req)
        try {
          res.clearCookie("usertoken");
          res
            .status(200)
            .json({ status: 200, success: true, message: "Logout Successfully" });
        } catch (err) {
          console.error("Error during logout:", err);
          return res.status(400).json({
            status: 400,
            success: false,
            message: "something went wrong",
            error: err,
          });
        }
      }
    }


    module.exports = UserAuth