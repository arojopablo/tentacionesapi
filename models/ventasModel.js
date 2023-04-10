var pool = require('./bd');

// listar
async function getVentas() {
    var query = "SELECT ventas.id_venta as id_venta, ventas.id_cliente as id_cliente, clientes.apellido as cliente_apellido, clientes.nombre as cliente_nombre, clientes.direccion as cliente_direccion,productos.nombre as producto_nombre,ventas.estado as venta_estado, ventas.fecha as venta_fecha FROM (ventas LEFT JOIN productos ON ventas.id_producto = productos.id_producto) JOIN clientes on clientes.id_cliente = ventas.id_cliente";
    var rows = await pool.query(query);
    return rows
}


// insert
async function insertVenta(obj) {
    try {        
        let fecha = new Date();
        let estado = 'procesando'; // cuando doy de alta una venta el estado es procesando hasta que sea modifiacado. 
        var query = "INSERT INTO ventas set ?, fecha = ?, estado = ?";
        var rows = await pool.query(query, [obj, fecha, estado])
        return rows;
    } catch(error) {
        console.log(error);
        throw error
    } // cierra catch
} // cierra insert


//filtrar - buscar 
async function buscarVenta(termino) {
    try {
        var query = "SELECT ventas.id_venta as id_venta, ventas.id_cliente as id_cliente, clientes.apellido as cliente_apellido, clientes.nombre as cliente_nombre, clientes.direccion as cliente_direccion,productos.nombre as producto_nombre,ventas.estado as venta_estado, ventas.fecha as venta_fecha FROM (ventas LEFT JOIN productos ON ventas.id_producto = productos.id_producto) JOIN clientes on clientes.id_cliente = ventas.id_cliente WHERE ventas.id_cliente = ?";
        var rows = await pool.query(query, [termino]);
        return rows
    } catch (error) {
        console.log(error);
    }
}

async function buscarVentaById(id) {

    try {
        var query = "SELECT * FROM ventas WHERE id_venta = ? ";
        var rows = await pool.query(query, [id]);
        return rows[0];;

    } catch (error) {
        console.log(error);
    }

}

async function modificarVentaById(obj,id) {
    console.log(obj);
    console.log(id);
    try {
        var query = "UPDATE ventas SET ? WHERE id_venta = ?";
        var rows = await pool.query(query,[obj,id]);
        console.log(rows);
        return rows; 
    } catch (error) {
        console.log(error);
    }
}

module.exports = { getVentas, insertVenta, buscarVenta, buscarVentaById, modificarVentaById }