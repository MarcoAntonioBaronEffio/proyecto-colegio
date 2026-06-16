// ✅ CREAR MATRÍCULA

POST -> http://localhost:3000/api/enrollments

➡️ petición

{
    "studentId" : "1ec69ea5-be0e-4fda-9b68-5edf0fd99904",
    "sectionId" : "d61a101f-5df0-4cdd-9e7e-b8522df81e5f"

}

⬅️ respuesta

{
    "success": true,
    "message": "Matrícula creada correctamente",
    "data": {
        "id": "0e802064-85f2-4337-b11b-9e5a7d3e3546",
        "student": {
            "id": "1ec69ea5-be0e-4fda-9b68-5edf0fd99904",
            "documentType": "DNI",
            "documentNumber": "11223344",
            "studentCode": "STU-1EC69EA5",
            "createdAt": "2026-06-01T18:36:39.971Z",
            "updatedAt": "2026-06-01T18:36:39.971Z"
        },
        "studentId": "1ec69ea5-be0e-4fda-9b68-5edf0fd99904",
        "schoolYear": {
            "id": "5736114e-f351-448b-9287-f88baaabe1fa",
            "year": 2026,
            "startsOn": "2026-03-15",
            "endsOn": "2026-12-01",
            "status": "ACTIVE",
            "createdAt": "2026-03-20T01:37:50.066Z",
            "updatedAt": "2026-04-21T07:27:22.477Z"
        },
        "schoolYearId": "5736114e-f351-448b-9287-f88baaabe1fa",
        "section": {
            "id": "d61a101f-5df0-4cdd-9e7e-b8522df81e5f",
            "name": "D",
            "shift": "AFTERNOON",
            "status": "ACTIVE",
            "grade": {
                "id": "5ef5e1ab-9e33-4127-bed2-c14f6c941715",
                "gradeNumber": 1,
                "level": "SECONDARY",
                "status": "ACTIVE",
                "createdAt": "2026-04-20T19:39:05.710Z",
                "updatedAt": "2026-04-20T19:39:05.710Z",
                "schoolYear": {
                    "id": "5736114e-f351-448b-9287-f88baaabe1fa",
                    "year": 2026,
                    "startsOn": "2026-03-15",
                    "endsOn": "2026-12-01",
                    "status": "ACTIVE",
                    "createdAt": "2026-03-20T01:37:50.066Z",
                    "updatedAt": "2026-04-21T07:27:22.477Z"
                }
            },
            "createdAt": "2026-05-28T19:25:30.771Z",
            "updatedAt": "2026-06-13T21:23:43.358Z"
        },
        "sectionId": "d61a101f-5df0-4cdd-9e7e-b8522df81e5f",
        "createdAt": "2026-06-13T21:23:45.949Z",
        "updatedAt": "2026-06-13T21:23:45.949Z"
    }
}


-----------------------------------------------------------------------------

✅ OBTENER TODAS LAS MATRICULAS

GET -> http://localhost:3000/api/enrollments

➡️ petición : NO LLEVA BODY

⬅️ respuesta: 

{
    "success": true,
    "message": "Matrículas obtenidas correctamente",
    "data": [
        {
            "id": "0e802064-85f2-4337-b11b-9e5a7d3e3546",
            "student": {
                "id": "1ec69ea5-be0e-4fda-9b68-5edf0fd99904",
                "user": {
                    "id": "7bab1799-c82d-46da-92b0-04bdb2eb77e9",
                    "email": "student@test.com",
                    "firstName": "María",
                    "lastName": "Pérez",
                    "phone": null,
                    "address": null,
                    "avatarUrl": null,
                    "status": "ACTIVE",
                    "createdAt": "2026-06-01T18:36:39.971Z",
                    "updatedAt": "2026-06-01T18:36:39.971Z"
                },
                "documentType": "DNI",
                "documentNumber": "11223344",
                "studentCode": "STU-1EC69EA5",
                "createdAt": "2026-06-01T18:36:39.971Z",
                "updatedAt": "2026-06-01T18:36:39.971Z"
            },
            "studentId": "1ec69ea5-be0e-4fda-9b68-5edf0fd99904",
            "schoolYear": {
                "id": "5736114e-f351-448b-9287-f88baaabe1fa",
                "year": 2026,
                "startsOn": "2026-03-15",
                "endsOn": "2026-12-01",
                "status": "ACTIVE",
                "createdAt": "2026-03-20T01:37:50.066Z",
                "updatedAt": "2026-04-21T07:27:22.477Z"
            },
            "schoolYearId": "5736114e-f351-448b-9287-f88baaabe1fa",
            "section": {
                "id": "d61a101f-5df0-4cdd-9e7e-b8522df81e5f",
                "name": "D",
                "shift": "AFTERNOON",
                "status": "ACTIVE",
                "grade": {
                    "id": "5ef5e1ab-9e33-4127-bed2-c14f6c941715",
                    "gradeNumber": 1,
                    "level": "SECONDARY",
                    "status": "ACTIVE",
                    "createdAt": "2026-04-20T19:39:05.710Z",
                    "updatedAt": "2026-04-20T19:39:05.710Z",
                    "schoolYearId": "5736114e-f351-448b-9287-f88baaabe1fa"
                },
                "gradeId": "5ef5e1ab-9e33-4127-bed2-c14f6c941715",
                "classroomId": "b0660c29-ac4d-4c12-b132-eefab9d0c1e4",
                "createdAt": "2026-05-28T19:25:30.771Z",
                "updatedAt": "2026-06-13T21:23:43.358Z"
            },
            "sectionId": "d61a101f-5df0-4cdd-9e7e-b8522df81e5f",
            "createdAt": "2026-06-13T21:23:45.949Z",
            "updatedAt": "2026-06-13T21:23:45.949Z"
        }
    ]
}