✅ CREAR AÑO ESCOLAR

POST -> http://localhost:3000/api/school-years
POST -> https://proyecto-colegio-production.up.railway.app/api/school-years

➡️ petición

{
    "year" : 2033,
    "startsOn" : "2033-03-15",
    "endsOn" : "2033-12-15"
}

⬅️ respuests

{
    "success": true,
    "message": "Año escolar creado correctamente ✅",
    "data": {
        "id": "72df47c0-ef92-4c38-a3f7-88bc7a30a631",
        "year": 2033,
        "startsOn": "2033-03-15",
        "endsOn": "2033-12-15",
        "status": "PLANNED",
        "createdAt": "2026-06-20T02:36:00.634Z",
        "updatedAt": "2026-06-20T02:36:00.634Z",
        "school": {
            "id": "f0c14b50-9b4e-4ba8-aa52-336aeaa23a0a",
            "name": "Colegio Demo",
            "code": "DEFAULT",
            "address": null,
            "phone": null,
            "email": null,
            "directorName": null,
            "logoUrl": null,
            "coverImageUrl": null,
            "country": null,
            "city": null,
            "district": null,
            "institutionType": "OTHER",
            "levelsOffered": "BOTH",
            "status": "ACTIVE",
            "foundationDate": null,
            "createdAt": "2026-03-18T23:01:08.017Z",
            "updatedAt": "2026-03-18T23:01:08.017Z"
        }
    }
}

-----------------------------------------------------------------------------

✅ OBTENER TODOS LOS AÑOS ESCOLARES

GET -> http://localhost:3000/api/school-years
GET -> https://proyecto-colegio-production.up.railway.app/api/school-years

➡️ petición: NO LLEVA BODY

⬅️ respuesta : 

{
    "success": true,
    "message": "Listado de años escolares obtenidos correctamente",
    "data": [
        {
            "id": "e146ab86-b5df-4b0d-b5c1-8ab265fd824d",
            "year": 2027,
            "startsOn": "2027-03-05",
            "endsOn": "2027-12-15",
            "status": "PLANNED",
            "createdAt": "2026-06-20T02:27:23.257Z",
            "updatedAt": "2026-06-20T02:27:23.257Z"
        },
        {
            "id": "07ea20b2-d4b4-45dd-9f9c-576c85e8eba4",
            "year": 2026,
            "startsOn": "2026-03-05",
            "endsOn": "2026-12-12",
            "status": "PLANNED",
            "createdAt": "2026-06-17T06:09:31.814Z",
            "updatedAt": "2026-06-17T06:09:31.814Z"
        }
    ]
}