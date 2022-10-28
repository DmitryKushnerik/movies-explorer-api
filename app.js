require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const routes = require('./routes');
const errorHandler = require('./middlewares/errorHandler');
const { corsOriginHandler, corsOptionsHandler } = require('./middlewares/corsHandler');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { limiter } = require('./middlewares/ratelimiter');
const database = require('./utils/database');

const { PORT = 3000 } = process.env;
const { PORT_DB = database } = process.env;
const app = express();

app.use(requestLogger);
app.use(limiter);
app.use(cookieParser());
app.use(helmet());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect(PORT_DB, {
  useNewUrlParser: true,
});

app.use(corsOriginHandler);
app.use(corsOptionsHandler);

app.use(routes);

app.use(errorLogger);

app.use(errors());

app.use(errorHandler);

app.listen(PORT);
