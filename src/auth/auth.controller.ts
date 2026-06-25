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
    // 🔹 Decorador @Post('login'):
    // Define la ruta HTTP POST /auth/login para este método.
    @Post('login')
    @HttpCode(200)
    // 🔹 Método asíncrono que maneja el login.
    // - @Body() dto -> extrae el body del request ( JSON plano ) y gracias a ValidationPipe con transform: true, lo convierte en una instancia de LoginDto y aplica 
    //   validaciones.
    // - Promise<LoginResponse> : tipamos explícitamente lo que devolvemos.
    // ⭐️ Qué nos permite dto: LoginDto
    //1️⃣ Recibir el body del request (JSON plano)
    //2️⃣ Se convierte en una instancia real de LoginDto
    //3️⃣ Se ejecutan @Transform
    //4️⃣ Se ejecutan validaciones
    //5️⃣ Solo si todo es válido, el método login se ejecuta
    async login (@Body() dto: LoginDto) : Promise<LoginResponse>{
       
        // 1️⃣ ✅ Validamos credenciales
        // Llamamos al servicio para verificar email + password.
        // - Si las credenciales son inválidas, lo normal es que 'validate' lance una excepción(por ejemplo UnauthorizedException)
        // - Si son válidas, devuelve el usuario (sin passwordHash si lo configuraste con select:false)
        // 🔹 dto.email => dato limpio, validado y tipado del email
        // 🔹 dto.password => dato limpio, validado y tipado del password
        const user = await this.auth.validate(dto.email, dto.password);

        // 2️⃣ 🔐 Firmamos un JWT con datos necesarios (payload)
        // - Incluimos campos que usarás a menudo en el backend (sub, email, roleId)
        // - No coloques aquí información sensible (nunca password, ni hashes)
        // - AuthService.signToken internamente usa JwtService.signAsync() con JWT_SECRET y JWT_EXPIRES
        // configurados en tu JwtModule.
        const accessToken = await this.auth.signToken({
            sub: user.sub,
            email : user.email,
            roleId: user.roleId,
            roleName: user.roleName,
            schoolId: user.schoolId
        });

        const menu = this.menuService.getMenuByRole(user.roleName);

        // 3️⃣ 📦 Devolvemos una respuesta que cumple la interfaz LoginResponse
        // - acess_token: el JWT (string).
        // - user: datos básicos del usuario logueado (útiles en el cliente).
        // Evita exponer más de lo necesario.
        return{
            accessToken, // 🔐 token de usuario , Lo usarás en Authorization : Bearer<token>
            user:{        // 👤 Conveniente para poblar el estado del frontend
                id : user.sub, // uuid del usuario
                email: user.email, // email
                roleId: user.roleId, // rol de usuario
                roleName: user.roleName, // nombre del rol
                schoolId : user.schoolId, // colegio del usuario
                menu
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
