✅ CREAR ADMINISTRADOR

POST -> http://localhost:3000/api/auth/register
POST -> https://proyecto-colegio-production.up.railway.app/api/auth/register

 
➡️ petición

{
    "email" : "admin@test.com",
    "password" : "12345678",
    "firstName" : "Marco",
    "lastName" : "Barón",
    "roleName": "ADMINISTRATOR",
    "schoolId" : "c5fd365c-a158-4e33-a734-cbf30781dbc9",
    "administrator" :{
        "documentType" : "DNI",
        "documentNumber" : "12345678"
    }
}

⬅️ respuesta:

{
    "success": true,
    "message": "Administrador registrado con éxito",
    "data": {
        "id": "0d35d7de-6d34-4877-b159-ab56f5164939",
        "email": "admin@test.com",
        "firstName": "Marco",
        "lastName": "Barón",
        "role": {
            "id": "6742ef69-f5b1-4f8f-9588-4bd1100135c8"
        },
        "phone": null,
        "address": null,
        "avatarUrl": null,
        "status": "ACTIVE",
        "createdAt": "2026-06-24T08:49:26.331Z",
        "updatedAt": "2026-06-24T08:49:26.331Z",
        "school": {
            "id": "c5fd365c-a158-4e33-a734-cbf30781dbc9"
        }
    }
}