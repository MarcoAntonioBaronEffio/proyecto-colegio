import { NestFactory } from "@nestjs/core";
import { AppModule } from "src/app.module";
import { School } from "src/entities/school.entity";
import { DataSource, Repository } from "typeorm";

// ejecutar seed => npm run seed:school


// ⭐️ Función principal del seed
async function run(){

    // 🚀 Levantamos Nest sin servidor HTTP
    const app = await NestFactory.createApplicationContext(AppModule);

    // 🔌 Obtenemos la conexión a la BD
    const ds = app.get(DataSource);

    // 📦 Repositorio de School
    const schoolRepo : Repository<School> = ds.getRepository(School);

    // 🏫 Colegio por defecto del sistema
    const defaultSchool = {
        name : 'Colegio Demo',
        code : 'DEFAULT',
        isActive : true,
    };

    // 🔎 Buscamos si ya existe por código (clave única lógica)
    const exist = await schoolRepo.findOne({
        where : {code : defaultSchool.code},
    });

    if(!exist){
        await schoolRepo.save(defaultSchool);
        console.log(`✅ School creada: ${defaultSchool.name}`);
    } else{
        console.log(`⏭ School ya existe: ${defaultSchool.name}`);
    }

    // 🔚 Cerramos Nest
    await app.close();

}

// 🧯 Captura de errores
run().catch((e) => {
    console.error(e);
    process.exit(1);
});