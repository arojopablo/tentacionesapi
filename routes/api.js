var express = require('express');
var router = express.Router();
var novedadesModel = require('./../models/novedadesModel');
var productosModel = require('./../models/productosModel');
var ofertasModel = require('./../models/ofertasModel');
var serviciosModel = require('./../models/serviciosModel');
var ventasModel = require('./../models/ventasModel');
var notificacionesModel = require('./../models/notificacionesModel');

var nodemailer = require('nodemailer');

var util = require('util');
const { timingSafeEqual } = require('crypto');
var cloudinary = require('cloudinary').v2;
const uploader = util.promisify(cloudinary.uploader.upload);
const destroy = util.promisify(cloudinary.uploader.destroy);

router.get('/novedades', async function (req, res, next) {

    var novedades = await novedadesModel.getNovedades();
    novedades = novedades.map(novedad => {
        if(novedad.img_id) {
            const imagen = cloudinary.url(novedad.img_id,{
                width : 640,
                height : 640,
                crop : 'fill'  // para que se adapte al tamaño
            });
            console.log(imagen);
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
   
    res.json(novedades); // Paso a JSON para mandar al frontend con react.
});

// get de productos

router.get('/productos', async function (req, res, next) {

    console.log("req.query tiene:" + req.query.termino);
    if ((req.query.termino == undefined) || (req.query == null)) {
        var productos = await productosModel.getAllProductos();
    }else {
        var productos = await productosModel.buscarProducto(req.query.termino)
        // console.log(productos);
        // console.log("esta condicion");
    }    
    productos = productos.map(producto => {
        if(producto.imagen) {
            const imagen = cloudinary.url(producto.imagen,{
                width : 640,
                height : 640,
                crop : 'fill'  // para que se adapte al tamaño
            });
            // console.log(imagen);
            return {
                ...producto,
                imagen                 
            }
        } else {
            return {
                ...producto,
                imagen: ''
            }
        }        
    });

    res.json(productos); // Paso a JSON para mandar al frontend con react.
    });

// get par alistar ofertas en frontend
router.get('/ofertas',async function (req,res,next) {

    var ofertas = await ofertasModel.getOfertas();       
    res.json(ofertas);
});

// get para listar servicios en frontend

router.get('/servicios', async function (req, res, next) {

    var servicios = await serviciosModel.getServicios();
    servicios = servicios.map(servicio => {
        if(servicio.img_id) {
            console.log("se cunmple la condicion de imagen");
            const imagen = cloudinary.url(servicio.img_id,{
                width : 480,
                height : 480,
                crop : 'fill'  // para que se adapte al tamaño
            });
           console.log(imagen);
            return {
                ...servicio,
                imagen                 
            }
        } else {
            return {
                ...servicio,
                imagen: ''
            }
        }        
    });
  
    res.json(servicios); // Paso a JSON para mandar al frontend con react.
    // console.log(servicios);
});


router.get('/operaciones', async function (req, res, next) {
    //  var id = req.body.id;
    // var id = req.id;
    console.log(req.query.id);
    console.log("el id es");
    console.log(req.params.id);
   
    var ventas = await ventasModel.buscarVenta(req.query.id);
    // var ventas = await ventasModel.getVentas();

    // console.log(ventas);
 
    ventas = ventas.map(venta => {
      
     if(venta.venta_estado == 'finalizado')  {
         const estado = true;
         return {
             ...venta,
             estado 
         }
     } else {
         return {
             ...venta,
             estado: false
         }
     }        
 });
 


     res.json(ventas);
    //  console.log(ventas);
 });

 router.post('/contacto', async (req,res) => {

    //  console.log(req);  
     let mensaje = "";

     if (req.body.nombre == undefined && req.body.telefono == undefined && req.body.mensaje == undefined) {
        mensaje = `Se contactaron a travez de la Web y quieren informacion a este correo: 
        ${req.body.email}`;
     } else {
        mensaje = `${req.body.nombre} Se contacto a travez de la Web y quire mas informacion a este correo: 
        ${req.body.email} <br> Ademas hizo el siguiente comentario: ${req.body.mensaje} 
        <br> Su tel es: ${req.body.telefono}`;
     }  

     const mail = {
         to: 'arojopablo@gmail.com',
         subjet: 'Contacto Web',
         html: mensaje
     }

     const transport = nodemailer.createTransport({
         host: process.env.SMTP_HOST,
         port: process.env.SMTP_PORT,
         auth: {
             user: process.env.SMTP_USER,
             pass: process.env.SMTP_PASS,
         }
     }); // cierra transp

     await transport.sendMail(mail)

     res.status(201).json({
         error:false,
         message: 'Mensaje Enviado'
     })

 }); // cierra post/api

 router.get('/opiniones', async(req,res) => {
     var opiniones = await notificacionesModel.getOpinionesWeb();
     res.json(opiniones);
 })

 router.post('/opiniones', async(req,res) => {
    //  console.log(req);
     let opinion = req.body.opinion;
     console.log(opinion);
     await notificacionesModel.insertNotificacionWeb(opinion);
 })

// paginar:

router.get('/pagina', async (req, res, next) => {
    try {
      let cantidad_registros = await productosModel.getCantidad();
      // console.log("cantidad de registros: " + cantidad_registros);
      // console.log(data); 
    //   console.log("vengo a pagina");
      if (cantidad_registros != undefined) {
        cantidad_paginas = Math.ceil(cantidad_registros / 15); // redondeo hacia arriba cantidad de paginas    
      }
      var paginas = [{pag:1}];
      for (let i=2;i<=cantidad_paginas;i++) {
        paginas[i]=({pag:i});
        // console.log("i tiene:" + i);
      }
  
        var offset = (req.query.pagina-1) * 15;
  
        // var data = await productosModel.getProductos(offset);
        var data = await productosModel.getProductos(offset);   
      
      // console.log(cantidad_paginas);   
      // console.log("array tiene",paginas);
      data = data.map(producto => {
        if(producto.imagen) {
            console.log("producto con imagen");
            const img = cloudinary.image(producto.imagen,{
                width : 100,
                height : 100,
                crop : 'fill'  // para que se adapte al tamaño
            });
            return {
                ...producto,
                img 
            }
        } else {
            return {
                ...producto,
                img: ''
            }
        }    

    });
  
      
    //   if (data != undefined) {
        
    //     res.render('admin/productos', {
    //       layout: 'admin/layout',
    //       data: data,
    //       usuario: req.session.nombre,
    //       notificacion: req.session.notificacion,
    //       paginas      
    //     });
    //   } else {
    //     res.render('admin/login', {
    //       layout: 'admin/layout',
    //       error: true
    //     });
    //   }
    } catch (error) {
      console.log(error);
    }
    res.json(data);

  });
  
  


module.exports = router;
