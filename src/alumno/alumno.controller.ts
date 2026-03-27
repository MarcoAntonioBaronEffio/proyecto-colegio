// 🔹 import {Body, Controller, Post} from '@nestjs/common';
// @Controller -> Indica que esta clase es un controller y manejará rutas HTTP.
// @Post -> Indica que el método responderá a solicitudes POST.
// @Body -> Permite acceder al cuerpo (JSON enviado por el cliente) de la petición.
import { Body, Controller, Get, Post } from '@nestjs/common';
// Importamos el servicio AlumnoService
// 👉🏼 El service contiene la lógica de negocio (guardar en DB, verificar datos, etc.), mientras que el controller solo recibe
// la petición y delega al service.
import { AlumnoService } from './alumno.service';
// Importamos el DTO (Data Transfer Object) que define cómo debe venir el JSON de la petición.
// 👉🏼 Ejemplo: {"dni" : "12345678", "email": "ejemplo@gmail.com", "password": "12345"}
import { CreateAlumnoDto } from './dto/create-alumno.dto';
import { ApiResponse } from 'src/common/interfaces/api-response.interface';
import { Alumno } from 'src/entities/alumno.entity';

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
    // 🔹 async -> Permite usar "await" dentro del método, ya que la creación del alumno es una operación asíncrona.
    // 🔹 create(@Body() dto: CreateAlumnoDto) ->
       // @Body() toma el JSON que mande el cliente en el body de la petición.
       // dto: CreateAlumnoDto -> asegura que el JSON cumpla con las reglas del DTO (validaciones como @IsEmail(), @IsString(), etc.).

    // 🔹 Promise<ApiResponse<any>> -> Garantiza que la función devolverá una promesa con la estructura estandarizada.  
   @Post()
    async create(@Body() dto: CreateAlumnoDto) : Promise<ApiResponse<Alumno>>{
      // 🔹 try: Bloque donde intentamos ejecutar la lógica principal que podría fallar (Acceso a la BD).
      try{ 

        //🔹 Esperamos el resultado del servicio antes de continuar.
        // this.alumnoService.create(dto) realiza la creación en la capa de servicio que regresa una promesa
        const nuevoAlumno = await this.alumnoService.create(dto);
        
        //🔹 Devolvemos una respuesta estandarizada de ÉXITO con tu contrato ApiResponse.
        // 'data' contiene el alumno recién creado que vino del servicio.
        return {
          success : true,                           // ✅ Operación exitosa
          message : 'Alumno creado correctamente',  // 📝 Mensaje informativo para cliente /front
          data : nuevoAlumno                        // 📦 Payload principal (el recurso creado)
        };
      }catch(error){           // 🔹 catch: Si algo falla en el try, se captura aquí.

          // 🔎 Útil para depuración en servidor (No exponer detalles sensibles al cliente).
          console.error(error);

          // 🔹 Respuesta estandarizada de ERROR con el mismo contrato ApiResponse.
          // Aquí retornas null en data porque no hay recurso creado.
          return{
            success : false,                        // ❌ Marca que la operación falló
            message : 'Erros al crear el alumno',   // ⚠️ Mensaje genérico de error para el cliente
            data : null                             // 🚫 No hay datos útiles que devolver2
          };
      }   
    }


    // Declaramos un método asíncrono dentro del controlador
    // 🔹 @Get() -> Es un decorador de NestJS que marca el método como una manejador para las peticiones HTTP GET.
    // Si tu controlador tiene la ruta base /alumnos, este endpoint responderúa a GET/alumnos
    @Get()
    // 🔹 async: Indica que esta función es asíncrona, es decir, que puede ejecutar tareas que toman tiempo (como acceder a una
    //base de datos o API externa) sin bloquear el hilo principal. Gracias a esto podemos usar la palabra clave "await" dentro de ella.
    //
    // 🔹 findAll() -> Es el nombre del método en el controlador. Por convención en NestJS, findAll() se usa para listar todos
    // los registros (patrón CRUD).
    //
    // 🔹 : Promise<ApiResponse<any[]>>: 
    // 📘 Significa que la función devuelve una promesa que, cuando se resuelve, contendrá un valor del tipo ApiResponse
    // 👉🏼 Promisa<T> => representa una tarea asincrónica que eventualmente devolverá un valor de tipo T o lanzará un error.
    // Una promesa puede estar en tres estados: pending (aun no termina) , fullfilled (terminó correctamente), rejected (error)
    // 👉🏼 ApiResponse : Es el tipo genérico que tú creaste para estandarizar todas las respuestas. Contiene propiedades como:
         // success, message y data.
    // 🔹 Alumno[] : Es el tipo de dato específico que contendrá el campo data dentro de ApiResponse. Como este método devuelve
       // una lista de alumno, se usa Alumno[] (arreglo de alumno)  
    async findAll() : Promise<ApiResponse<Alumno[]>>{
      // 🔹 try: indica el bloque donde intentamos ejecutar código que podría fallar.
      // Si algo falla lanza un error dentro de este bloque (por ejemplo, un fallo en la base de datos), el flujo pasará
      // automáticamente al bloque "catch".
      try{

        // 🔹 const alumnos = ...
        // Crea una variable llamada "alumnos" que almacenará el resultado del servicio.


        // 🔹 this.alumnoService.findAll() -> Llama al método "findAll()" de tu servicio "alumnoService", el cual 
        //hace una consulta a la base de datos usando un repositorio.
        // Devuelve una promesa porque consulta la base de datos.


        // 🔹 await : 
        // Pausa temporalmente la ejecución de esta función hasta que la Promesa devuelta por "findAll()"" se resuelva.


        const alumnos = await this.alumnoService.findAll();


        // 🔹 return {...} : Devuelve un objeto JSON con la respuesta estándar.
        return {
          success : true, // Indica que la operación fue exitosa
          message : 'Listado de alumnos', // Mensaje informativo que describe la acción que se realizó
          data : alumnos, // Contiene la información obtenida desde el servicio, en este caso, el arreglo de alumnos que proviene
          //de la base de datos.
        };
      }catch(error){ 
        // 🔹 catch(error) : Captura cualquier error que haya ocurrido dentro del bloque "try"
        // si por ejemplo, la base de datos no responde, o el método del servicio lanza una excepción, el flujo del programa entra aquí
        // 🔹 error : Es la variable que contendrá el detalle del error (podemos imprimirlo con console.error(error) si deseas). 
        
        // 🔹 return {...} devuelve otra respuesta estructurada, pero esta vez indicando fracaso.
        return{
          success : false, // Marca que la operación falló
          message : 'Error al obtener el listado de alumnos', // Mensaje genérico de error, útil para mostrar en el cliente (por
          //ejemplo, un Toast en Android o React)
          data : [], // Como el tipo declarado es ApiResponse<any[]>, se devuelve un array vacío para mantener la compatibilidad
          //del tipo (si prefieres, podrías devolver null y ajustar a ApiResult<any[] | null>).
        }

      }
      
    }

}
