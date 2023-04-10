var pool = require('./bd');

// listar
async function getNovedades() {
    var query="select * from novedades";
    var rows = await pool.query(query);
    return rows
}


// insert
async function insertNovedad(obj) {
    try {
        var query = "INSERT INTO novedades set ?";
        var rows = await pool.query(query, [obj])
        return rows;
    } catch(error) {
        console.log(error);
        throw error
    } // cierra catch
} // cierra insert


async function deleteNovedadesdById(id) {
    var query = 'DELETE FROM novedades WHERE id = ? ';
    var rows = await pool.query(query,[id]);
    return rows 
}

/* para modificar > traer una novedad por id */
async function getNovedadById(id) {
    var query = "SELECT * FROM novedades WHERE id = ?";
    var rows = await pool.query(query, [id]);
    return rows[0];
}

async function modificarNovedadById(obj,id) {
    try {
        var query = "UPDATE novedades SET ? WHERE id = ?";
        var rows = await pool.query(query, [obj,id]);
        return rows;
    }
    catch ( error) {
        throw error;
    }
}

module.exports = { getNovedades, insertNovedad, deleteNovedadesdById, getNovedadById, modificarNovedadById }





