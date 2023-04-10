var express = require('express');
var router = express.Router();
var ventasModel = require('./../../models/ventasModel');
var productosModel = require('./../../models/productosModel');
var clientesModel = require('./../../models/clientesModel');
var notificacionesModel = require('./../../models/notificacionesModel');




/* GET home page. */
router.get('/', async function (req, res, next) {

  var clientes = await clientesModel.getClientes();
  var notificacion = await notificacionesModel.getNotificaciones(req.session.id_usuario);
  var cantidad_notificaciones = await notificacionesModel.getCantidadNotificacionesNoVistas(req.session.id_usuario);   


  // var productos = await productosModel.getProductos();
  var productos = await productosModel.getAllProductos();
  res.render('admin/ventas', {
    layout: 'admin/layout',
    usuario: req.session.nombre,
    notificacion,
    cantidad_notificaciones,
    clientes,
    productos
  });
});

// ver reportes
router.get('/reporteVentas', async function (req, res, next) {

   var ventas = await ventasModel.getVentas();
   
   var notificacion = await notificacionesModel.getNotificaciones(req.session.id_usuario);
   var cantidad_notificaciones = await notificacionesModel.getCantidadNotificacionesNoVistas(req.session.id_usuario);   

  //  console.log(ventas);

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

    // console.log(ventas);
    req.session.notificacion = ""; // borro notificaciones porque ya entro a leerlas .
    res.render('admin/reporteVentas', {
        layout: 'admin/layout',
        usuario: req.session.nombre,
        notificacion,
        cantidad_notificaciones,
        ventas
    });
});


// Insertar venta
router.post('/agregar', async (req, res, next) => {
  try {
    // console.log("imprimo req.body");
    // console.log(req.body);
    // var cliente = clientesModel.getClienteById(id_cliente);
    if (req.body.id_cliente != "" && req.body.id_producto != "" && req.body.cantidad != "") {
      await ventasModel.insertVenta(req.body);
    //  res.redirect('/admin/ventas');
    var clientes = await clientesModel.getClientes();
    // var productos = await productosModel.getProductos();
    var productos = await productosModel.getAllProductos();

      res.render('admin/ventas', {
      layout: 'admin/layout',
      exito: true,
      usuario: req.session.nombre,
      clientes,
      productos,
      message: "Producto cargado con exito"
     });
    } else {
      var clientes = await clientesModel.getClientes();
      var productos = await productosModel.getProductos();
      res.render('admin/ventas', {
        layout: 'admin/layout',
        error: true,
        usuario: req.session.nombre,
        clientes,
        productos,
        message: "Todos los campos son requeridos"
      });
    }
  } catch (error) {
    var clientes = await clientesModel.getClientes();
    var productos = await productosModel.getProductos();
    console.log(error);
    res.render('admin/ventas', {
      layout: 'admin/layout',
      error: true,
      usuario: req.session.nombre,
      clientes,
      productos,
      message: "no se cargo Venta"
    });
  }
});


router.post('/buscarProducto', async (req,res,netxt) => {

  try {
      var termino = req.body.buscar;
      var clientes = await clientesModel.getClientes();
      var productos = await productosModel.buscarProducto(termino);
      if (productos != undefined) {
        res.render('admin/ventas',{
          layout: 'admin/layout',
          usuario: req.session.usuario,
          productos,
          clientes
        })
      }
      else {
        res.redirect('admin/ventas');
      }

  } catch (error) {
    console.log(error);
  }
});



//buscar venta
router.post('/buscar', async (req, res, next) => {
  try {
    var termino = req.body.buscar
    var data = await ventasModel.buscarVenta(termino); 
    
    data = data.map(venta => {
      
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
 

    // console.log(data);
    if (data != undefined) {
      res.render('admin/reporteVentas', {
        layout: 'admin/layout',
        ventas: data,
        usuario: req.session.nombre,        
      });
    } else {
      res.render('admin/login', {          //revisar esto! porque vuelvo a login?
        layout: 'admin/layout',
        error: true
      });
    }
  } catch (error) {
    console.log(error);
  }
});

// Reporte de ventas con nombre de cliente y articulo comprado
// SELECT * FROM (ventas LEFT JOIN productos ON ventas.id_producto = productos.id_producto) join clientes on clientes.id_cliente = ventas.id_cliente;
// Todas las ventas de id = 2 "norma carletti" (para buscar por id_cliente en campo de texto y obtener las ventas de ese cliente)
// SELECT * FROM ventas LEFT JOIN productos ON ventas.id_producto = productos.id_producto JOIN clientes ON clientes.id_cliente = ventas.id_cliente WHERE ventas.id_cliente = 2;

// Para modificar necesito traer el id de venta (Solo modifico el estado por ahora)
router.get('/modificar/:id', async (req, res, next) => {

  var id = req.params.id;
  console.log("id de venta");
  console.log(req.params.id);

  var venta = await ventasModel.buscarVentaById(id);
  console.log(venta);
  // console.log(req.params.id);
  res.render('admin/modificarVenta', {
      layout: 'admin/layout',
      usuario: req.session.nombre,
      venta
  });
});

// modificar (update)

router.post('/modificar', async (req, res, next) => {
  try {

      let estado = req.body.estado;
      
      var obj = {
          estado : estado
      }
       console.log(obj);

      await ventasModel.modificarVentaById(obj, req.body.id);
      res.redirect('/admin/ventas');
  }
  catch (error) {
      console.log(error)
      res.render('admin/modificarVenta', {
          layout: 'admin/layout',
          usuario: req.session.nombre,
          error: true,
          message: 'No se modifico la venta'
      })
  }
});



module.exports = router;