import { Controller, Get } from "@nestjs/common";
import { RolesServices } from "./roles.services";
import { ApiResponse } from "src/common/interfaces/api-response.interface";
import { Rol } from "src/entities/rol.entity";

// 🔹 @Controller -> Convierte esta clase en un controlador HTTP.
// 'roles' será el prefijo en la URL. Ejemplo: http://localhost:3000/api/roles
@Controller('roles')
export class RolesController{

    // 🔹 Inyectamos el servicio RolesServices en el controlador.
    // NestJS detecta automáticamente que necesitamos una instancia del servicio y la coloca en la propiedad
    // privada "roles".
    // Esto nos permite llamar métodos como this.roles.findAll().
    constructor (private roles: RolesServices){}
    

    // 🔹 Marcamos el método como "async" para poder utilizar "await" dentro.
    // Esto significa que el método devuelve automáticamente una Promesa.
    // 🔹@Get -> decorador que indica que este método se ejecutará cuando se haga un GET a la ruta : GET/roles
    @Get()
    async findAll(): Promise<ApiResponse<Rol[]>>{
 
        // 🔹 Esperamos a que el servicio obtenga los roles de la base de datos.
        // Si todo va bien, se almacena el resultado en la constante "roles".
        const roles = await this.roles.findAll();
            
        // ✅ Retornamos una respuesta exitosa siguiendo tu contrato ApiResponse<T>
        return {
        success : true, // Indica que la operación fue exitosa
        message : 'Listado de roles', // Mensaje informativo que describe la acción que se realizó
        data : roles, // Contiene la información obtenida desde el servicio, en este caso, el arreglo de roles que proviene de la base de datos.
        };
    }
}