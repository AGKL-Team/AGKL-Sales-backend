# Sistema de Gestión de Ventas

## 📌 Descripción

Aplicación que permite la gestión de ventas internas para productos

## 🎯 Alcance

- Gestión de Productos
- Gestión de Marcas
- Gestión de Líneas de Marcas

## 📌 Requisitos previos

- Node.js v18+
- Yarn

> [!NOTE]
> Para instalar los programas necesarios:
>
> - Node: [descargar Node](https://nodejs.org/en/download/)
> - Yarn: [descargar yarn](https://classic.yarnpkg.com/en/docs/install#debian-stable)

## ⚒️ Instalación

```bash
git clone git@github.com:AGKL-Team/AGKL-Sales.git
cd ./AGKL-Sales
yarn install
```

## ▶️ Ejecución

```bash
# Modo desarrollo
yarn run start

# Modo watch
yarn run start:dev
```

## 🧪 Tests

```bash
# Unit tests
yarn run test

# Cobertura
yarn run test:cov
```

## 🌐 Despliegue en producción

```bash
# Instalar el CLI de vercel
npm install -g vercel

# Loguearse
vercel login

# Para deploys

# Para un deploy con dominio temporal (Preview)
# Genera una url específica para la branch
vercel

# Para un deploy con dominio fijo (Production)
vercel --prod
```

## 👨‍💻 Autores

- AGKL Team
  - Amante Aldana
  - Gutierrez Alexis
  - Koncurat Thomas
  - Lattazi Valentino

- [Universidad Tecnológica Nacional - Villa María](https://www.google.com/url?sa=t&source=web&rct=j&opi=89978449&url=https://www.frvm.utn.edu.ar/&ved=2ahUKEwidzN2etMSPAxW5IrkGHa5TAT0QFnoECDkQAQ&usg=AOvVaw2wudWAq9epLXJwg2kQfyWs)
- Materia: Ingeniería de Software
