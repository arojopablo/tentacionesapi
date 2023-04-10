var pool = require ('./bd');
var md5 = require('md5');

//chequear login
async function getUserByUserNameAndPassword(user, password) {
    try {
        var query = "SELECT * FROM usuarios WHERE usuario = ? and password = ? limit 1";
        var rows = await pool.query(query, [user, md5(password)]);
        return rows[0]; 
    }catch (error) {
        console.log(error);
    }
 }

 // listar
 async function getUsuarios() {
    var query="select * from usuarios";
    var rows = await pool.query(query);
    return rows
}

// insert
async function insertUsuario(obj) {
    try {
        var usuario=obj.usuario;
        var rol=obj.rol;
        var password=md5(obj.password);
        var query = "INSERT INTO usuarios set usuario =  ?, rol = ?, password = ?";
        var rows = await pool.query(query, [usuario,rol,password])
        return rows;
    } catch(error) {
        console.log(error);
        throw error
    } // cierra catch
} // cierra insert

async function deleteusuariosdById(id) {
    var query = 'DELETE FROM usuarios WHERE id = ? ';
    var rows = await pool.query(query,[id]);
    return rows 
}

module.exports = { getUserByUserNameAndPassword, getUsuarios, insertUsuario, deleteusuariosdById }
 