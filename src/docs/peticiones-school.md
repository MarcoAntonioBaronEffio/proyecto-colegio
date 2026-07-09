✅ CREAR COLEGIO

POST -> http://localhost:3000/api/schools
POST -> https://proyecto-colegio-production.up.railway.app/api/schools

➡️ petición

{
    "name": "Institución Educativa San Joaquín",
    "code": "SAN-JOAQUIN",
    "ruc": "20123456789",
    "address": "Av. Los Pinos 123",
    "phone": "987654321",
    "email": "contacto@sanjoaquin.edu.pe",
    "directorName": "Juan Pérez",

    "department": "Lambayeque",
    "province": "Chiclayo",
    "district": "Tumán",

    "institutionType": "PRIVATE",
    "levelsOffered": "PRIMARY_SECONDARY",
    "foundationDate": "2005-03-01"
}

⬅️ respuesta

{
    "success": true,
    "message": "Colegio creado correctamente ✅",
    "data": {
        "id": "694443d4-9830-40c9-9ab2-0cd40e7b0b06",
        "name": "Institución Educativa San Joaquín",
        "code": "SAN-JOAQUIN",
        "ruc": "20123456789",
        "address": "Av. Los Pinos 123",
        "phone": "987654321",
        "email": "contacto@sanjoaquin.edu.pe",
        "directorName": "Juan Pérez",
        "logoUrl": null,
        "coverImageUrl": null,
        "department": "Lambayeque",
        "province": "Chiclayo",
        "district": "Tumán",
        "institutionType": "PRIVATE",
        "levelsOffered": "PRIMARY_SECONDARY",
        "subscriptionExpiresAt": "2026-10-07T03:40:41.081Z",
        "status": "TRIAL",
        "foundationDate": "2005-03-01",
        "createdAt": "2026-07-07T03:40:41.083Z",
        "updatedAt": "2026-07-07T03:40:41.083Z"
    }
}