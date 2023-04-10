var pool = require('./bd');

// listar
async function getServicios() {
    var query="select * from servicios";
    var rows = await pool.query(query);
    return rows
}


// insert
async function insertServicio(obj) {
    try {
        var query = "INSERT INTO servicios set ?";
        var rows = await pool.query(query, [obj])
        return rows;
    } catch(error) {
        console.log(error);
        throw error
    } // cierra catch
} // cierra insert


async function deleteServiciosById(id) {
    var query = 'DELETE FROM servicios WHERE id_servicio = ? ';
    var rows = await pool.query(query,[id]);
    return rows 
}

/* para modificar > traer una servicio por id */
async function getServiciosById(id) {
    var query = "SELECT * FROM servicios WHERE id_servicio = ?";
    var rows = await pool.query(query, [id]);
    return rows[0];
}

async function modificarServiciosById(obj,id) {
    try {
        var query = "UPDATE servicios SET ? WHERE id_servicio = ?";
        var rows = await pool.query(query, [obj,id]);
        return rows;
    }
    catch ( error) {
        throw error;
    }
}


module.exports = { getServicios, insertServicio, deleteServiciosById, getServiciosById, modificarServiciosById }
