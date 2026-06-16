import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn, RelationId, Unique, UpdateDateColumn } from "typeorm";
import { Grade } from "./grade.entity";
import { Classroom } from "./classroom.entity";

export enum SectionStatus{
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE'
}

// 🧭 Enum de turnos (Perú: Mañana / Tarde)
export enum SectionShift{ // 🕒 Turno
    MORNING = "MORNING", // 🌅 Mañana
    AFTERNOON = "AFTERNOON" // 🌇 Tarde
}

// 🧷 Evitamos que exista la misma sección repetida dentro del mismo grado y turno
// ✅ Ej : 1° Primaria A Morning (no debe duplicarse)
@Unique("UQ_sections_grade_name_shift", ["grade", "name", 'shift']) // 🛡️ Regla de unicidad compuesta
@Entity({name: "sections"}) // 🗄️ Nombre de tabla
export class Section {  // 🧱 Entidad Section

    @PrimaryGeneratedColumn("uuid") // 🆔 PK UUID autogenerado
    id! : string;

    // 🏷️ Nombre de la sección: "A", "B", "C"...
    // 🔥 OJO: no colocar "A1" aquí, porque eso ya lo define el Grade + Section
    @Column({type: "varchar", length : 10})
    name! : string;

     // 🕒 Turno: MORNING / AFTERNOON (muy usado en Perú)
    @Column({
        type : "enum", 
        enum: SectionShift, 
        name: 'shift'})
    shift! : SectionShift;

    // ✅ Estado  
    @Column({
        type : 'enum',
        enum : SectionStatus,
        default : SectionStatus.ACTIVE
    }) 
    status! : SectionStatus;

    // ==========================
    // 🔗 Foreing Key: grade_id
    // ==========================

    // 📦 Muchas secciones pertenecen a UN grado
    // ✅ eager: false (recomendado) para no traer Grade siempre en cada query
    // ✅ onDelete: RESTRICT (recomendado) para no borrar grados si tienen sections
    @ManyToOne(() => Grade, (grade) => grade.sections, {
        eager: false,
        onDelete: "RESTRICT"}) 
    @JoinColumn({name: "grade_id"}) 
    // 🔗 Mapeamos la FK real: grade_id
    grade! : Grade;
 
    @RelationId((section : Section) => section.grade)
    gradeId! : string;

    @ManyToOne(() => Classroom, (classroom) => classroom.sections)
    @JoinColumn({name: "classroom_id"})
    classroom!: Classroom;

    @RelationId((section: Section) => section.classroom)
    classroomId!: string;

    // ==========================
    // 🕓 Auditoria
    // ==========================

    // 📅 Fecha/hora exacta cuando se creó el registro (automática)
    @CreateDateColumn({name: "created_at", type : "timestamptz"}) 
    createdAt! : Date;

    // 🔄 Fecha/hora exacta cuando se actualizó por última vez (automática)
    @UpdateDateColumn({name : "updated_at", type: "timestamptz"}) 
    updatedAt! : Date;

}

// 🧾 ¿Por qué se llama "audotoria"? -> En software, auditoría significa: 
// 🔎 Poder rastrear qué pasó con un registro y cuándo paso.
// 🔎 Saber la historia de un registro y en qué momento ocurrió cada cambio.
// 🔎 Poder saber cuando se creó y cuándo se modificó un dato
// 🧠 En tu entity, la sección "Audotoría" incluye: createdAt y updatedAt
// Se llaman así porque permite:
// Saber cuándo se creó el registro, saber cuando se modificó, investigar errores