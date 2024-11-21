require("dotenv").config();
const express = require("express");
const app = express();
const PORT = 3000;

app.use(require("morgan")("dev"));
app.use(express.json());

// add routes

app.use((req,res,next) => {
  next({ status: 404, message: "Endpoint not found."});
});

app.use((error,req,next) => {
  console.error(err);
  res.status(err.status ?? 500);
  res.json(err.message ?? "Sorry, something broke :{");
});

app.listen(PORT, () => {
  console.log(`Listening on PORT ${PORT}.`)
})