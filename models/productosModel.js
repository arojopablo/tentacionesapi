var pool = require('./bd');

// listar con paginado
async function getProductos(pagina) {
    try {
        var query = "SELECT * FROM productos where status='active' ORDER by id_producto LIMIT ?,15 ";
        var rows = await pool.query(query,pagina);
        return rows;
    } catch (error) {
        console.log(error);
    }
}

// listar todo
async function getAllProductos(pagina) {
    try {
        var query = "SELECT * FROM productos where status='active'";
        var rows = await pool.query(query);
        return rows;
    } catch (error) {
        console.log(error);
    }
}


//filtrar
async function buscarProducto(termino) {
    try {
        var query = "SELECT * from PRODUCTOS WHERE status = 'active' AND (nombre LIKE ? OR descripcion LIKE ? OR marca LIKE ?)";
        var rows = await pool.query(query, ['%' + termino + '%', '%' + termino + '%', '%' + termino + '%']);
        return rows
    } catch (error) {
        console.log(error);
    }
}



// insertar
async function insertProducto(obj) {
   
    try {
        var query = "INSERT INTO productos set ?";
        var rows = await pool.query(query, [obj])
        return rows;
    } catch(error) {
        console.log(error);
        throw error
    } // cierra catch
    
    // try {
    //     pool.query("INSERT INTO productos set ? ", [nombre, descripcion, precio, marca, imagen]).then(function (resultados) {
    //         console.log(resultados);
    //     })
    //     if (resultados != undefined) {
    //         return resultados;
    //     }
    // } catch (error) {
    //     console.log(error);
    // }

}

/* para modificar > traer un producto por id */
async function getProductoById(id) {
    var query = "SELECT * FROM productos WHERE id_producto = ?";
    var rows = await pool.query(query, [id]);
    return rows[0];
}


/* Para eliminar */
async function deleteproductodById(id) {
    const status =  {
        status : 'removed',
        imagen : null
    };
    var query = 'UPDATE productos SET ? WHERE id_producto = ? ';
    var rows = await pool.query(query,[status,id]);
    return rows 
}

// modificar producto
async function modificarProdocutoById(obj,id) {
    try {
        var query = "UPDATE productos SET ? WHERE id_producto = ?";
        var rows = await pool.query(query, [obj,id]);
        return rows;
    }
    catch ( error) {
        throw error;
    }
}

//devolver cantidad
async function getCantidad() {
    try {
        var query = "SELECT count(id_producto) as cantidad from productos where status = 'active'";
        var rows = await pool.query(query);
        // console.log("query devuelve:" , rows[0].cantidad);
        return rows[0].cantidad;
    }
    catch (error) {
        throw error;
    }
}

module.exports = { getProductos, insertProducto, buscarProducto, deleteproductodById, modificarProdocutoById, getProductoById, getCantidad, getAllProductos }
