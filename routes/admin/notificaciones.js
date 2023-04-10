var express = require('express');
var router = express.Router();
var notificacionesModel = require('./../../models/notificacionesModel');
var usuariosModel = require('./../../models/usuariosModel');


router.get('/', async function (req, res, next) {

   
    // var ver_notificaciones = req.session.notificacion; 
    var notificacion = await notificacionesModel.getNotificaciones(req.session.id_usuario)
    var cantidad_notificaciones = await notificacionesModel.getCantidadNotificacionesNoVistas(req.session.id_usuario); 
    console.log("notificacion tiene " + notificacion)
    res.render('admin/notificaciones', {
        layout: 'admin/layout',
        usuario: req.session.nombre,
        notificacion,
        cantidad_notificaciones   
    })
});   

router.get('/nuevaNotificacion', async function (req,res,next) {

    var notificacion = await notificacionesModel.getNotificaciones(req.session.id_usuario)
    var cantidad_notificaciones = await notificacionesModel.getCantidadNotificacionesNoVistas(req.session.id_usuario); 

        let usuarios = await usuariosModel.getUsuarios();
        console.log("usuarios en nueva notificacion ", usuarios);
        res.render('admin/nuevaNotificacion',{
            layout:'admin/layout',
            usuario:req.session.nombre,
            root:req.session.root,
            usuarios,
            notificacion,
            cantidad_notificaciones
            });
     
});

// insert

router.post('/nuevaNotificacion', async (req, res, next) => {

    let usuarios = await usuariosModel.getUsuarios();

    try {

        let obj = {
            notificacion: req.body.notificacion ,
            estado: 'no_vista' ,
            id_usuario: req.body.id_usuario
        }
        console.log("obj tiene", obj)
        if (req.body.notificacion) {
            await notificacionesModel.insertNotificacion(obj)
            res.render('admin/nuevaNotificacion', {
                layout: 'admin/layout',
                error: false,
                exito: true,
                usuario: req.session.nombre,
                usuarios,
                root: req.session.root,
                message: "Notificacion agregada con exito"
            })
            // res.redirect('/admin/notificaciones')
        } else {
            res.render('admin/nuevaNotificacion', {
                layout: 'admin/layout',
                error: true,
                usuario: req.session.nombre,
                usuarios,
                root: req.session.root,
                message: "Todos los campos son requeridos"
            });
        }
    } catch (error) {
        console.log(error);
        res.render('admin/nuevaNotificacion', {
            layout: 'admin/layout',
            error: true,
            usuario: req.session.nombre,
            message: "no se cargo notificacion",
            usuarios,
            root: req.session.root
        });
    }
});


router.get('/ver/:id', async function (req,res,next) {

    var notificacion = await notificacionesModel.getNotificaciones(req.session.id_usuario);
    var notificacion_mostrar = await notificacionesModel.getNotificacion(req.session.id_usuario,req.params.id);
    var cantidad_notificaciones = await notificacionesModel.getCantidadNotificacionesNoVistas(req.session.id_usuario);   


    await notificacionesModel.marcarNotificacionLeida(req.params.id, req.session.id_usuario);
    res.render('admin/notificaciones', {
        layout: 'admin/layout',
        usuario: req.session.nombre,
        cantidad_notificaciones,
        notificacion,
        notificacion_mostrar  
    })
});

router.get('/notificacionesWeb', async function (req,res,next){

    var notificacion_mostrar = await notificacionesModel.getNotificacion(req.session.id_usuario,req.params.id);
    var cantidad_notificaciones = await notificacionesModel.getCantidadNotificacionesNoVistas(req.session.id_usuario);   

    var notificacionesWeb = await notificacionesModel.getOpinionesWeb();
    res.render('admin/notificacionesWeb',{
        layout: 'admin/layout',
        usuario: req.session.nombre,
        cantidad_notificaciones,
        root: req.session.root,
        notificacionesWeb,
        notificacion_mostrar
    })
})

/* Para eliminar */

router.get('/eliminar/:id', async (req, res, next) => {
    var id = req.params.id;
    await notificacionesModel.deleteNotificacionById(id);
    res.redirect('/admin/notificaciones/notificacionesWeb');
});


module.exports = router;