import { Module } from '@nestjs/common'; 
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlumnoModule } from './alumno/alumno.module';
import { RolesModule } from './modules/roles/roles.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { SchoolYearsModule } from './school-years/school-years.module';
import { GradesModule } from './grades/grades.module';
import { SectionModule } from './section/section.module'; 
import { StudentModule } from './student/student.module';
import { SchoolModule } from './school/school.module'; 
import { ClassroomModule } from './classroom/classroom.module';
import { User } from './entities/users.entity';
import { Rol } from './entities/rol.entity';
import { Student } from './entities/student.entity';
import { Administrator } from './entities/administrator.entity';
import { Teacher } from './entities/teacher.entity';
import { Guardian } from './entities/guardian.entity';
import { School } from './entities/school.entity';
import { SchoolYear } from './entities/school-year.entity';
import { Grade } from './entities/grade.entity';
import { Section } from './entities/section.entity';
import { Classroom } from './entities/classroom.entity';
import { EnrollmentService } from './enrollment/enrollment.service';
import { EnrollmentModule } from './enrollment/enrollment.module';



@Module({
  //imports: aquí definimos qué módulos externos va a usar tu aplicación NestJS en la raíz.
  imports: [ 
    ConfigModule.forRoot({ //Importamos el módulo de configuración de Nest.
      //ConfigModule es el módulo que carga tu archivo ".env" y lo deja disponible.
      //Si no incluyeras ConfigModule aquí, tu useFactory no tendría acceso a ConfigService (porque no sabría de donde viene)
       //Significa que las variables de tu .env estarán disponibles en toda la aplicación sin necesidad de importar ConfigModule
       //en cada módulo.
       //👉🏼 En otras palabras: con esto puedes usar ConfigService en cualquier parte de tu app para leer variables de entorno como
       //DB_HOST, DB_PORT,etc.
      isGlobal: true,  
      envFilePath: '.env'   
    }),
    //TypeOrmModule.forRootAsync -> Configura la conexión a la base de datos con TypeORM de forma asíncrona.
    //¿Por qué asíncrona? Porque muchas veces necesitas leer valores del ".env" (host, usuario, contraseña) antes de conectarte.
    TypeOrmModule.forRootAsync({ 
      //[ConfigModule] -> Importamos el módulo que "carga" el archivo ".env" cuando arranca la app, no los leemos nada
      //directamente aquí , así TypeORM puede usar las variables de entorno a través del ConfigService.
      imports : [ConfigModule],
      //[ConfigService] -> Es un servicio que Nest te da gracias al ConfigModule. Con él puedes acceder a los valores dentro del .env.
      // Le decimos a Nest que debe inyectar el servicio de configuración.
      //Este servicio es el que nos da acceso a las variables del archivo ".env".
      //Gracias a esto, dentro de useFactory podemos usar config.get("NOMBRE_VARIABLE")
      inject : [ ConfigService],

      //useFactory -> Es una función "fábrica" que construye y devuelve la configuración de TypeORM.
      //Aquí defines qué valores usar para la conexión (host, puerto, usuario, etc.).
      //Recibe el ConfigService como parámetro (inyectado por NestJS), y con él se leen las variables del archivo ".env" para
      //armar el objeto con conexión.
      useFactory : (config: ConfigService) => ({
        //Lo que devuelve ({type: 'postgres, ...}) es lo que TypeORM usará para conectarse a tu base de datos.
        type: 'postgres', //Aquí indicas qué tipo de base de datos usas. En este caso: PostgreSQL.
        // ❌ Si estás trabajando con base local (no con Railway, Supabase, Render, etc) , elimina la "url" y deja los campos
        //por separado.
        //url : process.env.DATABASE_URL,
        //✅ Conexión usando variables individuales del .env.
        //Con estas líneas estás leyendo valores del archivo ".env"
        //Cada config.get<T>('...') toma ese valor y lo pasa a la configuración de TypeORM.
        host: config.get<string>('DB_HOST'),         //  Dirección del servidor de BD (ej: localhost, 127.0.0.1, etc.)
        port: config.get<number>('DB_PORT'),         // Puerto donde escucha PostgreSQL (por defecto 5432)
        username: config.get<string>('DB_USER'),     // Usuario de la base de datos (ej: postgres, admin, etc.)
        password: config.get<string>('DB_PASS'),     // Contraseña del usuario de la base de datos
        database: config.get<string>('DB_NAME'),     // Nombre de la base de datos (ej: escuela_db)

        //autoLoadEntities: true -> Normalmente tendrías que registrar manualmente cada Entity en el módulo.
        //Entonces, esto carga automáticamente todas las entidades que definamos ((clases con @Entity) que representan
        //tablas en la BD)e
        autoLoadEntities: true, 
        entities: [User, Rol, Administrator,  Student, Teacher, Guardian, School, SchoolYear, Grade, Section, Classroom ],
        //synchronize: true -> ⚠️ Solo en desarrollo
        //Hace que TypeORM cree/modifique las tablas automáticamente basándose en nuestras entidades.
        //En producción se recomienda usar migraciones para más control.
        synchronize: true,
      })
    }),
    RolesModule,//✅ Registramos el módulo de roles para que Nest lo cargue al iniciar.
    AlumnoModule, 
    UsersModule, 
    AuthModule, 
    SchoolYearsModule, 
    GradesModule, 
    SectionModule, StudentModule, SchoolModule, ClassroomModule, EnrollmentModule,
    //✅ En resumen: Este bloque configura NestJS para leer variables del ".env" y con ellas conectarte a PostgreSQL usando TypeORM,
    //cargando automáticamente las entidades y, en modo desarrollo, creando las tablas 
  ]
})
export class AppModule {}


//📌 Idea general
// ConfigModule = el "contenedor" que carga el ".env".
// ConfigService = la "llave" para sacar un valor de ".env"

//📖 Analogía sencilla
//Imagina que tu ".env" es como un libro de recetas con muchos ingredientes escritos.
// - ConfigModule 📦 -> Es el estante donde colocas ese libro en tu cocina.
// - ConfigService 🔑 -> Es el cocinero que abre el libro y te dice:
   //¿Quieres sal? Aquí está (DB_HOST).
   //¿Quieres harina? Aquí está (DB_USER).
// 👉🏼 Si tienes solo el estante (ConfigModule) pero no el cocinero (ConfigService), nadie te pasa los ingredientes.
// 👉🏼 Si tienes el cocinero (ConfigService) pero no pusiste el libro en el estante (ConfigModule), no hay de dónde leer.

//🚀Flujo rápido
//1.- ConfigModule lee tu archivo ".env"
//2.- inject: [ConfigService] hace que Nest te pase una instancia de ese servicio dentro de userFactory.
//3.- Dentro de useFactory, usas ese servicio (config) para acceder a las variables (DB_HOST, DB_USER, etc).