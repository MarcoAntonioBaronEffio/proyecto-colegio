// 📦 Importamos interfaces y decoradores de NestJS
// 👉 CanActivate: contrato que obliga a definir si la request pasa o no
// 👉 ExecutionContext: representa TODO el contexto de la request
// 👉 Injectable: permite que Nest gestione esta clase (inyección de dependencias)
import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";


// 🧠 Reflector: herramienta para LEER METADATA de decorators como @Roles()
// 👉 Es el "lector" de etiquetas que pusiste con SetMetadata
import { Reflector } from "@nestjs/core";

// 🧩 Marcamos la clase como injectable
// 👉 Nest podrá crearla automáticamente e inyectar dependencias como "Reflector"
@Injectable()
 
// 🛡️ Creamos el RolesGuard
// 👉 Implementa CanActivate -> por lo que obligatoriamente debe contener el método canActive()
export class RolesGuard implements CanActivate {

    // ⭐️ ¿LA RUTA EXIGE ALGÚN ROL ESPECIFICO?

    // 🧠 Inyectamos Reflector
    // 👉 Lo utilizaremos para leer la metadata creada por el decorador @Roles()
    constructor(private reflector : Reflector){}

    // 🚔 Método principal del guard
    // 👉 Decide si la petición puede continuar
    //
    // ✅ true -> La petición continúa
    // ❌ false -> NestJS responde con 403 Forbidden
    canActivate(context : ExecutionContext) : boolean{
 
        // 🔍 Intentamos obtener los roles requeridos desde la metadata creada por @Roles()
        // 👉 'roles' es la clave utilizada para guardar y posteriormente recuperar esa metadata
        // 👉 getAllAndOverride buscará en este orden: 
        // 1️⃣ En el método o endpoint actual
        // 2️⃣ En el controller completo
        //
        // 👉 Si encuentra roles en el endpoint, estos tendrán prioridad sobre los roles definidos es en controller

        // Por ejemplo si tenemos esto:
        /* 
            @Roles(UserRole.ADMINISTRATOR)
            @Get()
            findAll(){}
        
        El decorador guarda internamente una metadata similar a: 

        {
            roles: [ADMINISTRATOR]
        }
            */


        const requiredRoles = this.reflector.getAllAndOverride<string[]>(
            'roles', // 🔑 clave de metadata (ej: @Roles('ADMINISTRATOR'))
            [
                context.getHandler(), // 🎯 método (ej: findAll)
                context.getClass(),   // 🏫 controller completo
            ]
        ); 

        // 🔴 Si no existen roles definidos mediante @Role()...
        // 👉 La ruta no tiene una restricción adicional por rol
        // 👉 Por lo tanto, RolesGuard permite continuar
        //
        // ⚠️ Esto no significa necesariamente que sea una ruta pública
        // 👉 Si JwtAuthGuard está activo, todavía será necesario enviar un token JWT válido
        if(!requiredRoles || requiredRoles.length === 0) return true;
 
        // 🟢 Si existen roles definidos
        // 👉 Necesitamos obtener al usuario autenticado y verificar su rol
        //  
        // 🌎 Obtenemos la petición HTTP real 
        // 👉 Contiene información como: headers, body, params, query y user
        // 👤 request.user fue agregado anteriormente por Passport después de que JwtAuthGuard validara correctamente el token
        const request  = context.switchToHttp().getRequest();
 
        // 👤 Obtenemos el usuario autenticado
        // 👉 request.user fue agregado previamente por Passport
        // 👉 Contiene el valor retornado por JwtStrategy.validate()


        /* 
            🧠 Ejemplo de user:
            user = {
                sub: "123",
                email: "admin@test.com",
                roleName: "ADMINISTRATOR",
                schoolId : 'abc1234'
            }
        */

        // 👤 Obtenemos la información del usuario autenticado
        // 👉 Esta línea NO valida el token ni verifica su firma
        // 👉 La firma y la expiración fueron verificadas previamente por Passport mediante JwtAuthGuard y JwtStrategy
        // 👉 Si el token fue válido, Passport ejecutó JwtStrategy.validate() y guardó su resultado dentro de request.user
        // ⭐️ Importante, no podemos escribir directamente const user = request.user; si antes no has declarado u obtenido la
        //    variable "request", porque TypeScript no sabría qué objeto representa "request". Primero debes extraer la petición
        //    HTTP desde el ExecutionContext
        const user = request.user; 

        // 🚨 Si por alguna razón no existe un usuario autenticado
        // 👉 No permitimos el acceso
        //
        // 🔹 Normalmente esto no debería suceder si JwtAuthGuard se ejecutó correctamente antes que RolesGuard
        if(!user){
            return false;
        }


        // 🔐 Comprobamos si el rol del usuario se encuentra dentro de los roles permitidos para la ruta
        // 🔥 Ejemplo:
        // 🔹 requiredRoles: ['SYSTEM_ADMINISTRATOR', 'ADMINISTRATOR']
        //
        // 🔹 user.roleName : 'ADMINISTRATOR'
        // 👉 includes() devolverá true porque el rol sí está permitido
        // ✅ true -> nest continúa hacia el controller
        // ❌ false -> nest lanza 403 forbidden
        return requiredRoles.includes(user.roleName);

    }

}

 
/*

RolesGuard
|-- Ruta sin @Roles()
|   |--- Deja continuar al usuario que ya fue autenticado por JwtAuthGuard, sin importar su rol
|
|-- Ruta con @Roles()
    |-- Deja continuar únicamente al usuario autenticado cuyo rol esté entre los permitidos

🔥 Ejemplo: Ruta protegida sin rol específico

    @Get('profile')
    getProfile(){}

🔹 Como no tiene @Public(), primero debe enviar un token válido. Como no tiene @Roles(), puede ingresar cualquier usuario autenticado:
   ✅ SYSTEM_ADMINISTRATOR, ADMINSITRATOR, TEACHER, GUARDIAN, STUDENT


🔥 Ejemplo: Ruta protegida con roles específicos
    @Roles(
        RoleName.ADMINSTRATOR,
        RoleName.TEACHER
    )
    @Get('reports')
    getReports(){}

🔹 Primero se valida el token. Después, el RolesGuard solo permite entra a: ✅ ADMINISTRATOR, ✅ TEACHE, ❌ STUDENT, ❌ GUARDIAN

✨ El RolesGuard deja continuar a cualquier usuario autenticado cuando la ruta no tiene @Roles(), y cuando sí tiene @Roles(), solamente
deja continuar a los usuarios autenticados cuyo rol esté permitido.

Solo recuerda que el RolesGuard no valida el token: recibe al usuario ya autenticado por el JwtAuthGuard y decide si existe alguna
restricción adicional por rol
   

*/















