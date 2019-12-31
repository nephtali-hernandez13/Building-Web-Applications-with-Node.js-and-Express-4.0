const express = require('express');
const chalk = require('chalk');
const debug = require('debug')('app');
const morgan = require('morgan');
const path = require('path');
const bodyParser = require('body-parser');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const app = express();
const port = process.env.PORT || 3000;

const config = {
  user: 'postgres',
  database: 'library',
  password: 'adminpassword',
  port: 5432  
};

const nav_data = {
  nav_title: 'Library',
  nav: [
    { link: '/books', title: 'Books' },
    { link: '/authors', title: 'Authors' }
  ]
};

app.use(morgan('tiny'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({ secret: 'library' }));

require('./src/config/passport.js')(app);

app.use(express.static(path.join(__dirname, '/public/')));
app.use('/css', express.static(path.join(__dirname, '/node_modules/bootstrap/dist/css')));
app.use('/js', express.static(path.join(__dirname, '/node_modules/bootstrap/dist/js')));
app.use('/js', express.static(path.join(__dirname, '/node_modules/jquery/dist')));
app.set('views', './src/views');
app.set('view engine', 'ejs');

const bookRouter = require('./src/routes/bookRoutes')(nav_data, config);
const adminRouter = require('./src/routes/adminRoutes')(nav_data);
const authRouter = require('./src/routes/authRoutes')(nav_data);

app.use('/books', bookRouter);
app.use('/admin', adminRouter);
app.use('/auth', authRouter);

app.get('/', (req, res) => {
  res.render('index', nav_data)
});

app.listen(port, () => debug(`Listening on Port ${chalk.green(port)}`));