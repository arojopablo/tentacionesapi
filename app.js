var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var fileUpload = require('express-fileupload');
var cors = require('cors');

require('dotenv').config();

var session = require('express-session');

// helpers despues borrar
// var helpers = require('handlebars-helpers')();
// Require handlebars and just-handlebars-helpers
// const Handlebars = require('handlebars');
// const H = require('just-handlebars-helpers');

// Register just-handlebars-helpers with handlebars
// H.registerHelpers(Handlebars);

// hasta aca borrar

// var indexRouter = require('./routes/index');
var indexRouter = require('./routes/admin/login');
var usersRouter = require('./routes/users');


// var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var loginRouter = require("./routes/admin/login");
var adminRouter = require('./routes/admin/productos');  
var novedadesRouter = require('./routes/admin/novedades');
var serviciosRouter = require('./routes/admin/servicios');  
var usuariosRouter = require('./routes/admin/usuarios'); 
var ofertasRouter = require('./routes/admin/ofertas');  
var clientesRouter = require('./routes/admin/clientes'); 
var ventasRouter = require('./routes/admin/ventas'); 
var notificacionesRouter = require('./routes/admin/notificaciones'); 
var apiRouter = require('./routes/api');




var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));




app.use(session({
  secret  :           '#gayHQNJ&gKb2',
  Cookie  :           {maxAge: null},
  resave  :           false,
  saveUninitialized:  true  
}))

secured = async (req,res,next) => {
  try {
    console.log(req.session.id_usuario);
    if (req.session.id_usuario) {
      next() }
      else  {
        res.redirect('/admin/login')
      }
    } catch(error) {
      console.log(error);
    } 
} // cierro secured

app.use(fileUpload({
  useTempFiles: true,
  tempFileDir: '/tmp/'
}));



app.use('/', indexRouter);
app.use('/users', usersRouter);


app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use("/admin/login",loginRouter);
app.use('/admin/productos',secured,adminRouter);
// app.use('/admin/productos',adminRouter);
app.use('/admin/nuevoproducto',secured,adminRouter);
app.use('/admin/novedades',secured,novedadesRouter);
app.use('/admin/servicios',secured,serviciosRouter);
app.use('/admin/usuarios',secured,usuariosRouter);
app.use('/admin/ofertas',secured,ofertasRouter);
app.use('/admin/clientes',secured,clientesRouter);
app.use('/admin/ventas',secured,ventasRouter);
app.use('/admin/notificaciones',secured,notificacionesRouter);

// app.use('/admin/novedades/agregar',secured,novedadesRouter);
app.use('/api', cors(), apiRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
