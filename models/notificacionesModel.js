var pool = require('./bd');

async function getNotificaciones(id) {
    var query = "SELECT * From notificaciones where id_usuario = ? AND estado <> 'web'";
    var rows = await pool.query(query, [id]);
    return rows;
}

async function getCantidadNotificacionesNoVistas(id) {
    try {

        var query = "SELECT count(id_notificacion) AS cantidad_notificaciones FROM notificaciones WHERE id_usuario = ? AND estado = 'no_vista'";
        var rows = await pool.query(query, [id]);
        return rows[0].cantidad_notificaciones;
    } catch (error) {
        console.log(error);
        throw error;
    }

}

async function getNotificacion(id_usuario, id_notificacion) {

    var query = "SELECT * FROM notificaciones WHERE id_usuario = ? AND id_notificacion = ?";
    var rows = await pool.query(query, [id_usuario, id_notificacion])
    console.log(rows);
    return rows;
}

async function getOpinionesWeb() {
    var query = "SELECT * FROM notificaciones WHERE estado = 'web'";
    var rows = await pool.query(query);
    // console.log(rows);
    return rows
}

async function insertNotificacionWeb(opinion) {
    let obj = {
        estado: 'web',
        notificacion: opinion,
        id_usuario: 1
    }

    try {
        var query = "INSERT INTO notificaciones set ?";
        var rows = await pool.query(query, [obj])
        return rows;
    } catch (error) {
        console.log(error);
        throw error
    } // cierra catch
}

async function marcarNotificacionLeida(id_notificacion, id_usuario) {
    try {
        var query = "UPDATE notificaciones set estado = 'vista' WHERE id_notificacion = ?  AND id_usuario = ?";
        var rows = await pool.query(query, [id_notificacion, id_usuario]);
        return rows;
    } catch (error) {
        console.log(error);
        throw error
    }
}

async function insertNotificacion(obj) {
    try {
        var query = "INSERT INTO notificaciones set ?";
        var rows = await pool.query(query, [obj])
    }
    catch (error) {
        console.log(error)
        throw error;
    }
}

async function deleteNotificacionById(id) {

    var query = 'DELETE FROM notificaciones WHERE id_notificacion = ? ';
    var rows = await pool.query(query, [id]);
    return rows

}



module.exports = {
    getNotificaciones,
    getOpinionesWeb,
    insertNotificacionWeb,
    getNotificacion,
    marcarNotificacionLeida,
    getCantidadNotificacionesNoVistas,
    insertNotificacion,
    deleteNotificacionById
}
