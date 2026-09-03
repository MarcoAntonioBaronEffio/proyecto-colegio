✅ CREAR ADMINISTRADOR

POST -> http://localhost:3000/api/auth/register
POST -> https://proyecto-colegio-production.up.railway.app/api/auth/register

 
⭐️ UN SYSTEM ADMINISTRATOR CREA A UN ADMINISTRATOR, AQUI SI ENVIA EL SCHOOL ID, PORQUE EL SELECCIONAR EL COLEGIO AL CUAL PERTENECERÁ EL ADMINSTRADOR.

➡️ petición

{
    "email": "admin13@test.com",
    "password": "12345678",
    "firstName": "Luis",
    "lastName": "Gonzalez",
    "schoolId": "6e8ef9aa-ce26-4a83-97c2-ff786a0d51cb",
    "documentType": "DNI",
    "documentNumber": "12345678"
}


⬅️ respuesta:

{
    "success": true,
    "mssage": "Administrador registrado con éxito",
    "data": {
        "id": "1e150cea-cd43-4a1b-b449-0fa96b1f2732",
        "email": "admin13@test.com",
        "firstName": "Luis",
        "lastName": "Gonzalez",
        "role": {
            "id": "6742ef69-f5b1-4f8f-9588-4bd1100135c8"
        },
        "phone": null,
        "address": null,
        "avatarUrl": null,
        "status": "ACTIVE",
        "createdAt": "2026-08-30T22:42:06.094Z",
        "updatedAt": "2026-08-30T22:42:06.094Z",
        "school": {
            "id": "6e8ef9aa-ce26-4a83-97c2-ff786a0d51cb"
        }
    }
}

=============================================================================


⭐️ UN ADMINISTRATOR CREA A UN ADMINISTRATOR, AQUI NO ENVIA EL SCHOOL ID, PORQUE ESE SCHOOL ID SERÁ EXTRAIDO DE SU TOKEN
1️⃣ Iniciar sesión como administrator: POST : https://proyecto-colegio-production.up.railway.app/api/auth/login

{
    "email" : "admin13@test.com",
    "password" : "12345678"
}

2️⃣ Extraer token validado, por ejemplo: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxZTE1MGNlYS1jZDQzLTRhMWItYjQ0OS0wZmE5NmIxZjI3MzIiLCJlbWFpbCI6ImFkbWluMTNAdGVzdC5jb20iLCJyb2xlSWQiOiI2NzQyZWY2OS1mNWIxLTRmOGYtOTU4OC00YmQxMTAwMTM1YzgiLCJyb2xlTmFtZSI6IkFETUlOSVNUUkFUT1IiLCJzY2hvb2xJZCI6IjZlOGVmOWFhLWNlMjYtNGE4My05N2MyLWZmNzg2YTBkNTFjYiIsImlhdCI6MTc4ODEzMDU1NCwiZXhwIjoxNzg4MjE2OTU0fQ.4k_Xf9gPyKtlU8L_r0FXxMpYiDwfs59PXCiFTfERQu4

3️⃣ Hacer petición: 

POST : https://proyecto-colegio-production.up.railway.app/api/auth/register/administrator

4️⃣ Obtenemos la respuesta: 

{
    "success": true,
    "mssage": "Administrador registrado con éxito",
    "data": {
        "id": "3e995be4-4522-4292-96f8-f63e73d0ba78",
        "email": "systemadmin13113@admin.com",
        "firstName": "Marcoc",
        "lastName": "Barón Effio",
        "role": {
            "id": "6742ef69-f5b1-4f8f-9588-4bd1100135c8"
        },
        "phone": null,
        "address": null,
        "avatarUrl": null,
        "status": "ACTIVE",
        "createdAt": "2026-08-30T22:56:59.549Z",
        "updatedAt": "2026-08-30T22:56:59.549Z",
        "school": {
            "id": "6e8ef9aa-ce26-4a83-97c2-ff786a0d51cb"
        }
    }
}
