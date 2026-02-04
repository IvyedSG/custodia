# Custodia - Gestión de Inventario para Logística

Una interfaz profesional de alto rendimiento para la gestión de entradas y salidas, construida con **Nuxt 4**, **Tailwind CSS 4** y **Shadcn Vue**.

Este proyecto ha sido específicamente refactorizado para funcionar como una **aplicación puramente en memoria**, lo que lo hace perfecto para demostraciones, pruebas locales y uso offline sin necesidad de un backend o base de datos.

## 🚀 Características

- **Dashboard de Inventario**: Vistas especializadas de estantería y tabla para gestionar casilleros y objetos.
- **Estado Puramente en Memoria**: Utiliza un almacén (store) reactivo centralizado con persistencia en `localStorage`.
- **Seguimiento de Historial**: Historial de transacciones robusto con filtrado y paginación.
- **Gestión de Voluntarios**: Operaciones CRUD completas para datos de usuarios.

## 🛠️ Tecnologías

- **Framework**: [Nuxt 4](https://nuxt.com/) (Vue 3)
- **Estilos**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Componentes UI**: [Shadcn Vue](https://www.shadcn-vue.com/)
- **Gestión de Estado**: Store reactivo de Vue con persistencia.

## 🏁 Primeros Pasos

### Requisitos Previos

- [Node.js](https://nodejs.org/) (v18.0.0 o superior)
- [npm](https://www.npmjs.com/) (v9.0.0 o superior)

### Instalación

1. Clona el repositorio:

   ```bash
   git clone https://github.com/tu-usuario/custodia.git
   cd custodia
   ```

2. Instala las dependencias:

   ```bash
   npm install
   # o con bun
   bun install
   ```

3. Inicia el servidor de desarrollo:

   ```bash
   npm run dev
   # o con bun
   bun run dev
   ```

4. Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## 🧪 Pruebas (Testing)

El proyecto utiliza el entorno oficial de pruebas de Nuxt basado en **Vitest** y **@nuxt/test-utils**.

- **Ejecutar pruebas**: `npm run test`
- **Modo observador (watch)**: `npm run test:watch`

### Credenciales de Demostración

La página de inicio de sesión viene pre-rellenada para acceso inmediato:

- **Usuario**: `admin@logistics.com`
- **Contraseña**: `admin123`
