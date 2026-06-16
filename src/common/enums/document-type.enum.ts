// 📄 Tipos de documento admitidos por el sistema

// 👉 Esto permite registrar estudiantes, administradores, docentes, apoderados:
// ✅ Peruanos (DNI)
// ✅ Extranjeros con Pasaporte
// ✅ Extranjeros con Carnét de extranjería
// 🧠 Mucho más flexible que tener solamente un campo "dni"
export enum DocumentType{

    // 🇵🇪 Documento Nacional de Identidad
    DNI = 'DNI',

    // 🌎 Pasaporte
    PASSPORT = 'PASSPORT',

    // 🪪 Carnét de Extranjería
    CE = 'CE',

    // 📄 Permiso temporal de permanencia
    PPT = 'PPT'
 
}