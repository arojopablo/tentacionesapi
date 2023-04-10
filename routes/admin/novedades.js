var express = require('express');
var router = express.Router();
var novedadesModel = require('./../../models/novedadesModel');
var notificacionesModel = require('./../../models/notificacionesModel');
var util = require('util');
var cloudinary = require('cloudinary').v2;
const uploader = util.promisify(cloudinary.uploader.upload);
const destroy = util.promisify(cloudinary.uploader.destroy);

// este archivo es el controlador de novedades

router.get('/', async function (req, res, next) {

    var novedades = await novedadesModel.getNovedades();
    var notificacion = await notificacionesModel.getNotificaciones(req.session.id_usuario);
    var cantidad_notificaciones = await notificacionesModel.getCantidadNotificacionesNoVistas(req.session.id_usuario);   

    // console.log(novedades);
    novedades = novedades.map(novedad => {
        if(novedad.img_id) {
            const imagen = cloudinary.image(novedad.img_id,{
                width : 100,
                height : 100,
                crop : 'fill'  // para que se adapte al tamaño
            });
            return {
                ...novedad,
                imagen 
            }
        } else {
            return {
                ...novedad,
                imagen: ''
            }
        }        
    });
    console.log(novedades);
    res.render('admin/novedades', {
        layout: 'admin/layout',
        usuario: req.session.nombre,
        notificacion,
        cantidad_notificaciones,
        novedades
    });
});


router.get('/agregar', function (req, res, next) {
    res.render('admin/nuevaNovedad', {
        layout: 'admin/layout',
        usuario: req.session.nombre
    });
});


router.post('/agregar', async (req, res, next) => {
    try {

        var img_id = "";
        if (req.files && Object.keys(req.files).length > 0 ) {
            imagen = req.files.imagen;
            img_id = (await uploader(imagen.tempFilePath)).public_id;
        }

        // console.log(req.body);

        if (req.body.titulo != "" && req.body.subtitulo != "" && req.body.cuerpo != "") {
            await novedadesModel.insertNovedad({
                ...req.body,
                img_id
            });

            res.redirect('/admin/novedades')
        } else {
            res.render('admin/nuevaNovedad', {
                layout: 'admin/layout',
                error: true,
                usuario: req.session.nombre,
                message: "Todos los campos son requeridos"
            });
        }
    } catch (error) {
        console.log(error);
        res.render('admin/nuevaNovedad', {
            layout: 'admin/layout',
            error: true,
            message: "no se cargo novedad"
        });
    }
});

/* Para eliminar */

router.get('/eliminar/:id', async (req, res, next) => {

    var id = req.params.id;
    let novedad = await novedadesModel.getNovedadById(id);
    if (novedad.img_id) {
        await(destroy(novedad.img_id));
    }

    await novedadesModel.deleteNovedadesdById(id);
    res.redirect('/admin/novedades');
});

// Para modificar necesito traer la novedad por id
router.get('/modificar/:id', async (req, res, next) => {
    var id = req.params.id;
    console.log(req.params.id);

    var novedad = await novedadesModel.getNovedadById(id);
    console.log(req.params.id);
    console.log(novedad);
    res.render('admin/modificarNovedad', {
        layout: 'admin/layout',
        usuario: req.session.nombre,
        novedad
    });
});

// modificar (update)

router.post('/modificar', async (req, res, next) => {
    try {

        let img_id = req.body.img_original;
        let borrar_img_vieja = false;
        if(req.body.img_delete == 1) {
            img_id = null;
            borrar_img_vieja = true;
        } else {
            if (req.files && Object.keys(req.files).length > 0 ) {
                imagen = req.files.imagen;
                img_id = (await uploader(imagen.tempFilePath)).public_id;
                borrar_img_vieja = true;   
            }
        } 
        if (borrar_img_vieja && req.body.img_original) {
            await (destroy(req.body.img_original));
        }

        var obj = {
            titulo: req.body.titulo,
            subtitulo: req.body.subtitulo,
            cuerpo: req.body.cuerpo,
            img_id
        }
        // console.log(obj);

        await novedadesModel.modificarNovedadById(obj, req.body.id);
        res.redirect('/admin/novedades');
    }
    catch (error) {
        console.log(error)
        res.render('admin/modificarNovedad', {
            layout: 'admin/layout',
            usuario: req.session.nombre,
            error: true,
            message: 'No se modifico la novedad'
        })
    }
});

module.exports = router;