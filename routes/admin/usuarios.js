var express = require('express');
var router = express.Router();
var usuariosModel = require('./../../models/usuariosModel');
var notificacionesModel = require('./../../models/notificacionesModel');



router.get('/',async function (req,res,next) {
    var usuarios = await usuariosModel.getUsuarios();
    var notificacion = await notificacionesModel.getNotificaciones(req.session.id_usuario);
    var cantidad_notificaciones = await notificacionesModel.getCantidadNotificacionesNoVistas(req.session.id_usuario);   


    // console.log(usuarios);
    
    res.render('admin/usuarios', {
        layout: 'admin/layout',
        usuario: req.session.nombre,
        // notificacion: req.session.notificacion, // quito notificacion de sesion porque lo hago persistente y muestro a traves del controlador
        notificacion,
        cantidad_notificaciones,
        usuarios
    });
});


router.get('/agregar', async function (req, res, next) {

    var notificacion = await notificacionesModel.getNotificaciones(req.session.id_usuario);
    var cantidad_notificaciones = await notificacionesModel.getCantidadNotificacionesNoVistas(req.session.id_usuario); 

    res.render('admin/nuevoUsuario', {
    layout: 'admin/layout',
    usuario: req.session.nombre,
    notificacion,
    cantidad_notificaciones
  });
  });


  router.post('/agregar', async (req,res,next) => {
      try {
        //   console.log(req.body);
        var notificacion = await notificacionesModel.getNotificaciones(req.session.id_usuario);
        var cantidad_notificaciones = await notificacionesModel.getCantidadNotificacionesNoVistas(req.session.id_usuario); 
          if (req.body.usuario != "" && req.body.password != "" && req.body.rol != "") {
              await usuariosModel.insertUsuario(req.body);
              res.redirect('/admin/usuarios')              
           } else {
               res.render('admin/nuevoUsuario', {
                   layout: 'admin/layout',
                   error: true,
                   usuario: req.session.nombre,
                   notificacion,
                   cantidad_notificaciones,
                   message: "Todos los campos son requeridos"
               });
           }
      } catch(error) {
          console.log(error);
          res.render('admin/nuevoUsuario', {
              layout: 'admin/layout',
              error: true,
              notificacion,
              cantidad_notificaciones,
              message: "no se cargo usuario"
          });
      }
  });


/* Para eliminar */

router.get('/eliminar/:id', async (req, res, next) => {
    var id = req.params.id;
    await usuariosModel.deleteusuariosdById(id);
    res.redirect('/admin/usuarios');
});

module.exports = router;