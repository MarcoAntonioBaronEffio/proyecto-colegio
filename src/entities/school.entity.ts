import { Column, CreateDateColumn, Entity, Index, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { SchoolYear } from "./school-year.entity";
import { User } from "./users.entity";

// 🏫 ESTADO DEL COLEGIO DENTRO DEL SAAS
export enum SchoolStatus{
    // ✅ Colegio activo y con acceso normal al sistema
    ACTIVE = 'ACTIVE',
    // 🎁 Colegio en periodo de prueba
    TRIAL = 'TRIAL',
    // 🚫 Colegio suspendido (por ejemplo, falta de pago)
    SUSPENDED = 'SUSPENDED',
    // ❌ Colegio deshabilitado definitavamente
    INACTIVE = 'INACTIVE'
}

// 🏛️ Tipo de institución educativa
export enum InstitutionType{
    // 🏛️ Institución pública / estatal
    PUBLIC = 'PUBLIC',       
    // 💰 Institución privada
    PRIVATE = 'PRIVATE',     
    // 🤝 Institución de convenio
    AGREEMENT = 'AGREEMENT'  
}

// 🎓 Niveles educativos ofrecidos
export enum LevelsOffered{
    // 👶 Inicial
    INITIAL = 'INITIAL', 
    // 🧒  Primaria
    PRIMARY = 'PRIMARY', 
    // 🧑‍🎓 Secundaria
    SECONDARY = 'SECONDARY', 
     // 🧩 Primaria + Secundaria
    BOTH = 'BOTH',
    // 🌎 Inicial + Primaria + Secundaria
    ALL = 'ALL' 
}

// 🏫 Esta entidad representa a un colegio / institución educativa
// 🔹 En arquitectura Saas: Cada registro representa un colegio diferente. 
// 🔹 Ejemplo: Colegio San Joaquin, Colegio Javier Heraud, Colegio Amancio Varona
// 🔹 Todas compartirán el mismo backend, pero cada uno tendrá sus propios usuarios, años escolares, grados, secciones, matrículas


@Entity({name : 'schools'}) // 🗃️ Nombre real de la tabla en la BD
export class School {

    // ==============================================
    // 🆔 Identidad
    // ==============================================

    // 🆔 Identificador único global del colegio, PostgreSQL generará automáticamente un UUID
    @PrimaryGeneratedColumn('uuid')  
    id! : string;  

    // ==============================================
    // 🏷️ INFORMACIÓN GENERAL
    // ==============================================

    // 🏫 Nombre oficial del colegio
    // 🔹 Ejemplo: I.E. San Joaquín
    @Index() // 🔎 Indice para búsquedas por nombre (listados, filtros)
    @Column({type: 'varchar', length: 150, nullable: false}) // 🏫 Nombre obligatorio
    name! : string;  

    // 🔑 Código interno único del colegio
    // 🔹 Se usa para identificar rápidamente la institución
    // 🔹 Ejemplo: SANJOAQUIN, JAVIERHERAUD
    @Column({type: 'varchar', length: 50, nullable: false, unique: true}) // 🧩 Código único
    code! : string; // 🧩 Código interno (Ej: "JAVIERHERAUD", "IEJAVIERHERAUD")

    // 🌐 Slug amigable para URLs
    // 🔹 Ejemplo: san-joaquin , javier-heraud
    // 🔹 Futuro: https://app.com/san-joaquin | https://app.com/javier-heraud
    @Column({
        type:'varchar',
        length: 100,
        unique: true,
        nullable : true
    })
    slug?: string;

    // 🧾 RUC institucional
    // 🔹 Opcional porque algunos colegios podrían registrarse inicialmente sin completar esta información
    @Column({
        type: 'varchar',
        length: 11, 
        nullable: true,
        unique: true
    })
    ruc?: string;

    // 📍 Dirección física
    @Column({type: 'text', nullable: true})  
    address?: string;  

    // 📞 Teléfono institucional
    @Column({type : 'varchar', length: 20, nullable: true})  
    phone?: string;  

    // 📧 Correo institucional
    @Index() // 🔎 Búsqueda rápida por email si algún día filtras instituciones
    @Column({type: 'varchar', length: 150, nullable: true}) // 📧  Email (opcional)
    email?: string; // 📧 Correo institucional

     // 👨‍🏫 Nombre de director
     // ⚠️ Solo texto visual. No tiene relación con la tabla User
    @Column({name: 'director_name', type: 'varchar', length: 150, nullable : true})
    directorName?: string;  

    // ==============================================
    // 🖼️ Branding 
    // ==============================================

    // 🖼️ Logo institucional
    @Column({name: 'logo_url', type: 'text', nullable: true}) // 🖼️ url del logo (opcional)
    logoUrl?: string;

    // 🏞️ Imagen de portada para dashboard/app
    @Column({name : 'cover_image_url', type: 'text', nullable : true})  
    coverImageUrl?: string;
    
    // ==============================================
    // 🌎 Ubicación (útil y realista)
    // ==============================================

    // 🇵🇪 Departamento
    // 🔹 Ejemplo: Lambayeque , La Libertad
    @Column({type: 'varchar', length: 80, nullable : true})  
    department?: string; 

    // 🏙️ Provincia
    // 🔹 Ejemplo: Chiclayo
    @Column({type: 'varchar', length: 80, nullable : true})  
    province?: string;  

    // 🧾 Distrito
    // 🔹 Ejemplo: Tumán, José Leonardo Ortiz
    @Column({
        type: 'varchar',
        length: 80,
        nullable: true
    })
    district?: string;

    // ===============================================
    // 🏛️ Configuración académica 
    // ===============================================

    // 🏛️ Tipo de institución
    @Column({
        name : 'institution_type',
        type: 'enum', // 🧩 Enum en PostgreSQL
        enum : InstitutionType, // 🧩 Valores permitidos
        default: InstitutionType.PRIVATE // ✅ Defult seguro
    })
    institutionType!: InstitutionType; // 🏛️ Pública / Privada / Otro

    // 🎓 Niveles que ofrece el colegio
    @Column({
        name: 'levels_offered',
        type:'enum', // 🧩 Enum en PostgreSQL
        enum: LevelsOffered, // 🧩 Valores permitidos
        default: LevelsOffered.BOTH, // ✅ Default común (Primaria + Secundaria)
    })
    levelsOffered!: LevelsOffered;  

    // ===============================================
    // 💳 Información SaaS
    // ===============================================

    // 📅 Fecha hasta la cual tiene acceso
    // 🔹 Ejemplo: 
    // 👉 Trial hasta el 15 de agosto
    // 👉 Pago hasta el 30 de diciembre
    @Column({
        name: 'subscription_expires_at',
        type: 'timestamptz',
        nullable: true
    })
    subscriptionExpiresAt?: Date;

    // ===============================================
    // ✅ Estado
    // ===============================================
    @Index()
    @Column({
        type : 'enum',
        enum : SchoolStatus,
        default: SchoolStatus.TRIAL
    })
    status!: SchoolStatus;

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
    createdAt! : Date; // 🕒 Fecha de creación

    @UpdateDateColumn({name: 'updated_at', type: 'timestamptz'}) // 🔁 Se actualiza automáticamente al editar
    updatedAt! : Date; // 🔁 Fecha de última actualización

    // ===============================================
    // 🔗 Relaciones
    // ===============================================

    // 🗓️ Un colegio puede tener múltiples años escolares
    // 🔹 Ejemplo: 2025, 2026, 2027
    @OneToMany(
        () => SchoolYear, // 🗓️ Entidad hija
        (schoolYear) => schoolYear.school, //🔙 Propiedad inversa en SchoolYear
    )
    schoolYears!: SchoolYear[]; // 🗓️ Un colegio tiene muchos años escolares


    

    // 👥 Un colegio tiene muchos usuarios
    // 🔹 Ejemplo: Administradores, Docentes, Apoderados
    // ⚠️ Esta relación es CLAVE para convertir el sistema en multicolegio SaaS
    @OneToMany(
        () => User,
        (user) => user.school
    )
    users!: User[]

    
}