var express = require('express');
var router = express.Router();
var ofertasModel = require('./../../models/ofertasModel');
var notificacionesModel = require('./../../models/notificacionesModel');


router.get('/',async function (req,res,next) {
    var ofertas = await ofertasModel.getOfertas();   
    var notificacion = await notificacionesModel.getNotificaciones(req.session.id_usuario);
    var cantidad_notificaciones = await notificacionesModel.getCantidadNotificacionesNoVistas(req.session.id_usuario);   


    res.render('admin/ofertas', {
        layout: 'admin/layout',
        usuario: req.session.nombre,
        cantidad_notificaciones,
        notificacion,
        ofertas
    });
});



router.get('/agregar', function (req, res, next) {
    res.render('admin/nuevaOferta', {
    layout: 'admin/layout',
    usuario: req.session.nombre
  });
  });


  router.post('/agregar', async (req,res,next) => {
      try {
          console.log(req.body);
          if (req.body.cuerpo != "") {
              await ofertasModel.insertOferta(req.body);
              res.redirect('/admin/ofertas')              
           } else {
               res.render('admin/nuevaOferta', {
                   layout: 'admin/layout',
                   error: true,
                   message: "campo cuerpo es requerido"
               });
           }
      } catch(error) {
          console.log(error);
          res.render('admin/nuevaOferta', {
              layout: 'admin/layout',
              error: true,
              message: "no se cargo oferta"
          });
      }
  });

/* Para eliminar */

router.get('/eliminar/:id', async (req, res, next) => {
    var id = req.params.id;
    await ofertasModel.deleteOfertasdById(id);
    res.redirect('/admin/ofertas');
});

// Para modificar necesito traer la oferta por id
router.get('/modificar/:id', async (req, res, next) => {
    var id = req.params.id;
    console.log(req.params.id);

    var oferta = await ofertasModel.getOfertaById(id);
    console.log(req.params.id);    
    res.render('admin/modificarOferta', {
        layout: 'admin/layout',
        usuario: req.session.nombre,
        oferta
    });
});

  // modificar (update)

router.post('/modificar', async (req, res, next) => {
    try {
        var obj = {
            titulo: req.body.titulo,
            cuerpo: req.body.cuerpo,
            tipo: req.body.tipo
        }
        // console.log(obj);

        await ofertasModel.modificarOfertaById(obj, req.body.id);
        res.redirect('/admin/ofertas');
    }
    catch (error) {
        console.log(error)
        res.render('admin/modificarOferta', {
            layout: 'admin/layout',
            usuario: req.session.nombre,
            error: true,
            message: 'No se modifico la oferta'
        })
    }
});

module.exports = router;