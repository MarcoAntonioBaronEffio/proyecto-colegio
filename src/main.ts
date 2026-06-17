// 🔹 Importa NestFactory, que sirve para crear la aplicación NestJS a partir del módulo principal (AppModule).
import { NestFactory, Reflector } from '@nestjs/core';
// 🔹 Importa AppModule, que es el módulo raíz de tu aplicación. Dentro de él se conectan los controladores, servicios y otros módulos
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { JwtAuthGuard } from './auth/jwt-auth-guard';
import { RolesGuard } from './common/guards/roles.guard';

// 🔹 Declara la función boostrap()
// La palabra async significa que dentro usaremos operaciones asíncronas con await.
async function bootstrap() {
  // 👉🏼 Crea la aplicación de NestJS usando el AppModule.
  // 🔹 NestFactory.create(AppModule) -> inicializa la app.
  // 🔹 await -> espera a que termine de crearse antes de continuar.
  // 🔹 const app -> ahora tienes una instancia de la aplicación INestApplication
  const app = await NestFactory.create(AppModule);

  // 🧠 Obtenemos una instancia de Reflector desde el contenedor de Nest
  // 👉 app.get() -> pide una dependencia registrada en Nest
  // 👉 Reflector -> nos permite leer metadata de decorators (@Public , @Roles)
  const reflector = app.get(Reflector);

  // 🛡️ Registramos GUARDS de manera GLOBAL
  // 👉 Se aplicarán automáticamente a todas las rutas (controllers/endpoints)
  // 👉 Ya NO necesitamos usar @UserGuard() en cada controller

  // ⚠️ ORDEN IMPORTANTE (se ejecutan de arriba hacia abajo):
  // 🥇 JwtAuthGuard -> AUTENTICACIÓN (verifica identidad)
  // 🥈 RolesGuard -> AUTORIZACIÓN (verifica permisos)

  // ⭐️ Todas las request pasaran por: 1️⃣ JWTAuthGuard y 2️⃣ RolesGuard
  app.useGlobalGuards(
    // 🔐 JwtAuthGuard (PRIMERO)
    // 👉 Pregunta: ¿Quién eres?
    // 🔍 Lee metadata @Public()
    // - Si es público -> deja pasar SIN token
    // - Si no es público -> existe JWT

    // 🔐 Si hay JWT:
    // 👉 Lo valida usando JwtStrategy
    // 👉 Decodifica el payload
    // 👉 Inserta en el usuario en: request.user = {sub, email, roleName}

    // 💡 Resultado
    // 👉 A partir de aqui ya tenemos al usuario disponible en la request
    new JwtAuthGuard(reflector),

    

    // 🛡️ RolesGuard (SEGUNDO)
    // 👉 Pregunta: "¿Tienes permiso?"
    // 🔍 Lee metadata @Roles()

    // 📌 Casos:
    // 👉 Si NO hay @Roles() -> acceso libre
    // 👉 Si SI hay @Roles():
    //  - Obtiene roles requeridos (ej: ['ADMINISTRATOR])
    //  - Lee request.user.roleName 
    //  - Compara:

    // ☑️ Coincide -> permite acceso
    // ❌ No coincide -> bloquea (403 Forbidden)

    // 💡 IMPORTANTE:
    // 👉 Este guard DEPENDE de JwtAuthGuard
    // 👉 Porque necesita request.user ya definido
    new RolesGuard(reflector)



  );

  // ✅ Habilitar CORS para frontend Vite(Vue)
  app.enableCors({
    // 🌎 Permite cualquier localhost/origen, es decir, acepta el origen que venga en la request
    origin : true,
    // 🍪 Permite cookies/tokens/sesiones
    credentials : true,
    // 📡 Métodos HTTP permitidos
    methods : ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    // 🏷️ Headers permitidos
    allowedHeaders : ['Content-Type' , 'Authorization'],
  });

  // 🧱 Activamos las validaciones globales (DTOs con class-validator)
  app.useGlobalPipes(
    new ValidationPipe({ 
      // 🔹 whitelist -> Solo deja pasar las propiedades que existen en tu DTO y que además tienen decoradores de validación
      // Si envías algo extra (por ejemplo "rol": "ADMIN") cuando no existe en el DTO), se eliminará automáticamente.
      // Si tenemos en nuestro dto solamente : email : String sin decorador, esto se eliminará también 😮.
      // ⭐️ Elimina cualquier propiedad que no exista en tu DTO y que no tenga decorador de validación.
      whitelist: true, // ❌ Elimina las propiedades que NO tienen decoradores de validación en el DTO
      // 🔹 forbidNonWhitelisted -> Si alguien envía un campo no permitido, lanza un error 400 en lugar
      // de simplemente ignorarlo.
      // ⭐️ Hace lo mismo que "whitelist", pero además lanza un error 400 si alguien manda una propiedad
      //no permitida.
      // ⭐️ forbidNonWhitelisted necesita que "whitelist" esté activado. Si no activas "whitelist", 
      //forbidNonWhitelisted no hace nada.
      forbidNonWhitelisted : true, // ❌ Lanza error si mandas propiedades extra
      
      // 1️⃣ Convierte el body en una instancia del DTO: Antes : JSON plano -> Después : Objeto tipado con métodos, transforms, metadata
      // 2️⃣ Activa class-transformer, esto permite usar @Transform , @Type, @Expose. Sin transfor: true -> no se ejecutan
      // ⚠️ Nota: transform NO convierte tipos automáticamente. Para que "age" : "35" -> age: number se necesita: 
      //    - @Type(() => Number) o
      //    - enableImplicitConversion : true
      // 👉 enableImplicitConversion: true NO es necesario si tú controlas en frontend y envias tipos correctos (login/register.)
      // ✅ Útil sobre todo en Query Params (paginación/filtros), porque ahí todo llega como string (?page=1&limit=10).
      // ⭐️ Ejemplo: JSON -> RegisterDto -> StudentDto
      transform: true,  
    })
  )

  // 🔹 Esto establece un prefijo global.
  // Esto significa que todas las rutas de tus controladores comenzarán con /api.
  // Ejemplo: si en tu AlumnoController tienes @Get('alumnos') , la URL real será:
  // http://localhost:3000/api/alumnos
  app.setGlobalPrefix('api');

  //🔹 Levanta el servidor por un puerto específico
  // process.env.PORT -> intenta usar el puerto que venga en las variables de entorno (útil en despliegues en la nube como Heroku)
  // ?? 3000 -> si no encuentra proccess.env.PORT, por defecto usará el puerto 3000.
  // await -> espera a que el servidor está escuchando antes de continuar.
  //await app.listen(process.env.PORT ?? 3000);

  // 📌 FALTA DOCUMENTAR
  const port = process.env.PORT || 3000;
  await app.listen(port);

  console.log('🚀 PORT:', port);
  console.log('🚀 ENV PORT:', process.env.PORT)
}

// 🔹 Llama a la función boostrap(), para que la aplicación NestJS arranque 🚀.
bootstrap();

// 🔑 Resumen
// 🔹 NestFactory.create(AppModule): crea la app.
// 🔹 setGlobalPrefix('api') : pone el prefijo 'api' a todas las rutas.
// 🔹 listen(PORT) : arranca el servidor en el puerto definido.
// 🔹 boostrap() : es la función principal que arranca todo.

