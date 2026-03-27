import { NestFactory } from "@nestjs/core";
import { AppModule } from "src/app.module";
import { Rol } from "src/entities/rol.entity";
import { Repository , DataSource} from "typeorm";

// ejecutar seed => npm run seed:role

// ⭐️ async -> convierte una función en asíncrona y hace que deuvelva una Promise
// 🔹 Una función asícrona es una función que puede esperar operaciones que toman tiempo y devuelve una promesa.
// 🔹 Una función asincrona es una función que trabaja con promise y permite usar await
// Piensalo asi:
// - función normal -> devuelve un valor inmediato
// - función async  -> devuelve un valor mas tarde

// ⭐️ await -> Hace que la función espere el resultado de una Promise antes de continuar
// ⭐️ promise -> una promise es un objeto que representa un valor que todavía no existe, pero existirá en el futuro
//.  la promesa puede tener 3 estados: 
//.  pending -> esperando , fulfilled -> éxito , rejected -> error

// ⭐️🧠 Memoriza esto: Una promesa es un resultado que llegará en el futuro y await espera a que la promesa termine.

// 🔹 Función asíncrona principal que ejecutará la carga inicial (seeding) de los roles básicos en la base de datos.
async function run(){

    // ⭐️ En un ejemplo normal tendríamos : Controller -> DTO -> Service -> Repository
    // Pero en tu seed no hay HTTP ni usuario externo
    // En el seed tú controlas los datos, no vienen del frontend
    // La regla en seed normalmente es: Entity -> Repository - Datos directos

    // ⭐️ Cuando veamos await , piensa : "Esta función se pausa, pero el programa no"

    // ✅ Levanta NEST sin servidor HTTP, solo para usar: TypeORM, repositorios y servicios
    // ✅ Creamos una instancia temporal de la app Nest para acceder a los servicios.
    const app = await NestFactory.createApplicationContext(AppModule);

    // ✅ Obtenemos el DataSource (conexión activa a la BD).
    const ds = app.get(DataSource);

    // ✅ Obtenemos el repositorio de la entidad Rol para hacer operaciones CRUD.
    const rolRepo : Repository<Rol> = ds.getRepository(Rol);

    //✅  Lista de roles base del sistema que queremos insertar sólo si no existen
    const defaultRoles = [
        {name : 'GUARDIAN', description : 'Apoderado o responsable del estudiante'},
        {name : 'STUDENT', description : 'Estudiante del sistema escolar'},
        {name : 'TEACHER', description : 'Docente del sistema escolar'},
        {name : 'ASSISTANT', description: 'Personal de apoyo administrativo'},
        {name : 'ADMINISTRATOR', description: 'Administrador con control total del sistema'},
    ];

    // ✅ Recorremos cada rol definido en la lista
    for(const rolData of defaultRoles){
    // 🔎 Buscamos si ya existe un rol con ese nombre en la base de datos.
    // - findOne({where: {nombre: rolData.nombre}}) verifica coincidencia exacta.
    const exist = await rolRepo.findOne({where:{name: rolData.name}});

    if(!exist){
        // 🟢 Si no existe, lo guardamos en la base de datos.
        await rolRepo.save(rolData);
        console.log(`✅ Rol creado: ${rolData.name}`);
    }else{
        // 🔵 Si no existe, solo lo notificamos por consola.
        console.log(`⏭ Rol ya existe: ${rolData.name}`);
    }
}
    // ✅ Cerramos la aplicación Nest para liberar recursos.
    await app.close();
}


// Ejecutamos la función y capturamos cualquier error si falla.

// 🔹 run() -> Llama a tu función async del seed
// Como run es "async", devuelve una Promise

// 🔹 .catch((e) => {...})
// Esto captura cualquier error no controlado dentro de "run()"
// Por ejemplo: falla la conexión a la BD, error en TypeORM, error en NestFactory
// Si no ponemos esto, Node puede terminar silenciosamente o mostrar un warning

run().catch((e) => {
    console.error(e); // 💬 Imprimimos un mensaje de error en consola
    // Esto es importante, le dice a node "El script terminó con error"
    // Convención : 0 -> éxito , 1 -> error
    process.exit(1); // ❌ Finaliza el proceso con error
})

// ✅ ¿Qué hace este archivo?
// 1️⃣ Crea una instancia de la app Nest para interactuar con TypeOrm.
// 2️⃣ Obtiene el repositorio de Rol.
// 3️⃣ Define una lista de roles por defecto.
// 4️⃣ Verifica si existen en la BD.
// 5️⃣ Los crea si no existen (evita duplicados).
// 6️⃣ Cierra la app.