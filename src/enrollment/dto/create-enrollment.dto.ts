// 🧾  Declaramos el DTO CreateEnrollmentDto
// 🔹 Esto es como un formulario que define qué campos pueden llegar al backend cuando se crea una matrícula (enrollment) y qué 
//.   reglas deben cumplir

import { IsUUID } from "class-validator";

export class CreateEnrollmentDto{


    // ✅ Validación: studentId DEBE ser un UUID versión 4
    // 🔹 El is del estudiante no puede ser cualquier texto, tiene que tener el formato típico de UUID v4.
    // Ejemplo válido: "550e8400-e29b-41d4-a716-446655440000"
    @IsUUID('4', { message: 'studentId debe ser un UUID válido' })

    // 🧩  Propiedad obligatoria studentId
    // 🔹 Aqui llega el identificador del alumno que será matriculado.
    studentId! : string;

    /* -------------------------------------------------------------- */
 
    // ✅ Validación: sectionId DEBE ser UUID version 4
    // 🔹 Este id apunta a la sección donde irá el alumno ("A","B","C"),  pero igual: no se manda "A", se manda el UUID del registro de esa sección en la BD
    @IsUUID('4', {message: 'sectionId debe ser un UUID válido'})
    // 🧩 Propiedad obligatoria sectionId
    // 🔹 Aquí llega el identificador de la sección
    sectionId! : string;
 
    // 🔹 No enviamos el "schoolYear" porque se obtiene desde la sección




}