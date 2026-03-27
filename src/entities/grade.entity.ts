import { 
    Column,           // 🧱 Define una columna en la tabla
    CreateDateColumn, // ⏰ Se llama automáticamente con la fecha de creación
    Entity,           // 🏛️ Marca la clase como una entidad (tabla en BD)
    Index,            // 🔍 Crea índices para búsquedas rápidas
    JoinColumn,       // 🔗 Define la columna de unión (FK explícita)
    ManyToOne,        OneToMany,        // 🤝 Relación muchos-a-uno (muchos grados -> año escolar)
    PrimaryGeneratedColumn,   RelationId,   // 🆔 ID autogenerado
    Unique,                   // 🚫 Restringe duplicados con combinación de columna
    UpdateDateColumn          // 🔄 Se actualiza automáticamente al modificar el registro
} from "typeorm";

// 🏫 Importamos la entidad "Año escolar" para la relación
import { SchoolYear } from "./school-year.entity";
import { Section } from "./section.entity";

// 🔹 ENUM -> abreviatura de enumeration es una estructura especial del lenguage TypeScript que te permite
// definir un conjunto de valores fijo y predefinidos.
// Sirve para representar opciones limitadas, como categorías, estados o tipos - en lugar de escribir
// cadenas sueltas que podrían tener errores de escritura.
// 🎓 enum que define los niveles educativos posibles. 
export enum GradeLevel{
    PRIMARIA = 'PRIMARIA',     // 📘 Educación primaria (1.º a 6.º)
    SECUNDARIA = 'SECUNDARIA'  // 🎓 Educación secundaria (1.º a 5.º)
}

// 🏛️ Definimos la entidad "grandes" -> se convierte en una tabla en PostgreSQL
@Entity('grades')
// 🚫 Evita duplicar grados en el mismo año escolar
// La combinación ('shoolYear','level','gradeNumber') debe ser única
@Unique(['schoolYear', 'level', 'gradeNumber'])
export class Grade{

    // 🆔 Identificador único (UUID)
    // Se genera automáticamente como un UUID (identificador universal)
    // Es la clave primaria (PRIMARY KEY) de la tabla
    @PrimaryGeneratedColumn('uuid')
    id: string;

    // 🔢 Nombre de grado
    // PRIMARIA : 1..6
    // SECUNDARIA : 1..5
    // ✅ Este campo ES el que usarás para ordenar 

    @Column({type: 'int', name  : 'grade_number'})
    @Index() // 🔍 Mejora el rendimiento al buscar o filtrar por nombre.
    gradeNumber : number;

    // 🎯 Nivel educativo de grado.
    // Usa el ENUM definido arriba (PRIMARIA, SECUNDARIA), lo que garantiza que solo se pueden
    // guardar esos valores.
    // También lo indexamos para filtrar más rápido por nivel.
    @Column({type: 'enum', enum : GradeLevel})
    @Index() // 🔍 Así las consultas por nivel (ej: todos los de SECUNDARIA) serán más eficientes
    level : GradeLevel; 
    
    // ✅ Indica si el grado está activo o no dentro del sistema.
    // Por defecto es true. Si se marca false, puede ocultarse en listados.
    @Column({type: 'boolean', default: true})
    isActive: boolean;

    // 🔒 Indica si el grado está cerrado (por ejemplo, al finalizar el año escolar).
    // Si está en true, ya no se pueden editar notas, alumnos o cursos del grado.
    @Column({type:'boolean', default: false})
    isClosed: boolean;

    // ⏰ Fecha en la el registro fue creado.
    // Se asigna automáticamente al insertar un nuevo registro.
    // Ejemplo : "2025-11-01 13:09:24.229864"
    @CreateDateColumn()
    createdAt: Date;

    // 🔄 Fecha en la que el registro fue modificado por última vez.
    // TypeORM actualiza este campo automáticamente al hacer un update.
    // Ejemplo : "2025-11-01 13:09:24.229864"
    @UpdateDateColumn()
    updatedAt: Date;

    // 🧩 Relación muchos grados -> un año escolar
    @ManyToOne(() => SchoolYear, (schoolYear) => schoolYear.grades,{
        onDelete: 'CASCADE', // 💣 Si se borra el año escolar, automáticamente se eliminan todos sus grados.
        nullable : false,    // 🚫 No puede haber un grado sin año escolar (relación obligatoria)
    })
    // 🪶 JoinColumn crea la columna "school_year_id" en la tabla "grades" y la define como clave foránea (FK).
    // Así sabremos a qué año pertenece cada grado.
    @JoinColumn({name: 'school_year_id'})
    schoolYear : SchoolYear;


    // ✅ ID derivado de la relación (No crea otra columna)
    // 🔹 schoolYearId no es una columna creada por ti, es un valor derivado de la relación
    // 👉 Solo te expone el UUID del schoolYear para usarlo en filtros/DTOs
    @RelationId((grade : Grade) => grade.schoolYear)
    schoolYearId : string;


    // 🧩 Relación con Section - relación inversa con Section
    // 👉🏼 Esta relación NO tiene la FK; la FK vive en Section (propiedad 'grade').
    // Aquí solo "leemos" el arreglo de secciones que apuntan a este Grade.

    // 🔹 OneToMany() -> Decorador de TypeOrm para 1...N (uno a muchos) 
    // ⭐️ Un grado tiene solo las secciones que apuntan a él mediante la FK
    // ⭐️ Piensa en cada tabla "grades" y "sections" como cajas:
    // La tabla "sections" tiene una columna grade_id que "etiqueta" a qué caja pertenece cada sección.
    @OneToMany(
        // 🔹 Entidad destino
        () => Section, 
        // 🎯 Debe coincidir con la propiedad del @ManyToOne en Section
        section => section.grade) //
    // 📦 Arreglo con todas las secciones que pertenecen a este grado específico
    sections: Section[];
 

}