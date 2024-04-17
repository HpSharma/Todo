const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const { config } = require('dotenv');
const path = require('path')

const { verifyToken } = require('./jwt');
// Routes
const registerRoutes = require('./src/routes/register.routes');
const loginRoutes = require('./src/routes/login.routes');
const taskRoutes = require('./src/routes/task.routes');

config();
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
  secret: process.env.JWT_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false },
}));
app.use((req, res, next) => {
  res.locals.session = req.session;
  next();
});

// Set EJS as view engine
app.set('views', path.join(__dirname, 'src/views'));
app.set('view engine', 'ejs');

mongoose.connect(process.env.ATLAS_URI);
const db = mongoose.connection;
db.on("error", error => console.error(error));
db.once("open", () => console.log("Connected With Mongo :)"));

// app.get('/', verifyToken, (req, res) => res.render(VIEW_PATH + '/home.ejs'));
app.use("/", registerRoutes);
app.use("/", loginRoutes);
app.use("/", verifyToken, taskRoutes);

app.listen(process.env.PORT, () => console.log("Server has started on Port: ", process.env.PORT));
