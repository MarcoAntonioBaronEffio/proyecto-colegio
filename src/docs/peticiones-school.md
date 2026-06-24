✅ CREAR COLEGIO

POST -> http://localhost:3000/api/schools
POST -> https://proyecto-colegio-production.up.railway.app/api/schools

➡️ petición

{
    "name": "Institución Educativa San José",
    "code": "SANJOSE01",
    "ruc": "20123456789",
    "address": "Av. Los Pinos 123",
    "phone": "987654321",
    "email": "contacto@sanjose.edu.pe",
    "directorName": "Juan Pérez",

    "department": "La Libertad",
    "province": "Trujillo",
    "district": "Víctor Larco",

    "institutionType": "PRIVATE",
    "levelsOffered": "BOTH",
    "foundationDate": "2005-03-01"
}


⬅️ respuesta

{
    "success": true,
    "message": "Colegio creado correctamente ✅",
    "data": {
        "id": "782bd6bc-949b-48af-ae6f-df54978bdc29",
        "name": "Institución Educativa San José",
        "code": "SANJOSE01",
        "slug": null,
        "ruc": "20123456789",
        "address": "Av. Los Pinos 123",
        "phone": "987654321",
        "email": "contacto@sanjose.edu.pe",
        "directorName": "Juan Pérez",
        "logoUrl": null,
        "coverImageUrl": null,
        "department": "La Libertad",
        "province": "Trujillo",
        "district": "Víctor Larco",
        "institutionType": "PRIVATE",
        "levelsOffered": "BOTH",
        "subscriptionExpiresAt": null,
        "status": "TRIAL",
        "foundationDate": "2005-03-01",
        "createdAt": "2026-06-24T07:05:56.245Z",
        "updatedAt": "2026-06-24T07:05:56.245Z"
    }
}