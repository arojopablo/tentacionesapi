var pool = require ('./bd');
var md5 = require('md5');


 // listar
 async function getClientes() {
    var query="select * from clientes";
    var rows = await pool.query(query);
    return rows
}

// seleccionar cliente por id

async function getClienteById(id) {
    try {
        var query = "SELECT * FROM clientes WHERE id_cliente = ? limit 1";
        var rows = await pool.query(query, [id]);
        return rows[0]; 
    }catch (error) {
        console.log(error);
    }
 }

// insert
async function insertCliente(obj) {
    try {       
        var query = "INSERT INTO clientes set ?";
        var rows = await pool.query(query, [obj])
        return rows;
    } catch(error) {
        console.log(error);
        throw error
    } // cierra catch
} // cierra insert


async function deleteClienteById(id) {
    var query = 'DELETE FROM clientes WHERE id_cliente = ? ';
    var rows = await pool.query(query,[id]);
    return rows 
}

/* para modificar > traer una novedad por id */
async function getClienteById(id) {
    var query = "SELECT * FROM clientes WHERE id_cliente = ?";
    var rows = await pool.query(query, [id]);
    return rows[0];
}

async function modificarClienteById(obj,id) {
    try {
        var query = "UPDATE clientes SET ? WHERE id_cliente = ?";
        var rows = await pool.query(query, [obj,id]);
        return rows;
    }
    catch ( error) {
        throw error;
    }
}

module.exports = { getClientes, insertCliente, getClienteById, deleteClienteById, getClienteById, modificarClienteById }
 