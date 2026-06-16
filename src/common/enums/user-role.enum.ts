// 🧩 Exportamos un enum llamado UserRole
// 🔹 Un enum es como una lista de valores constantes
// 👉 Sirve para evitar usar strings "sueltos" en todo el proyecto
// 👉 Mejora la seguridad y evita errores de tipeo 
export enum UserRole{

    // 👑 ADMINISTRATOR
    // 👉 Representa al usuario con mayor privilegio (admin del sistema)
    ADMINISTRATOR = 'ADMINISTRATOR',

    // 👨‍🏫 TEACHER
    // 👉 Puede gestionar clases, notas, asistencias
    TEACHER = 'TEACHER',

    // 🎓 STUDENT
    // 🔹 Acceso limitado (ver notas, tareas, etc)
    STUDENT = 'STUDENT',

    // 👨‍👩‍👧 Guardian
    // 👉 Puede ver información del estudiante
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