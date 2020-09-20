//Metodos para usuarios

// Se encargar de todos los usuarios conectados
class Usuarios {
    
    // Siempre debe ser vacio 
    constructor() {
        this.personas = [];
    }
    
    //Metodo agregar personas Permite agregar una persona al chat
    agregarPersona(id, nombre,sala) {
        let persona = { id, nombre,sala };
        this.personas.push(persona);
        return this.personas;
    }

    /* El filter genera un nuevo arreglo por lo cual siempre necesito la primera posición */
    getPersona(id) {
        let persona = this.personas.filter(persona => persona.id === id)[0]; /* => esto para que siempre sea un unico registro */
        return persona;
    }

    /* Obtener a todas las personas */
    getPersonas(){
        return this.personas;
    }

    getPersonasPorSala(sala){
        let personasEnSala = this.personas.filter(persona => persona.sala === sala);
        return personasEnSala;
    }

    /* Eliminar de un arreglo de personas es decir se desconecto etc.. */
    borrarPersona(id){
        //Debemos identificar la persona que voy a borrar
        let personaBorrada = this.getPersona(id);
        
        //Aqui reemplazo el arreglo actual de las personas
        //Tal persona se fue del chat
        this.personas = this.personas.filter(persona => persona.id !== id);

        /* De esta forma sabemos que persona borre del arreglo */
        return personaBorrada;
    }
}

module.exports = {
    Usuarios
}