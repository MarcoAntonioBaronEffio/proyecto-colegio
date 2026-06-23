// 🧩 Exportamos un enum llamado UserRole
// 🔹 Un enum es una colección de valores constantes
// 👉 Evita usar strings repetidos en todo el proyecto
// 👉 Reduce errores de escritura y mejora el autocompletado
export enum UserRole{
    

    // 🏢 SYSTEM_ADMINISTRATOR
    // 👉 Administrador global de la plataforma Saas
    // 👉 Puede crear colegios y administrar todo el sistema
    SYSTEM_ADMINISTRATOR = 'SYSTEM_ADMINISTRATOR',

    // 👑 ADMINISTRATOR
    // 👉 Administrador de un colegio específico
    // 👉 Gestiona usuarios, años escolares, grados, aula, etc
    ADMINISTRATOR = 'ADMINISTRATOR',

    // 👨‍🏫 TEACHER
    // 👉 Docente del colegio
    // 👉 Gestiona notas, asistencias y actividades académicas
    TEACHER = 'TEACHER',

    // 🎓 STUDENT
    // 👉 Estudiante matriculado en el colegio
    // 👉 Puede consultar información académica
    STUDENT = 'STUDENT',

    // 👨‍👩‍👧 Guardian
    // 👉 Apoderado o tutor del estudiante
    // 👉 Puede consulta información de sus hijos
    GUARDIAN = 'GUARDIAN'

}


// 🔹 ¿Qué es esto?
// 👉 Es unum (enumeración)
// 👉 Una forma segura de manejar roles

// 🔥 Cómo usarlo en el proyecto
// 🛡️ En el decorador
// @Roles(UserRole.ADMINISTRATOR)

// 🧠 En el guard
// requiredRoles.includes(user.role)
// 👉 user.role también debería ser de tipo UserRole

// 🟢 6. user-role-enum.ts
// 👉 Este es solo un CATÁLOGO de roles

/*

    export enum UserRole{
        ADMINISTRATOR = 'ADMINISTRATOR',
        STUDENT = 'STUDENT
    }

*/

// 💡 En simple: ❗️ "Lista oficial de roles"