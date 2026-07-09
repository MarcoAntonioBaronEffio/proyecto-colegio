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

  // 🧱 Registramos un ValidationPipe global
  // 👉 Se aplicará automáticamente a todos los controladores y endpoints
  app.useGlobalPipes(
    new ValidationPipe({ 

      // 🔄 Convierte automáticamente el JSON recibido a una instancia de la clase DTO correspondiente
      // 👉 Esto permite que class-transformer ejecute decoradores como @Transform(), @Type(), entre otros
      /* 🔥 Ejemplo, ❌ Sin transform:true : 
          {
            "email" : " MARCO@GMAIL.COM"
          }
      👉 Llega como un objeto plano: { "email": " MARCO@GMAIL.COM"} ⬅️ No existe un LoginDto real, por lo que @Transform() no se ejecuta
    
      🔥 Ejemplo, ✅ Con transform:true
          {
            "email" : " MARCO@GMAIL.COM"
          }
      👉 Primero se crea una instancia de:

      class LoginDto{
          @Transform(({ value })) => value.trim().toLowerCase())
          email!: string
      }
    
      👉 Y el resultado será:
      LoginDto{
          email: "marco@gmail.com"
      }
      
                                             transform: true
      🔹 Es decir: JSON recibido ➡️ ValidationPipe   ➡️   Instancia de LoginDto ➡️ Se ejecuta @Transform(), @Type() ➡️ Se ejecutan las validaciones de class-validator
      */
      // ⚠️ transform: true no convierte automáticamente los tipos primitivos (por ejemplo : "35" -> 35)
      // 🔹 Para ello puedes utilizar: 
      // @Type(() => Number) | enableImplicitConversion: true
      // 💡 enableImplicitConversion suele ser más útil en Query Params, ya que estos siempre llegan como cadenas de texto
      //.   Ejemplo: GET /students?page=1&limit=20 ⬅️ Aqui si usarías enableImplicitConvertion, porque en los Query Params todos los valores llegan como texto
      transform: true,  




     
      // 🛡️ Conserva únicamente las propiedades que tienen decoradores de class-validator dentro del DTO
      // 👉 Las propiedades adicionales enviadas por el cliente se eliminan
      // 👉 Si una propiedad existe en el DTO pero no tiene ningún decorador de validación, también será eliminada

      // 🔥 whitelist realmente hace dos cosas:
      // 🔹 Elimina propiedades que no existen en el DTO
      // 🔹 Elimina propiedades que existen en el DTO pero que no tienen decoradores de class-validator

      // ⭐️ Ejemplo:
      /* export class LoginDto{
         @IsEmail()
         email!: string;
         password!: string
      }  
      
      👉 Y el cliente envía: { "email" : "marcobe@gmail.com", "password": "123456" }
      🔹 Después de ValidationPipe con whitelist: true, quedará: { email : "marco@gmail.com"}
      🧠 ¿Por qué desapareció password? -> Porque no tenía ningún decorador de validación (@IsString(), @IsNotEmpty(), etc)

      // ⭐️ Ejemplo 2:
      
      export class LoginDto{
        @IsEmail()
        email!: string;
        @IsString()
        password!: string;
      }

      👉 El cliente envía: { "email": "marco@gmail.com", "password": "123456", "role": "ADMIN" }
      🔹 Con whitelist : true, quedaría: { "email": "marco@gmail.com", "password" : "123456" }
      🧠 role desaparece porque no existe en el DTO*/
      whitelist: true,


      // 🚫 Impide que el cliente envíe propiedades no definidas en el DTO
      // 👉 Si detecta alguna, la petición se rechaza con un error HTTP 400 (Bad Request)
      // 👉 Sin esta opción, whitelist simplemente eliminaría esas propiedades y la petición continuaría
      // 👉 Requiere que whitelist esté habilitado
      forbidNonWhitelisted : true, // ❌ Lanza error si mandas propiedades extra
      

      // ⭐️ Flujo interno del ValidationPipe es aproxidamente este
      // 1️⃣ Llega el JSON de la petición
      // 2️⃣ transform: true
      //    🔹 Convierte el JSON en una instancia del DTO
      //    🔹 Se ejecutan los decoradores de class-transformer ( @Transform, @Type, etc )
      // 3️⃣ class-validator
      //    🔹 Ejecuta @IsEmail, @IsString, @MinLength, etc
      // 4️⃣ whitelist
      //    🔹 Elimina las propiedades no permitidas
      // 5️⃣ forbidNonWhitelisted
      //    🔹 Si encontró propiedades extra, lanza un HTTP 400 en lugar de continuar
      // 6️⃣ Se ejecuta el controlador
      

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
  //await app.listen(port);
  await app.listen(port, '0.0.0.0');

  //console.log('🚀 PORT:', port);
  //console.log('🚀 ENV PORT:', process.env.PORT)
}

// 🔹 Llama a la función boostrap(), para que la aplicación NestJS arranque 🚀.
bootstrap();

// 🔑 Resumen
// 🔹 NestFactory.create(AppModule): crea la app.
// 🔹 setGlobalPrefix('api') : pone el prefijo 'api' a todas las rutas.
// 🔹 listen(PORT) : arranca el servidor en el puerto definido.
// 🔹 boostrap() : es la función principal que arranca todo.

