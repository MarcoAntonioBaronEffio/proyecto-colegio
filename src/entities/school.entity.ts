import { Column, CreateDateColumn, Entity, Index, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { SchoolYear } from "./school-year.entity";
import { User } from "./users.entity";

// 🏫 ESTADO DEL COLEGIO DENTRO DEL SAAS
// 👉 Indica la situación actual de la suscripción del colegio
export enum SchoolStatus{

    // 🎁 Colegio en su periodo de prueba gratuita
    // 👉 Se asigna únicamente la primera vez que el colegio utiliza el sistema
    // 👉 Cuando el periodo termina y realiza su primer pago, pasa a ACTIVE
    TRIAL = 'TRIAL',

    // 🪪 Colegio con una suscripción activa
    // 👉 Tiene acceso normal al sistema porque cuenta con una suscripción vigente
    ACTIVE = 'ACTIVE',

    // 🚫 Colegio con el acceso suspendido
    // 👉 Generalmente ocurre cuando la suscripción venció o fue suspendido manualmente
    // 👉 Puede volver a ACTIVE si se reactiva la suscripción
    SUSPENDED = 'SUSPENDED',

    // ❌ Colegio deshabilitado 
    // 👉 Se utiliza cuando deja de formar parte del sistema
    // 👉 Aunque normalmente es un estado definitivo, puede reactivarse manualmente si el negocio lo requiere
    INACTIVE = 'INACTIVE'
}



// 🏛️ Tipo de institución educativa
// 👉 Permite clasificar el tipo de colegio
export enum InstitutionType{

    // 🏛️ Institución pública administrada por el estado
    PUBLIC = 'PUBLIC',       
    // 💰 Institución privada
    PRIVATE = 'PRIVATE',     
    // 🤝 Institución administrada mediante convenio
    AGREEMENT = 'AGREEMENT'  
}





// 🎓 Niveles educativos que ofrece el colegio
// 👉 Un colegio puede ofrecer uno o varios niveles
export enum LevelsOffered{

    // 👶 Solo Educación Inicial
    INITIAL = 'INITIAL', 
    // 🧒 Solo Educación Primaria
    PRIMARY = 'PRIMARY', 
    // 🧑‍🎓 Solo Educación Secundaria
    SECONDARY = 'SECONDARY', 
     // 🧩 Educación Primaria y Secundaria
    PRIMARY_SECONDARY = 'PRIMARY_SECONDARY',
    // 🌎 Educación Inicial, Primaria y Secundaria
    INITIAL_PRIMARY_SECONDARY = 'INITIAL_PRIMARY_SECONDARY' 
}

// 🏫 Entidad que representa un colegio dentro del sistema SaaS
// 👉 Cada registro corresponde a una institución educativa independiente
// 👉 Aunque todos comparten el mismo backend, cada colegio administra sus propios usuarios, años escolares, matrículas y demás información
@Entity({name : 'schools'}) // 🗃️ Nombre real de la tabla en la BD
export class School {

    // ==============================================
    // 🆔 IDENTIDAD
    // ==============================================

    // 🆔 Identificador único del colegio 
    // 👉 PostgreSQL generará automáticamente un UUID para cada registro
    @PrimaryGeneratedColumn('uuid')  
    id! : string;  

    // ==============================================
    // 🏷️ INFORMACIÓN GENERAL
    // ==============================================

    // 🏫 Nombre oficial del colegio
    // 🔹 Ejemplo: "I.E. San Joaquín"
    @Index() // 🔎 Optimiza búsquedas por nombre (listados, filtros)
    @Column({type: 'varchar', length: 150, nullable: false}) // 🏫 Nombre obligatorio
    name! : string;  

    // 🔑 Código interno único del colegio
    // 🔹 Se utiliza para identificar rápidamente la institución
    // 🔹 Debe ser único dentro del sistema
    // 🔹 Ejemplo: SANJOAQUIN, JAVIERHERAUD
    @Column({type: 'varchar', length: 50, nullable: false, unique: true}) // 🧩 Código único
    code! : string; // 🧩 Código interno (Ej: "JAVIERHERAUD", "IEJAVIERHERAUD")


    // 🧾 RUC del RUC del colegio
    // 🔹 Opcional porque algunas instituciones pueden registrarse sin completar todavía sus datos tributarios
    // 👉 Cuando existe, no puede repetirse
    @Column({
        type: 'varchar',
        length: 11, 
        nullable: true,
        unique: true
    })
    ruc?: string;

    // 📍 Dirección física del colegio
    @Column({type: 'text', nullable: true})  
    address?: string;  

    // 📞 Teléfono institucional
    // 🔹 Se almacena como texto para conservar exactamente el número ingresado
    @Column({
        type : 'varchar',
        length: 9,
        nullable: true})  
    phone?: string;  

    // 📧 Correo institucional
    // 🔹 Puede utilizarse para contacto o futuras notificaciones
    @Index() // 🔎 Búsqueda rápida por email si algún día filtras instituciones
    @Column({type: 'varchar', length: 150, unique: true, nullable: true}) // 📧  Email (opcional)
    email?: string; // 📧 Correo institucional

     // 👨‍🏫 Nombre de director
     // 👉 Es solamente información descriptiva
     // 👉 No representa una relación con la entidad User
    @Column({
        name: 'director_name', 
        type: 'varchar', 
        length: 150, 
        nullable : true})
    directorName?: string;  

    // ==============================================
    // 🖼️ Branding 
    // ==============================================

    // 🖼️ URL del logo institucional
    @Column({
        name: 'logo_url', 
        type: 'text', 
        nullable: true}) // 🖼️ url del logo (opcional)
    logoUrl?: string;

    // 🏞️ URL de la imagen de portada utilizada por la aplicación
    @Column({
        name : 'cover_image_url', 
        type: 'text', 
        nullable : true})  
    coverImageUrl?: string;
    
    // ==============================================
    // 🌎 UBICACIÓN
    // ==============================================

    // 🇵🇪 Departamento donde se ubica el colegio
    // 🔹 Ejemplo: Lambayeque , La Libertad
    @Column({type: 'varchar', length: 80, nullable : true})  
    department?: string; 
 
    // 🏙️ Provincia donde se ubica el colegio
    // 🔹 Ejemplo: Chiclayo
    @Column({type: 'varchar', length: 80, nullable : true})  
    province?: string;  

    // 🧾 Distrito donde se ubica el colegio
    // 🔹 Ejemplo: Tumán, José Leonardo Ortiz
    @Column({
        type: 'varchar',
        length: 80,
        nullable: true
    })
    district?: string;

    // ===============================================
    // 🏛️ CONFIGURACIÓN ACADÉMICA
    // ===============================================

    // 🏛️ Tipo de institución
    // 👉 Solo acepta valores definidos en InstitutionType
    @Column({
        name : 'institution_type',
        type: 'enum', // 🧩 Enum en PostgreSQL
        enum : InstitutionType, // 🧩 Valores permitidos
    })
    institutionType!: InstitutionType; // 🏛️ Pública / Privada / Otro

    // 🎓 Niveles educativos que ofrece el colegio
    // 👉 Solo acepta valores definidos en LevelsOffered
    @Column({
        name: 'levels_offered',
        type:'enum', // 🧩 Enum en PostgreSQL
        enum: LevelsOffered, // 🧩 Valores permitidos
    })
    levelsOffered!: LevelsOffered;  

    // ===============================================
    // 💳 INFORMACIÓN DEL SAAS
    // ===============================================

    // 📅 Fecha de vencimiento de la suscripción
    // 👉 Sirve tanto para periodos de pruebas como para suscripciones pagadas
    // 👉 Si la fecha ya expiró, el sistema puede suspender automáticamente el acceso
    @Column({
        name: 'subscription_expires_at',
        type: 'timestamptz',
        nullable: true
    })
    subscriptionExpiresAt?: Date;

    // ===============================================
    // ✅ ESTADOD EL COLEGIO
    // ===============================================
    // 🚦 Estado actual de la institución dentro de SaaS
    // 👉 Por defecto todo colegio inicia como TRIAL
    @Index() // 🔎 Optimiza consultas por estado
    @Column({
        type : 'enum',
        enum : SchoolStatus,
        default: SchoolStatus.TRIAL
    })
    status!: SchoolStatus;

    // ===============================================
    // 🏛️ FUNDACIÓN
    // ===============================================
    // 📅 Fecha de fundación del colegio
    // 👉 Solo almacena la fecha (sin hora)
    @Column({
        name : 'foundation_date', // 🧾 Nombre real en BD
        type : 'date', // 📅 Solo fecha (sin hora) - lo correcto aquí
        nullable : true, // 🟡 Opcional (muchos colegios no lo registran al inicio)
    })
    foundationDate? : Date; // 📅 Fecha de fundación del colegio


    // ===============================================
    // 🕒 AUDITORIA
    // ===============================================
    // 🕒 Fecha en la que se creó el registro
    // 👉 TypeORM la asigna automáticamente
    @CreateDateColumn({
        name: 'created_at', 
        type: 'timestamptz'}) // 🕒 Se llena automático al crear
    createdAt! : Date; // 🕒 Fecha de creación


    // 🔄 Fecha de la última modificación
    // 👉 Se actualiza automáticamente cada vez que el registro cambia
    @UpdateDateColumn({
        name: 'updated_at', type: 
        'timestamptz'}) // 🔁 Se actualiza automáticamente al editar
    updatedAt! : Date; // 🔁 Fecha de última actualización

    // ===============================================
    // 🔗 Relaciones
    // ===============================================

    // 🗓️ Un colegio puede tener múltiples años escolares
    // 🔹 Ejemplo: 2025, 2026, 2027...
    @OneToMany(
        () => SchoolYear, // 🗓️ Entidad hija
        (schoolYear) => schoolYear.school, //🔙 Propiedad inversa en SchoolYear
    )
    schoolYears!: SchoolYear[]; // 🗓️ Un colegio tiene muchos años escolares


    
    // 👥 Un colegio puede tener muchos usuarios
    // 👉 Incluye administradores, docentes, estudiantes y apoderados
    // 👉 Esta relación permite que cada colegio administre únicamente sus propios usuarios dentro del modelo SaaS multicolegio
    @OneToMany(
        () => User,
        (user) => user.school
    )
    users!: User[]

    
}