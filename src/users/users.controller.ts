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

    // 🧠 ¿Qué pasa si hay un error en el servicio?
    // throw new ConflictException('El email ya existe');
    // Nest lo transforma automáticamente en una respuesta asi:
    //{
    // "statusCode":409,
    // "message" :"El email ya existe",
    // "error" : "Conflict"
    //}
    
}
