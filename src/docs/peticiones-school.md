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
        "id": "0674ee7d-ec7d-430d-a745-22b9a0a56773",
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
        "subscriptionExpiresAt": "2026-10-07T03:27:19.350Z",
        "status": "TRIAL",
        "foundationDate": "2005-03-01",
        "createdAt": "2026-07-07T03:27:19.351Z",
        "updatedAt": "2026-07-07T03:27:19.351Z"
    }
}