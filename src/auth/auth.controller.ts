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
import { CreateSystemAdministratorDto } from 'src/users/dto/create-system-administrator.dto';
import { CreateAdministratorDto } from 'src/users/dto/create-administrator.dto';

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
        //const menu = this.menuService.getMenuByRole(user.roleName);

        // 📤 Devolvemos la respuesta del login
        // 👉 Incluye el JWT para autenticar futuras peticiones
        // 👉 También enviamos información básica del usuario para inicializar el estado de la aplicación cliente
        return{
            accessToken, // 🔐 Token JWT de autenticación

            user: {         
                id : user.sub,  // 🆔 Identificador único del usuario
                email: user.email,  // 📧 Correo electrónico
                roleId: user.roleId,   // 🆔 Identificador del rol
                roleName: user.roleName,  // 👤 Nombre del rol 
                schoolId : user.schoolId,   // 🏫 Colegio al que pertenece (si aplica)
                //menu // 📋 Menú disponible según el rol
            },
        };
    }


    // ============================================================
    // 👑 REGISTRAR SYSTEM ADMINISTRATOR
    // ============================================================

    // ✅ Endpoint encargado de registrar un nuevo SYSTEM_ADMINISTRATOR
    //
    // 🔐 Solamente puede acceder:
    // 👑 SYSTEM_ADMINISTRATOR
    //
    // ⭐️ IMPORTANTE:
    // 👉 El frontend NO envía roleName
    // 👉 Esta ruta siempre registrará un SYSTEM_ADMINISTRATOR
    // 👉 El propio servicio determina el rol
    //
    // 🏫 SYSTEM_ADMINISTRATOR:
    // 👉 No pertenece a ningún colegio
    // 👉 Por eso NO necesitamos schoolId
    @Roles(
        RoleName.SYSTEM_ADMINISTRATOR,
    )
    @Post('register/system-administrator')
    @HttpCode(HttpStatus.CREATED)
    async registerSystemAdministrator(

        // 📥 Datos enviados desde el frontend
        // 👉 Contiene: 📧 email, 🔐 password, 👤 firstName , 👤 lastName, 📱 phone?, 🖼️ avatarUrl?, 📄 documentType, 🔢 documentNumber
        @Body() dto : CreateSystemAdministratorDto,
    ){

        // ============================================================
        // 🚀 REGISTRAR SYSTEM ADMINISTRATOR
        // ============================================================

        // 👑 Llamamos directamente a la función específica
        // 👉 Ya NO utilizamos un register() genérico
        // 👉 Tampoco necesitamos enviar RoleName.SYSTEM_ADMINISTRATOR
        // 🔐 El propio servicio determina el rol
        const user = await this.auth.registerSystemAdministrator(
            dto,
        );

        // ============================================================
        // 📥 RESPUESTA
        // ============================================================

        return{
            success: true,
            message : 'System Administrator registrado con éxito',
            data : user,
        };


    }



    // ============================================================
    // 🛡️ REGISTRAR ADMINISTRADOR
    // ============================================================



    // ✅ Endpoint encargado de registrar un nuevo ADMINISTRATOR
    //
    // 🔐 Pueden acceder: 
    // 👑 SYSTEM_ADMINISTRATOR
    // 🛡️ ADMINISTRATOR
    //
    // ⭐️ IMPORTANTE:
    // 👉 El frontend NO envía roleName
    // 👉 Esta ruta siempre crea un ADMINISTRATOR
    //
    // 🏫 El origen del schoolId depende de quién realiza el registro:
    //
    // 👑 SYSTEM_ADMINISTRATOR
    // 👉 Puede seleccionar el colegio desde el formulario
    //
    // 🛡️ ADMINISTRATOR
    // 👉 NO puede seleccionar libremente otro colegio
    // 👉 Se utiliza directamente el schoolId almacenado en su JWT
    @Roles(
        // 👑 EL SYSTEM_ADMINISTRATOR puede registrar administradores
        RoleName.SYSTEM_ADMINISTRATOR,

        // 🛡️ Un ADMINISTRATOR también puede registrar otros administradores
        RoleName.ADMINISTRATOR)
    @Post('register/administrator') // 🚀 Definimos la ruta POST /auth/register
    // ✅ Indicamos que, si el registro se realiza correctamente, responderemos con HTTP 201 Created
    @HttpCode(HttpStatus.CREATED) 
    // 🧩 Método del Controller encargado específicamente de registrar nuevos administradores
    async register(
        // 📥 Datos del nuevo administrator
        @Body() dto : CreateAdministratorDto, 

        // 🔐 Petición autenticado
        // 👉 req.user contiene la información extraída del JWT
        @Req() req : AuthRequest    
    ){

        // ============================================================
        // 🏫 DETERMINAR COLEGIO
        // ============================================================

        // 🏫 Aquí almacenaremos el colegio que finalmente será enviado al servicio
        let schoolId: string;

 
        
        // ============================================================
        // 👑  CASO 1 : REGISTRA SYSTEM_ADMINISTRATOR
        // ============================================================


        // 👑 Comprobamos si quien está realizando la petición es un SYSTEM_ADMINISTRATOR
        if(
            req.user.roleName === RoleName.SYSTEM_ADMINISTRATOR
        ){

            // 👑 El SYSTEM_ADMINISTRATOR no pertenece personalmente a ningún colegio
            // 👉 Por eso, necesita seleccioanr desde el frontend el colegio donde será creado el nuevo ADMINISTRATOR

            // ❌ Verificamos que el SYSTEM_ADMINISTRATOR realmente haya seleccionado un colegio
            if(!dto.schoolId){

                // 🚨 Si no existe schoolId, la petición está incompleta
                throw new BadRequestException(
                    // 📥 Mensaje enviado al frontend
                    'Debe indicar el colegio (schoolId).'
                )
            }

            // 🔹 Guardamos el ID del colegio seleccionado por el SYSTEM_ADMINISTRATOR
            // 🔥 Ejemplo:
            // 🔹 dto.schoolId = "c5fd365c-a158-4e33-a734-cbf30781dbc9"
            // 👉 Entonces : 
            // 🔹 schoolId = "c5fd365c-a158-4e33-a734-cbf30781dbc9"
            schoolId = dto.schoolId

        }

            // =====================================
            // 🛡️ CASO 2 : REGISTRA ADMINISTRATOR
            // =====================================

            // 🔹 Comprobamos EXPLÍCITAMENTE que el usuario autenticado tenga el rol ADMINISTRATOR
            // 👉 Antes utilizábamos simplemente "else"
            // 🔹 Ahora dejamos claro que este bloque solamente pertenece al rol ADMINISTRATOR
            else if (req.user.roleName === RoleName.ADMINISTRATOR){
                
                // 🛡️ Un ADMINISTRATOR solamente puede crear administradores dentro de su propio colegio 
                // ❌ No utilizamos: dto.schoolId
                // ✅ Utilizamos   : req.user.schoolId
                // 
                // 🔐 De esta manera el cliente no puede modificar manualmente el ID e intentar registrar administradores
                //    para otro colegio
                //
                // ❌ Verificamos que el administrador autenticado realmente tenga un schoolId dentro de su JWT
                if(!req.user.schoolId){

                    // 🚨 Si no tiene colegio, no debería poder registrar administradores
                    throw new ForbiddenException(
                        // 📥  Mensaje enviado al frontend
                        'El administrador no pertenece a ningún colegio'
                    );
                }

                // ✅ Obtenemos el colegio directamente desde el usuario autenticado
                // 👉 Este schoolId fue obtenido previamente desde el JWT validado por el backend
                // 🔥 Por ejemplo: 
                // 🔹 req.user.schoolId = "abc-123"
                // 👉 Entonces
                // 🔹 schoolId = "abc-123"
                schoolId = req.user.schoolId;
            }



            // =====================================
            // 🚫 PROTECCIÓN ADICIONAL
            // =====================================

            // 🔐 En condiciones normales nunca debería entrar aquí, porque @Roles ya protege la ruta 
            // 👉 Sin embargo, dejamos una segunda protección
            else{

                // 🚫 Bloqueamos cualquier rol inesperado
                throw new ForbiddenException(
                    // 📥 Mensaje enviado al cliente
                    'No tienes permisos para registrar administradores'
                );
            }

            // =====================================
            // 🚀 REGISTRAR ADMINISTRATOR
            // =====================================


            // 🛡️ Ahora llamamos directamente a: registerAdministrator(dto, schoolId)
            // 👉 El servicio sabe automáticamente que debe crear un ADMINISTRATOR
            const user = await this.auth.registerAdministrator(

                // 📦 Datos enviados en el body
                dto,
  
                // 🏫 Colegio al cual pertenecerá el nuevo administrador
                // 👑 Si registró SYSTEM_ADMINISTRATOR: viene del DTO
                // 🛡️ Si registró ADMINISTRATOR: viene del JWT
                schoolId
            )

            
            // =====================================
            // 📥 RESPUESTA
            // =====================================

            // ↩️ Retornamos la respuesta al frontend
            return{

                // ✅ Indicamos que la operación terminó correctamente
                success: true,
                // 👉 Sabemos de antemano que esta ruta únicamente registra administradores
                mssage: 'Administrador registrado con éxito',
                // 📦 Retornamos la información del usuario creado por el servicio
                data : user,
            };









 
        
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
 
 
    }

    
}
