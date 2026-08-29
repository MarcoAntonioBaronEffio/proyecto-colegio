
// 🏫 RESPUESTRA DE COLEGIO PARA REGISTRAR UN ADMINISTRADOR

// 📥 SchoolForAdministratorRegistrationResponse
// 👉 Esta clase representa la información de un colegio que será enviada como respuesta desde el backend

// 📌 En nuestro proyecto utilizamos la palabra "Response" porque:
// 👉 Los DTO los estamos utilizando principalmente para representar datos que llegan desde el cliente hacia el backend
// 👉 Mientras que esta clase representa datos que salen del backend y serán enviados hacia el cliente
//
// 📌 Esta respuesta será utilizada específicamente cuando necesitemos mostrar la lista de colegios disponibles
//    al momento de registrar un nuevo administrador.
//
// 🔥 No necesitaremos enviar toda la información del colegio
// 👉 Solamente enviaremos los datos necesarios para poder identificarlo y mostrarlo en una lista de selección:
//
// ✅ id -> Permitirá identificar qué colegio seleccionó el usuario
// ✅ name -> Permitirá mostrar el nombre del colegio en la interfaz
export class SchoolForAdministratorRegistrationResponse {


    // 🆔 id
    // 👉 Identificador único del colegio
    //
    // 📌 Este valor será utilizando posteriormente cuando el usuario seleccione un colegio para registrar 
    //   al nuevo administrador.
    //
    // 🔥 Por ejemplo: id = "550e8400-e29b-41d4-a716-446655440000"
    id! : string;

    // 🏫 name
    // 👉 Nombre del colegio
    //
    // 📌 Este dato será mostrado al usuario para que pueda reconocer y seleccionar fácilmente el colegio correspondiente
    //
    // 🔥 Por ejemplo: name : "I.E. San Joaquin"
    name! : string;


}