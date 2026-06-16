// 🔧 Utilidad para generar códigos amigables
// 👉 Basados en el UUID generado por PostgreSQL
export class CodeGenerator{

    // 🏷️ Genera un código usando un prefijo y un UUID
    static generate(
        prefix : string,
        uuid : string
    ) : string {

        return `${prefix}-${uuid
            .replace(/-/g, '') // Elimina guiones
            .substring(0,8)    // Toma los primeros 8 caracteres
            .toUpperCase()}`;  // Convierte a mayúsculas
    }

}