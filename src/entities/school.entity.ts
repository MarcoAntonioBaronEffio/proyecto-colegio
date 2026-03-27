import { Column, CreateDateColumn, Entity, Index, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { SchoolYear } from "./school-year.entity";

// 🧩 Enum opcional para tipo de institución 
export enum InstitutionType{
    PUBLIC = 'PUBLIC', // 🏛️ Pública
    PRIVATE = 'PRIVATE', // 🏫 Privada
    OTHER = 'OTHER' // 🧩 Otro
}

// 🧩 Enum para niveles ofrecidos
export enum LevelsOffered{
    INITIAL = 'INITIAL', // 👶 Inicial
    PRIMARY = 'PRIMARY', // 🧒  Primaria
    SECONDARY = 'SECONDARY', // 🧑‍🎓 Secundaria
    BOTH = 'BOTH', // 🧩 Primaria + Secundaria
    ALL = 'ALL' // 🌎 Inicial + Primaria + Secundaria
}

// 🏫 Esta entidad representa a un colegio / institución educativa
@Entity({name : 'school'}) // 🗃️ Nombre real de la tabla en la BD
export class School {

    // ==============================================
    // 🆔 Identidad
    // ==============================================

    @PrimaryGeneratedColumn('uuid') // 🆔 PK tipo UUID 
    id : string; // 🧾 ID único del colegio

    // ==============================================
    // 🏷️ Datos principales
    // ==============================================

    // 🏷️ Datos principales
    @Index() // 🔎 Indice para búsquedas por nombre (listados, filtros)
    @Column({type: 'varchar', length: 150, nullable: false}) // 🏫 Nombre obligatorio
    name : string; // 🏫  Nombre del colegio (Ej: "I.E. Javier Heraud")

    @Index({unique: true}) // 🔒 índice + UNIQUE (clave corta del colegio)
    @Column({type: 'varchar', length: 50, nullable: false, unique: true}) // 🧩 Código único
    code : string; // 🧩 Código interno (Ej: "JAVIERHERAUD", "IEJAVIERHERAUD")

    @Column({type: 'text', nullable: true}) // 📍 Dirección (opcional)
    address?: string; // 📍 Ubicación / dirección

    @Column({type : 'varchar', length: 20, nullable: true}) // 📞 Teléfono (opcional)
    phone?: string; // 📞 Teléfono institucional

    @Index() // 🔎 Búsqueda rápida por email si algún día filtras instituciones
    @Column({type: 'varchar', length: 150, nullable: true}) // 📧  Email (opcional)
    email?: string; // 📧 Correo institucional

    @Column({name: 'director_name', type: 'varchar', length: 150, nullable : true}) // 👨‍🏫 Director (opcional)
    directorName?: string; // 👨‍🏫 Nombre del director (para reportes)

    // ==============================================
    // 🖼️ Branding / imágenes
    // ==============================================

    @Column({name: 'logo_url', type: 'text', nullable: true}) // 🖼️ url del logo (opcional)
    logoUrl?: string; // 🖼️ Logo del colegio (Storage/Cloud)

    @Column({name : 'cover_image_url', type: 'text', nullable : true}) // 🏞️ Portada (opcional)
    coverImageUrl?: string; // 🏞️ Imagen de portada para dashboard/app
    
    // ==============================================
    // 🌎 Ubicación (útil y realista)
    // ==============================================

    @Column({type: 'varchar', length: 80, nullable : true}) // 🌎 País (opcional)
    country?: string; //🌎 Ej: "Perú"

    @Column({type: 'varchar', length: 80, nullable : true}) // 🏙️ Ciudad (opcional)
    city?: string; // 🏙️ Ej: "Chiclayo"

    @Column({type: 'varchar', length: 80, nullable : true}) // 🧾 Distrito (opcional)
    district?: string; // 🧾 ej : "José Leonardo Ortiz"

    // ===============================================
    // 🏛️ Configuración académica ligera
    // ===============================================

    @Column({
        name : 'institution_type',
        type: 'enum', // 🧩 Enum en PostgreSQL
        enum : InstitutionType, // 🧩 Valores permitidos
        default: InstitutionType.OTHER // ✅ Defult seguro
    })
    institutionType: InstitutionType; // 🏛️ Pública / Privada / Otro

    @Column({
        name: 'level_offered',
        type:'enum', // 🧩 Enum en PostgreSQL
        enum: LevelsOffered, // 🧩 Valores permitidos
        default: LevelsOffered.BOTH, // ✅ Default común (Primaria + Secundaria)
    })
    levelsOffered: LevelsOffered; // 🎓 Niveles que ofrece 

    // ===============================================
    // ✅ Estado
    // ===============================================
    @Index() // 🔎 Filtrado rápido por activo/inactivo
    @Column({name: 'is_active', type: 'boolean', default: true}) // ✅ Activo por defecto
    isActive : boolean; // ✅ Permite desactivar el colegio sin borrarlo

    // ===============================================
    // 🏛️ Fundación del colegio
    // ===============================================
    @Column({
        name : 'foundation_date', // 🧾 Nombre real en BD
        type : 'date', // 📅 Solo fecha (sin hora) - lo correcto aquí
        nullable : true, // 🟡 Opcional (muchos colegios no lo registran al inicio)
    })
    foundationDate? : Date; // 📅 Fecha de fundación del colegio


    // ===============================================
    // 🕒 Auditoria
    // ===============================================
    @CreateDateColumn({name: 'created_at', type: 'timestamptz'}) // 🕒 Se llena automático al crear
    createdAt : Date; // 🕒 Fecha de creación

    @UpdateDateColumn({name: 'updated_at', type: 'timestamptz'}) // 🔁 Se actualiza automáticamente al editar
    updatedAt : Date; // 🔁 Fecha de última actualización

    // ===============================================
    // 🔗 Relaciones
    // ===============================================
    @OneToMany(
        () => SchoolYear, // 🗓️ Entidad hija
        (schoolYear) => schoolYear.school, //🔙 Propiedad inversa en SchoolYear
    )
    schoolYears: SchoolYear[]; // 🗓️ Un colegio tiene muchos años escolares

    
}