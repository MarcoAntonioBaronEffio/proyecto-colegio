// 🔹 import {Body, Controller, Post} from '@nestjs/common';
// @Controller -> Indica que esta clase es un controller y manejará rutas HTTP.
// @Post -> Indica que el método responderá a solicitudes POST.
// @Body -> Permite acceder al cuerpo (JSON enviado por el cliente) de la petición.
import { Body, Controller, Post } from '@nestjs/common';
// Importamos el servicio AlumnoService
// 👉🏼 El service contiene la lógica de negocio (guardar en DB, verificar datos, etc.), mientras que el controller solo recibe
// la petición y delega al service.
import { AlumnoService } from './alumno.service';
// Importamos el DTO (Data Transfer Object) que define cómo debe venir el JSON de la petición.
// 👉🏼 Ejemplo: {"dni" : "12345678", "email": "ejemplo@gmail.com", "password": "12345"}
import { CreateAlumnoDto } from './dto/create-alumno.dto';

// 🔹 @Controller('alumno)
// Decorador que indica que todas las rutas dentro de este controller empezarán con /alumno.
// 👉🏼 Ejemplo: el método con @Post() se expone en POST/alumno.
@Controller('alumnos')
// 🔹 export class AlumnoController, donde estarán todos lo endpoints relacionados con alumnos.
export class AlumnoController {
 

    // 🔹 Inyección de dependencias:
    // Nest crea una instancia de AlumnosService y la inyecta en el controller.
      // private readonly alumnoService : AlumnoService -> significa que solo podemos usar 'alumnoService' dentro de esta
      // clase y no se podrá modificar (readonly).
    constructor(private readonly alumnoService : AlumnoService){}

    // 🔹 @Post() -> expone el método en la ruta /alumno como un endpoint POST.
    // 🔹 create(@Body() dto: CreateAlumnoDto) ->
       // @Body() toma el JSON que mande el cliente en el body de la petición.
       // dto: CreateAlumnoDto asegura que el JSON cumpla con las reglas del DTO (validaciones como @IsEmail(), @IsString(), etc.).
    @Post()
    create(@Body() dto: CreateAlumnoDto){
        //🔹 return this.alumnoService.create(dto) -> se delega la lógica al servicio (alumno.service.ts)
        //👉🏼 El controller no hace cálculos, solo recibe la petición y se la pasa al servicio.
        return this.alumnoService.create(dto);
    }

}
