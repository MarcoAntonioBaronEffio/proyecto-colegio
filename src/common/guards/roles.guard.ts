// 📦 Importamos interfaces y decoradores de NestJS
// 👉 CanActivate: contrato que obliga a definir si la request pasa o no
// 👉 ExecutionContext: representa TODO el contexto de la request
// 👉 Injectable: permite que Nest gestione esta clase (inyección de dependencias)
import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";

// 🧠 Reflector: herramienta para LEER METADATA de decorators como @Roles()
// 👉 Es el "lector" de etiquetas que pusiste con SetMetadata
import { Reflector } from "@nestjs/core";

// 🧩 Marcamos la clase como injectable
// 👉 Nest podrá crearla automáticamente e inyectar dependencias como "Reflactor"
@Injectable()
 
// 🛡️ Creamos el RolesGuard
// 👉 Implementa CanActivate -> OBLIGATORIO tener el método canActivate()
export class RolesGuard implements CanActivate {

    // 🧠 Inyectamos Reflector
    // 👉 Lo usaremos para leer los roles requeridos del endpoint
    constructor(private reflector : Reflector){}

    // 🚔 Método clave del guard
    // 👉 Aqui decides si la request pasa (true) o se bloquea (false)
    canActivate(context : ExecutionContext) : boolean{
 
        // 🔍 Obtenemos los roles requeridos desde la metadata
        // 👉 'roles' es la clave usada en @Roles(...)
        // 👉 getAllAndOverride busca en:
        // 1️⃣ El endpoint (handler)
        // 2️⃣ El controller (class)

        // Por ejemplo si tenemos esto:
        /* 
            @Roles(UserRole.ADMINISTRATOR)
            @Get()
            findAll(){}
        
        Entonces internamente NestJS guarda una metadata parecida a:

        {
            roles: [ADMINISTRATOR]
        }
            */


        const requiredRoles = this.reflector.getAllAndOverride<string[]>(
            'roles', // 🔑 clave de metadata (ej: @Roles('ADMINISTRATOR'))
            [
                context.getHandler(), // 🎯 método (ej: findAll
                context.getClass(),   // 🏫 controller completo
            ]
        ); 

        // 🟢 Si NO hay roles definidos...
        // 👉 significa que el endpoint es libre (no necesita rol)
        // 👉 dejamos pasar la request
        if(!requiredRoles) return true;
 
        // 🔴 Si SI hay role definidos -> debemos validar al usuario
 
        // 🌎 Obtenemos el request HTTP real
        // 👉 Aqui viene todo: headers, body, user, etc
        const request = context.switchToHttp().getRequest();
 
        // 👤 Obtenemos el usuario autenticado
        // 👉 Este user viene del JwtStrategy
        // 👉 Ya fue decodificado del token JWT

        /* 
            🧠 Ejemplo de user:
            user = {
                sub: "123",
                email: "admin@test.com",
                roleName: "ADMINISTRATOR"
            }
        */
        const user = request.user; 

        // 🔐 Validamos si el rol del usuario está permitido
        // 👉 requiredRoles : ['ADMINISTRATOR']
        // 👉 user.roleName : "ADMINISTRATOR"
        // 👉 includes -> true si coincide

        // 🟢 Si coincide -> true - pasa
        // 🔴 Si NO coincide -> false -> bloqueado automáticamente por Nest

        // ✅ true -> nest continúa hacia el controller
        // ❌ false -> nest lanza 403 forbidden
        return requiredRoles.includes(user.roleName);

    }

}

 
















