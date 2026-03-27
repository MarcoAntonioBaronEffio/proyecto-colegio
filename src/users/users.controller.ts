import { Body, Controller, Get, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiResponse } from 'src/common/interfaces/api-response.interface';
import { User } from 'src/entities/users.entity';
import { CreateUserDto } from './dto/create-user.dto';

// 🔹 Controller('users)
// Convierte esta clase en un controlador HTTP.
// El prefijo 'users' define la ruta base: GET/POST -> /users
@Controller('users')
export class UsersController {

    // 🔹 Inyectamos el servicio de usuarios.
    // Nest crea una instancia de UsersService y la coloca en la propiedad privada "users".
    constructor (private users: UsersService){}

    //GET/users -> Listar todos los usuarios
    // 🔹 Tipamos el retorno con el contrato ApiResponse<User[]>
    @Get()
    async findAll() : Promise<ApiResponse<User[]>>{
    
            // 🔹 Pedimos al servicio que nos traiga todos los usuarios.
            // Si en tu entidad User tienes 'eager:true' en la relación con Rol, el rol ya vendrá cargado automáticamente.
            const data = await this.users.findAll();

            // ✅ Respuesta estándar exitosa
            return{
                success : true,
                message : 'Listado de usuarios',
                data,
            };
    }
 

    // 🔹 Decorador @Post() -> Indica que este método responderá a solicitudes HTTP de tipo POST.
    // Es decir, se usará cuando el cliente quiera crear un nuevo recurso (en este caso, un usuario).
    @Post()
    // 🔹 Declaracón del método asíncrono "create".
    // - La palabra clave 'async' indica que dentro del método se usarán operaciones asíncronas (por ejemplo, acceder a la base
    // de datos con 'await'), y que este método devolverá una *promersa*.
    // - Nest esperará a que esta promesa se resuelve antes de enviar la respuesta al cliente.
    async create(
        // 🔹 Decorador @Body()
        // - Extrae el cuerpo (body) de la petición HTTP POST.
        // - NestJS automáticamente convierte el JSON recibido en un objeto de tipo CreateUserDto.
        // - Este DTO (Data Transfer Object) define las propiedades esperadas (por ejemplo: nombre, email, password, etc.), y
        // y puede incluir validaciones con class-validator.
        //
        // 🔹 Tipo de retorno : Promise<ApiResponse<User>>
        // - Significa que esta función devuelve una PROMESA que cuando se resuelva contendrá un objeto con el formato ApiResponse<User>
        // - ApiResponse<User> es un tipo genérico (definido por ti).
        @Body() dto: CreateUserDto): Promise<ApiResponse<User>>{
        // 🔹 Llamamos al servicio "users" (inyectado en el constructor del controlador) para crear un nuevo registro de usuario
            // con los datos del DTO
            const data = await this.users.create(dto);

            // 🔹 Devolvemos una respuesta estándar de éxito al cliente.
            return{
                success : true,
                message : 'Usuario creado correctamente',
                data,
            }
    }

    // 🧠 ¿Qué pasa si hay un error en el servicio?
    // throw new ConflictException('El email ya existe');
    // Nest lo transforma automáticamente en una respuesta asi:
    //{
    // "statusCode":409,
    // "message" :"El email ya existe",
    // "error" : "Conflict"
    //}
    
}
