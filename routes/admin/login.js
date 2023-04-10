var express = require('express');
var router = express.Router();
var usuariosModel = require('./../../models/usuariosModel');
var serviciosModel = require('./../../models/serviciosModel');
var notificacionesModel = require('./../../models/notificacionesModel');



/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('admin/login', {
    layout: "admin/layout"
  });
});

router.get('/logout', function (req, res, next) {
  req.session.destroy();
  res.render('admin/login', {
    layout: 'admin/layout'
  });
  });

 
router.post('/', async (req, res, next) => {
  try {
    var usuario = req.body.usuario;
    var password = req.body.password;
    var data = await usuariosModel.getUserByUserNameAndPassword(usuario, password);

    if (data != undefined) {
      var notificacion = await notificacionesModel.getNotificaciones(data.id); // busco en tabla notificaciones
      req.session.id_usuario = data.id;
      req.session.nombre = data.usuario;
      req.session.rol = data.rol;
      if (req.session.rol == 'root') {
        req.session.root = true
      } else {
        req.session.root = false
      }
      // console.log("el rol de usuario es: " + req.session.root);
      req.session.notificacion = notificacion;
      res.redirect('/admin/productos');
    } else {
      res.render('admin/login', {
        layout: 'admin/layout',
        error : true
      });
    }
    } catch (error) {
      console.log(error);
    }
    });


module.exports = router;