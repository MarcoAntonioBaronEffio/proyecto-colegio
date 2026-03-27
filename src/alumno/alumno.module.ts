//🔹 @nestjs/common contiene los decoradores y utilidades básicas de NestJS.
//Module se usa para decirle a Nest que este archivo es unn módulo.
import { Module } from '@nestjs/common';

//🔹 TypeOrmModule conecta este módulo con TypeORM, que maneja la base de datos en NestJS.
import { TypeOrmModule } from '@nestjs/typeorm';

//🔹 Importa el servicio y el controlador que vas a definir para este módulo.
import { AlumnoController } from './alumno.controller';
import { AlumnoService } from './alumno.service';

//🔹 Importa la entidad Alumno (tu tabla en la BD).
// Esto es clave porque TypeOrmModule.forFeature([Alumno]) necesita saber qué entidad mapear.
import { Alumno } from 'src/entities/alumno.entity';



 


@Module({
    // 🟢 imports:
    // TypeOrmModule.forFeature([Alumno]):
    //Esto registra el repositorio de la entidad Alumno dentro del módulo.
    //Nest necesita saber qué entidad debe registrar en este módulo para poder crear el repositorio correspondiente
    // 🔹 ¿Qué es un repositorio?: Un repositorio es un objeto que te da TypeORM automáticamente para trabajar con una tabla/entidad
    //de tu base de datos.
    // Si 'Alumno' es tu entidad (la clase decorada con @Entity()), entonces TypeORM crea detrás de cámaras un Repository<Alumno>.
    // Este repositorio ya tiene métodos listos para hacer consultas:
    //.   - .find() -> traer todos los alumnos
    //.   - .findOne() -> traer un alumno específico
    //.   - .save() -> guardar o actualizar un alumno
    //.   - .delete() -> eliminar un alumno
    // Tú no creaste manualmente un repositorio, lo genera TypeORM en base a tu entidad.
    // Este repositorio será el intermediario entre tu Servicio(AlumnoService) y la BD real (PostgreSQL), tú no tienes que 
    //implementar manualmente los métodos CRUD como en Jetpack Compose.
    // ✅ Resumen:
    // - Entidad(Alumno) = la clase que representa tu tabla.
    // - Repositorio (Respository<Alumno>) = objeto que TypeORM crea para ti y que tiene métodos para hablar con la base de datos.
    // - TypeOrmModule.forFeature([Alumno]) = le dice a NestJS: "quiero que me habilites el repositorio de Alumno en este módulo".
  imports: [
    TypeOrmModule.forFeature([Alumno]),
  ],
  //🔹controllers
  // - Registra los controladores que manejarán las rutas HTTP de este módulo.
  // - Aquí es AlumnoController, que tendrá endpoints como GET/alumnos, POST/alumno, etc.
  controllers: [AlumnoController],

  //🔹 providers
  // - Son los servicios que maneja Nest en este módulo.
  // - Aquí es AlumnoService, que contiene la lógica de negocio (ejemplo: buscar alumnos, crear, eliminar).
  providers: [AlumnoService],

  //🔹 exports
  // exports: [TypeOrmModuke]:
  // - Esto es opcional.
  // - Sirve si quieres que otros módulos (por ejemplo, CursoModule) pueden usar también el Repository<Alumno> sin 
  // volver a configurarlo.
  exports : [TypeOrmModule],
})

//Declara la clase que Nest reconoce como módulo.
//El decorador @Module ya le dice a Nest qué contiene.
export class AlumnoModule {}













//🚀 En resumen
//Tu módulo AlumnoModule:
// - Conecta la entidad 'Alumno' con TypeORM (para que tengas repositorio listo).
// - Expone el servicio 'AlumnoService' (lógica de negocio).
// - Expone el controlador 'AlumnoController' (endpoints HTTP).
// - Opcionalmente exporta TypeOrmModule, por si otros módulos necesitan usar la entidad.

