//Aquí importas la función PartialType
//Esta función sirve para transformar otro DTO en uno nuevo, pero con todos los campos opcionales.
//Viene del paquete @nestjs/mapped-types.
import { PartialType } from "@nestjs/mapped-types";
//Importas el DTO original que define cómo se crea un alumno.
import { CreateAlumnoDto } from "./create-alumno.dto";



//Aquí defines la clase UpdateAlumnoDto.
//Usas extends PartialType (CreateAlumnoDto) para heredar todos los campos de CreateAlumnoDto,
//pero automáticamente los convierte en opcionales
export class UpdateAlumnoDto extends PartialType(CreateAlumnoDto){

}


//🚀 ¿Por qué se usa así en NestJS?
//En una API REST:
// - POST/alumnos -> se usa CreateAlumnoDto, porque necesitas todos los datos para crear.
// - PATCH/alumnos/:id -> se usa UpdateAlumnoDto, porque solo quieres modificar algunos datos del alumno.
//Así evitar duplicar código y mantienes tus DTOs consistentes.

//📌 En resumen:
//PartialType(CreateAlumnoDto) = hace que todos los campos del DTO original sean opcionales.
//UpdateAlumnosDto = DTO ideal para actualizaciones en tu API. 