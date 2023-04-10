var pool = require('./bd');

// listar
async function getOfertas() {
    var query="select * from ofertas";
    var rows = await pool.query(query);
    return rows
}


// insert
async function insertOferta(obj) {
    try {
        var query = "INSERT INTO ofertas set ?";
        var rows = await pool.query(query, [obj])
        return rows;
    } catch(error) {
        console.log(error);
        throw error
    } // cierra catch
} // cierra insert


async function deleteOfertasdById(id) {
    var query = 'DELETE FROM ofertas WHERE id_oferta = ? ';
    var rows = await pool.query(query,[id]);
    return rows 
}

/* para modificar > traer una novedad por id */
async function getOfertaById(id) {
    var query = "SELECT * FROM ofertas WHERE id_oferta = ?";
    var rows = await pool.query(query, [id]);
    return rows[0];
}

async function modificarOfertaById(obj,id) {
    try {
        console.log(obj);
        var query = "UPDATE ofertas SET ? WHERE id_oferta = ?";
        var rows = await pool.query(query, [obj,id]);
        return rows;
    }
    catch ( error) {
        throw error;
    }
}


module.exports = { getOfertas, insertOferta, deleteOfertasdById, getOfertaById, modificarOfertaById }