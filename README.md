## 1. Instalar dependencias
npm install

## 2. Crear archivo .env
Copiar .env.example y renombrarlo a .env

## 3. Crear base de datos PostgreSQL
CREATE DATABASE colegio_db;

## 4. Ejecutar seeds
npm run seed:role
npm run seed:school

## 5. Levantar proyecto
npm run start:dev