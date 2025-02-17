const express = require("express");
const jwt = require("jsonwebtoken");
const session = require("express-session");
const customer_routes = require("./router/auth_users.js").authenticated;
const genl_routes = require("./router/general.js").general;

const app = express();

app.use(express.json());

app.use(
  "/customer",
  session({
    secret: "fingerprint_customer",
    resave: false,
    saveUninitialized: true,
  })
);

app.use("/customer/auth/*", function auth(req, res, next) {

  if (!req.session.authorization || !req.session.authorization.accessToken) {
    return res
      .status(401)
      .json({ message: "Unauthorized: No token Provided!" });
  }


  jwt.verify(
    req.session.authorization.accessToken,
    "access", 
    (err, user) => {
      if (err) {
        return res.status(403).json({ message: "Forbidden: Invalid token" });
      }
      req.user = user; 
      next(); 
    }
  );
});

const PORT = 5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT, () => console.log("Server is running"));
