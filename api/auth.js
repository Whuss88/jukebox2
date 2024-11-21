const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

// import jwt and secret

// createToken
function createToken(id) {
  return jwt.sign({ id }, JWT_SECRET, { expiresIn: "1d" });
}

const prisma = require("../prisma");

// token checking middleware will run before any other routes
// first in file and this router is imported first into server.js
router.use(async (req,res,next) => {
  // grab token from headers if exist
   const authHeader = req.headers.authorization;
   const token = authHeader?.slice(7); // bearer <token>
   if (!token) return next();
  //  find user with id decrypted from tkn & attach request
    try{
      const { id } = jwt.verify(token, JWT_SECRET);
      const user = prisma.user.findUniqueOrThrow({
        where: { id },
      });
      req.user = user;
      next()
    } catch (e) {
      next(e);
    }
});

//  register
router.post("/register", async (req,res,next) => {
  const { email, password } = req.body;
  try {
    const user = await prisma.user.register(email,password);
    const token = createToken(user.id);
    res.status(201).json({token});
  } catch(e) {
    next(e);
  }
});
// login
router.post("/login", async (req,res,next) =>{
  const { email, password } = req.body;
  try {
    const user = await prisma.user.login(email, password);
    const token = createToken(user.id);
    res.json({token});
  } catch (e) {
    next(e);
  }
})

// check the request for authenticated user
function authenticate(req,res,next) {
  if (req.user) {
    next();
  } else {
    next({ status: 401, message: "You must be logged in."})
  }
}

module.exports = {
  router,
  authenticate,
}