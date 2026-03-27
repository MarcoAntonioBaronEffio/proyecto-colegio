// 🧩 Este archivo define el módulo "GradesModule", que agrupa todos los elementos (controladores , 
// servicio y entidades) relacionados con "Grados" del sistema escolar

// 🏗️ Importamos el decorador @Module
// 🔹 Sirve para declarar un módulo (una unidad funcional que agrupa lógica relacionada)
import { Module } from '@nestjs/common';
// 🗃️ Importamos TypeOrmModule para poder usar repositorios y entidades con TypeORM dentro de este módulo.
import { TypeOrmModule } from '@nestjs/typeorm';
//🧠 Importamos el servicio que contiene la lógica de negocio (crear, listar, eliminar grados, etc.).
import { GradesService } from './grades.service';
// 🎮 Importamos el controlador, encargado de manejar las peticiones HTTP relacionadas con los grados.
import { GradesController } from './grades.controller';
// 🧱 Importamos la entidad Grade, que representa la tabla "grades" en la base de datos
import { Grade } from 'src/entities/grade.entity';
import { SchoolYear } from 'src/entities/school-year.entity';

// 🧩 Decorador que marca esta clase como un módulo de NestJS.
// 🔹 Dentro definimos sus partes internas: imports, controllers, providers y exports.
@Module({
  // 🗄️ "imports" permite que este módulo use el repositorio de la entidad "Grade"
  // ⚙️ forFeature() registra la entidad para que TypeORM cree automáticamente el repositorio y lo podamos
  // inyectar en el servicio usando @InjectRepository(Grade).
  imports : [TypeOrmModule.forFeature([Grade, SchoolYear])],
  // 🎮 Aquí registramos el controlador asociado.
  // 🔹 El controlador recibe las solicitudes HTTP (GET, POST, DELETE) y llamar al servicio.
  controllers: [GradesController],
  // 🧠 Aquí registramos los providers (servicios o clases con lógica de negocio).
  // 🔹 Nest los inyecta automáticamente cuando sean requeridos en controladores u otros servicios.
  providers: [GradesService],
  // 📤 "exports" expone el servicio para que otros módulos (por ejemplo, "SchoolModule") pueden usarlo.
  // ✅ Esto es útil si otro módulo necesita acceder a la lógica de los grados (ej: asignar un grado a un alumno).
  exports: [GradesService],
})

// 🏫 Definición final del módulo "GradeModule".
// 🔹 NestJS reconocerá este módulo y podrá cargarlo dentro del AppModule u otros módulos relacionados.
export class GradesModule {}
