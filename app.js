const express = require("express");
const routes = require("./routes");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", routes);

app.use("/", (req, res, next) => {
  res.status(404).send("Not Found");
  next();
});

// eslint-disable-next-line no-unused-vars
app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

app.listen(3000, () => {
  console.log("app listen on port 3000");
});
