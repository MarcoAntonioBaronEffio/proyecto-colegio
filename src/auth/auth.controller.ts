// 🎯 Controlador principal del módulo Auth.
// - Se encarga de manejar las peticiones relacionadas con la autenticación de usuarios (en este caso, el login).

// 🔹 Body -> Decorador para extraer el cuerpo JSON de la petición HTTP.
// 🔹 Controller -> Decorador para marcar esta clase como controlador y definir su perfijo de ruta.
    // 🔸 El prefijo de ruta es la parte fija de la URL que se aplica a todas las rutas que están dentro de ese controlador
// 🔹 HttpException -> Clase base para lanzar errores HTTP personalizados.
// 🔹 HttpStatus -> Enum con los códigos de estado HTTP (200, 400, 401, 500, etc).
// 🔹 Post -> Decorador para manejar solicitudes HTTP POST.
import { BadRequestException, Body, Controller, ForbiddenException, HttpCode, HttpStatus, Post, Req } from '@nestjs/common';
// 🔹 Importamos el servicio de autenticación donde está la lógica de negocio (validar credenciales, firmar JWT, etc.).   
import { AuthService } from './auth.service';
// 🔹 Importamos el DTO que define y valida la forma del body esperado para /login.
//.  Suele tener propiedades como 'email' y 'password' con class-validator.
import { LoginDto } from './dto/login.dto';
// 🔹 Importamos la interfaz del shape de la respuesta.
//.   Esto da autocompletado y garantiza que devolvemos siempre la misma estructura.
import { LoginResponse } from './interfaces/login-response.interface';
import { RegisterDto } from 'src/users/dto/register.dto';
import { Public } from 'src/common/decorators/public.decorator';
import { MenuService } from 'src/common/services/menu.service';
import { RoleName } from 'src/entities/users.entity';
import { use } from 'passport';
import { Roles } from 'src/common/decorators/roles.decorator';
import type { AuthRequest } from 'src/common/interfaces/auth-request-interface';
import { AuthUser } from './interfaces/auth-user.interface';
import { JwtPayload } from './types/jwt-payload-type';

// 🔹 Prefijo del controlador: todas las rutas aquí dentro comienzan con /auth
@Controller('auth')
export class AuthController {

    // 🔹 Inyección de dependencias por constructor:
    // Nest crea una instancia de AuthService y la inyecta aquí automáticamente.
    // private readonly auth -> define y asigna la propiedad en una sola línea y readonly evita
    // que se reasigne por error.
    constructor(
        private readonly auth: AuthService,
        private readonly menuService : MenuService){}


    @Public()
    // 🌐 Endpoint público de autenticación
    // 👉 Permite que un usuario inicie sesión sin necesidad de un JWT
    @Post('login')
    @HttpCode(200)
    // 🔐 Procesa la autenticación del usuario
    async login (
        // 👉 @Body() extrae el cuerpo de la petición (JSON)
        // 👉 Gracias a ValidationPipe con transform: true: 
        // 🔹 El JSON se convierte en una instancia de LoginDto
        // 🔹 Se ejecutan los decoradores @Transform
        // 🔹 Se aplican todas las validaciones del DTO
        // 👉 Solo si la información es válida, este método continúa su ejecución
        @Body() dto: LoginDto
        
        // 📦 Devuelve un LoginResponse con:
        // 🔹 El JWT (accessToken)
        // 🔹 La información básica del usuario autenticado
    ) : Promise<LoginResponse>{
       


        // 🔐 Validamos las credenciales del usuario
        // 👉 Verifica que el correo exista y que la contraseña sea correcta
        // 👉 Si las credenciales son inválidas, lanza UnauthorizedException
        // 👉 Si son válidas, devuelve un AuthUser con la información necesaria para generar posteriormente el JWT
        const user : AuthUser = await this.auth.validate(dto.email, dto.password);

        // 🔑 Generamos el JWT
        // 👉 El payload contiene únicamente la información que el backend necesitará para identificar y autorizar al usuario en futuras peticiones
        // 👉 Nunca deben incluirse datos sensibles como contraseñas o hashes
        const accessToken : string  = await this.auth.signToken({
            sub: user.sub,
            email : user.email,
            roleId: user.roleId,
            roleName: user.roleName,
            schoolId: user.schoolId
        });

        // 📋 Obtenemos el menú correspondiente al rol del usuario
        // 👉 El frontend utilizará esta información para construir la navegación según los permisos del usuario autenticado
        const menu = this.menuService.getMenuByRole(user.roleName);

        // 📤 Devolvemos la respuesta del login
        // 👉 Incluye el JWT para autenticar futuras peticiones
        // 👉 También enviamos información básica del usuario para inicializar el estado de la aplicación cliente
        return{
            accessToken, // 🔐 Token JWT de autenticación

            user:{         
                id : user.sub,  // 🆔 Identificador único del usuario
                email: user.email,  // 📧 Correo electrónico
                roleId: user.roleId,   // 🆔 Identificador del rol
                roleName: user.roleName,  // 👤 Nombre del rol 
                schoolId : user.schoolId,   // 🏫 Colegio al que pertenece (si aplica)
                menu // 📋 Menú disponible según el rol
            },
        };
    }


