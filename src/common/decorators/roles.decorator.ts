// 📦 Importamos SetMetadata desde NestJS
// 🔹 SetMetadata permite "pega información" (metadata) a un endpoint
// 👉 Esa información luego será leída por los Guards (como RolesGuard)
import { SetMetadata } from "@nestjs/common";


// 🧠 ¿QUÉ ESTAMOS CREANDO AQUI?
// 👉 Un decorador personalizado llamado @Roles()
// 👉 Sirve para definir QUIÉN puede acceder a un endpoint

// 🏷️ Exportamos una constante llamada Roles
// 🔹 (...roles: string[]) = "rest operator"
// 👉 Significa que puedes mandar MUCHOS roles

// 🔥 Ejemplo:
// @Roles('ADMIN', 'TEACHER'), asi mandes solo uno
export const Roles = (...roles: string[]) =>  

    // 🧠 SetMetadata (clave, valor)
    // 👉 clave: 'roles'
    // 👉 valor: el array de roles que enviaste
    SetMetadata('roles', roles);


    // 🧠 ¿Qué está pasando realmente?
    // 👉 Cuando usas:
    /* 
        @Roles('ADMINISTRATOR', 'STUDENT', 'GUARDIAN', 'TEACHER')
        @Get()
        findAll(){}

        // 🔥 Internamente Nest guarda algo asi:

        {
            handler: findAll,
            metadata:{
                roles: ['ADMINISTRATOR', 'STUDENT', 'GUARDIAN', 'TEACHER]
            }
        }
    */

    // 🧠 ¿Quién usa esa metadata?
    // 👉 Tu RolesGuard 👈
    // 🔥 El guard hace algo como:
    // const requiredRoles = this.reflector.getAllAndOverride<string[]>(
    //     'roles',
    //     [context.getHandler(), context.getClass()]
    // );

    // 🧠 Traducción
    // 👉 "Oye Nest..."
    // 🔍 Busca si este endpoint tiene metadata 'roles'
    // 👉 Si encuentra:
    // requiredRoles: ['ADMINISTRATOR', 'STUDENT',...]
    // 👉 Si NO lo encuentra:
    // requiredRoles = undefined

 
    // ⭐️ SETMETADATA permite crear decoradores personalizados que guardan información (metadata) en un endpoint
    // 👉 Ejemplo:
    // @Public() guarda: {isPublic: true}
    // @Roles('ADMINISTRATOR') guarda: { roles: ['ADMINISTRATOR] }
    // 🔥 Esa metadata NO hace nada por si sola
    // 👉 Los Guards (AuthGuard, RolesGuard) la leen para tomar decisiones
    // 💡 Ejemplo:
    // - isPublic = true -> no exige JWT
    // - roles = ['ADMINISTRATOR'] -> valida si el usuario tiene ese rol

    // 🟠 4. roles.decorator.ts
    // 👉 Este define QUIÉN puede entrar 👤
    // Ejemplo
    // 🔹 @Roles('ADMINISTRATOR')
    // 💡 En simple: ❗️ "Solo ADMINISTRATOR puede pasar"