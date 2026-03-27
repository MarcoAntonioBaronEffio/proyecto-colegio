// 🎯 Controlador principal del módulo Auth.
// - Se encarga de manejar las peticiones relacionadas con la autenticación de usuarios (en este caso, el login).

// 🔹 Body -> Decorador para extraer el cuerpo JSON de la petición HTTP.
// 🔹 Controller -> Decorador para marcar esta clase como controlador y definir su perfijo de ruta.
    // 🔸 El prefijo de ruta es la parte fija de la URL que se aplica a todas las rutas que están dentro de ese controlador
// 🔹 HttpException -> Clase base para lanzar errores HTTP personalizados.
// 🔹 HttpStatus -> Enum con los códigos de estado HTTP (200, 400, 401, 500, etc).
// 🔹 Post -> Decorador para manejar solicitudes HTTP POST.
import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
// 🔹 Importamos el servicio de autenticación donde está la lógica de negocio (validar credenciales, firmar JWT, etc.).   
import { AuthService } from './auth.service';
// 🔹 Importamos el DTO que define y valida la forma del body esperado para /login.
//.  Suele tener propiedades como 'email' y 'password' con class-validator.
import { LoginDto } from './dto/login.dto';
// 🔹 Importamos la interfaz del shape de la respuesta.
//.   Esto da autocompletado y garantiza que devolvemos siempre la misma estructura.
import { LoginResponse } from './interfaces/login-response.interface';
import { RegisterDto } from 'src/users/dto/register.dto';
import { constrainedMemory } from 'process';

// 🔹 Prefijo del controlador: todas las rutas aquí dentro comienzan con /auth
@Controller('auth')
export class AuthController {

    // 🔹 Inyección de dependencias por constructor:
    // Nest crea una instancia de AuthService y la inyecta aquí automáticamente.
    // private readonly auth -> define y asigna la propiedad en una sola línea y readonly evita
    // que se reasigne por error.
    constructor(private readonly auth: AuthService){}

    // 🔹 Decorador @Post('login'):
    // Define la ruta HTTP POST /auth/login para este método.
    @Post('login')
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
        });

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
                roleName: user.roleName // nombre del rol
            },
        };
    }


    // ✅ Endpoint para registrar usuario:
    // POST /auth/register
    @Post('register') // 🚀 Definimos la ruta POST /auth/register
    @HttpCode(HttpStatus.CREATED) // ✅ Si todo sale bien, responderá con 201 Created
    async register(@Body() dto : RegisterDto){

        // 📥 Recibimos el body del request y Nest lo transforma en RegisterDto
        // 🧠 Aquí ya se aplican validaciones del DTO si usas ValidationPipe global

        // 🔁 Llamamos al servicio que hace la transacción
        // - valida rol
        // - crea user
        // - crea student si aplica
        // 👉 El service crea el user y el perfil correspondiente según el rol
        const user = await this.auth.register(dto); // ✅ Guardado (o rollback si falla)

        // 🧾 Mensaje por defecto
        let message = 'Usuario registrado con éxito';

        // 🧼 Normalizamos el roleName para evitar problemas con mínúsculas o espacios
        const roleName = dto.roleName?.trim().toUpperCase();

        // 🎓 Si el rol fue estudiante, personalizamos el mensaje
        if(roleName === 'STUDENT'){
            message = 'Estudiante registrado con éxito';
        }

        // 🛡️ Si el rol fue administrador personalizamos el mensaje
        if(roleName === 'ADMINISTRATOR'){
            message = 'Administrador registrado con éxito';
        }


        // ↩️ Retornamos una respuesta personalizada
        return{
            succes : true, // ✅ Indicamos que la operación fue exitosa
            message, // 📨 Mensaje dinámico según el rol
            data : user, // 📦 Datos del usuario creado
        };
    }
}