    // ✅ Endpoint para registrar usuario:
    // 🔐 Solo los usuarios con rol SYSTEM_ADMINISTRATOR o ADMINISTRADOR pueden acceder a este endpoint
    // 👉 RolesGuard leerá este decorador y verificará que req.user.roleName coincida con alguno de los roles permitidos 
    @Roles(
        RoleName.SYSTEM_ADMINISTRATOR,
        RoleName.ADMINISTRATOR)
    @Post('register') // 🚀 Definimos la ruta POST /auth/register
    @HttpCode(HttpStatus.CREATED) // ✅ Si todo sale bien, la respuesta HTTP será 201 Created
    // 🧩 Método encargado de registrar nuevos usuarios.
    // 👉 Si quién registra es un ADMINISTRATOR, el colegio se obtiene automáticamente desde el JWT.
    // 👉 Si quién registra es un SYSTEM_ADMINISTRATOR, el colegio puede venir desde el DTO o no existir, dependiendo del tipo de usuario que se esté creando.
    async register(
        // 📥 Obtiene el body de la petición HTTP
        // 👉 NestJS transforma automáticamente el JSON recibido en una instancia de RegisterDto
        @Body() dto : RegisterDto,
        // 🔐 Obtiene un objeto Request de Express
        // 👉 Gracias a JwtAuthGuard y JwtStrategy, aquí ya existe req.user
        // 👉 req.user contiene el payload validado del JWT
        @Req() req : AuthRequest    
    ){

        // 📌 En este punto:
        // ✅ El JWT ya fue validado
        // ✅ req.user contiene el payload del token
        // ✅ Ya sabemos qué rol tiene el usuario autenticado

        // 🏫 Variable que almacenará el colegio al que pertenecerá el nuevo usuario
        // 👉 Su origen depende del rol del usuario autenticado
        let schoolId : string | undefined;
        
        // =====================================
        // 👑 Si el usuario autenticado es SYSTEM_ADMINISTRATOR
        // =====================================
        // 👉 El System Administrator NO pertenece a ningún colegio, por lo tanto su JWT nunca contiene schoolId
        
        // 👉 El comportamiento depende del tipo de usuario que va a crear:
        // 🔹 Si SYSTEM_ADMINISTRATOR crea un ADMINISTRATOR: el schoolId debe enviarse en el DTO 
        // 🔹 Si SYSTEM_ADMINISTRATOR crea otro SYSTEM_ADMINISTRATOR, no existe schoolId porque ese usuario tampoco pertenece a ningún colegio
        
        
        /* DTO DE SYSTEM_ADMINISTRATOR PARA CREAR UN ADMINISTRADOR  |   DTO DE SYSTEM_ADMINISTRATOR PARA CREAR OTRO SYSTEM ADMINISTRATOR       
            {                                                               {   
                "email" : "admin3@test.com",                                    "email" : "admin3@test.com",
                "password" : "12345678",                                        "password" : "12345678",
                "firstName" : "Ana",                                            "firstName" : "Ana",
                "lastName" : "Effio",                                           "lastName" : "Effio",
                "roleName": "ADMINISTRATOR",                                    "roleName" : "SYSTEM_ADMINISTRATOR",
                "schoolId" : "c5fd365c-a158-4e33-a734-cbf30781dbc9",            "systemAdministrator" :{  
                "administrator" :{                                              "documentType" : "DNI",
                    "documentType" : "DNI",                                     "documentNumber" : "17654322"   
                    "documentNumber" : "17654322"                            }
                }
            }
        */
        if(req.user.roleName === RoleName.SYSTEM_ADMINISTRATOR){
            // 👑 Si crea otro SYSTEM_ADMINISTRATOR, no pertenece a ningún colegio
            if(dto.roleName === RoleName.SYSTEM_ADMINISTRATOR){
                // ✅ Los System Administrator nunca pertenecen a un colegio
                schoolId = undefined;
            }

            // 🏫 Si crea un ADMINISTRATOR, debe indicar el colegio
            else if(dto.roleName === RoleName.ADMINISTRATOR){
                if(!dto.schoolId){
                    throw new BadRequestException(
                        'Debe indicar el colegio (schoolId).'
                    );
                }
                schoolId = dto.schoolId
            }else{
                throw new ForbiddenException(
                    'Rol no permitido'
                );
            }
            
             
        } 

        // =====================================
        // 🏫 Si el usuario autenticado es ADMINISTRATOR
        // =====================================
        // 👉 Siempre registra usuarios dentro de su propio colegio
        // 👉 El schoolId se obtiene del JWT
        else{
            if(!req.user.schoolId){
                throw new ForbiddenException(
                    'El administrador no pertenece a ningún colegio'
                );
            }

            schoolId = req.user.schoolId;
        }

        // 🚀 Registramos el usuario
        const user = await this.auth.register(
            dto,
            schoolId
        ); // ✅ Guardado (o rollback si falla)

        const messages : Record<RoleName, string> = {
            [RoleName.STUDENT] : 'Estudiante registrado con éxito',
            [RoleName.ADMINISTRATOR] : 'Administrador registrado con éxito',
            [RoleName.SYSTEM_ADMINISTRATOR] : 'System Administrator registrado con éxito',
            [RoleName.GUARDIAN] : 'Apoderado registrado con éxito',
            [RoleName.TEACHER] : 'Profesor registrado con éxito',
        };

        const message = messages[dto.roleName] ?? 'Usuario registrado con éxito'

        // ↩️ Retornamos una respuesta personalizada
        return{
            success : true, // ✅ Indicamos que la operación fue exitosa
            message, // 📨 Mensaje dinámico según el rol
            data : user, // 📦 Datos del usuario creado
        };
    }
}
