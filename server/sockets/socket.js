const { io } = require('../server');
const { Usuarios } = require('../classes/usuarios');
const { crearMensaje } = require('../utilidades/utilidades');

/* leemos el dato de usuario.js el metodo  */
const usuarios = new Usuarios();

//Entra al chat
io.on('connection', (client) => {
    //Recibe de socket-chat.js
    //escuchamos el usuario
    client.on('entrarChat', (data, callback) => {

        //Validacion si no viene el nombre
        if (!data.nombre || !data.sala) {
            return callback({
                error: true,
                mensaje: 'El nombre/sala es necesario'
            });
        }

        //Conectar a una sala con el usuario
        client.join(data.sala);

        /* para agregar persona necesitamos el id y el nombre del usuario hacemos referencia a la conexion 
        client que quiere decir que es la persona que esta conectada */
        usuarios.agregarPersona(client.id, data.nombre, data.sala);

        /* Este evento se va a disparar cada vez que una persona entra o sale del chat */
        client.broadcast.to(data.sala).emit('listaPersona', usuarios.getPersonasPorSala(data.sala));
        client.broadcast.to(data.sala).emit('crearMensaje', crearMensaje('Administrador', `${data.nombre} se unió`))
        callback(usuarios.getPersonasPorSala(data.sala));

    });

    /* En la data viene toda la informacion  emitir el mensaje a todos */
    client.on('crearMensaje', (data, callback) => {
        // aqui ya tenemos el nombre y toda la informacion del usuario
        let persona = usuarios.getPersona (client.id);
        let mensaje = crearMensaje(persona.nombre, data.mensaje);
        client.broadcast.to(persona.sala).emit('crearMensaje', mensaje);
        
        callback(mensaje);
    });

    /* Ejecutar limpieza */
    client.on('disconnect', () => {
        let personaBorrara = usuarios.borrarPersona(client.id);

        /* Si una persona se desconecta emitimos un evento llamado prodcast */
        client.broadcast.to(personaBorrara.sala).emit('crearMensaje', crearMensaje('Administrador', `${personaBorrara.nombre} salió`))
        client.broadcast.to(personaBorrara.sala).emit('listaPersona', usuarios.getPersonasPorSala(personaBorrara.sala));
    });

    /* Mensajes privados */
    client.on('mensajePrivado', data =>{

        /* Debo saber que persona lo esta enviando */
        let persona = usuarios.getPersona(client.id)

        /* Enviar un mensaje a todas las personas conectadas */
        /* brodcast.to sirve para enviar el mensaje para tal persona ejemplo */
        client.broadcast.to(data.para).emit('mensajePrivado', crearMensaje(persona.nombre, data.mensaje));
    });
});