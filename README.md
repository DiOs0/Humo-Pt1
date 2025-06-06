# Proyecto de Innovación y Emprendimiento

Este repositorio contiene una aplicación móvil para visualizar restaurantes en un mapa, desarrollada con React Native y Expo.

## Requisitos previos

- Node.js (v14.0.0 o superior)
- npm (v6.0.0 o superior) o yarn
- Expo CLI (`npm install -g expo-cli`)
- Git

## Cómo clonar el repositorio

1. Abre una terminal o línea de comandos
2. Ejecuta el siguiente comando:

```bash
git clone [URL_DEL_REPOSITORIO]
```

3. Navega al directorio del proyecto:

```bash
cd project
```

## Instalación de dependencias

Para instalar todas las dependencias necesarias, ejecuta:

```bash
npm install
# o si usas yarn
yarn install
```

## Configuración del proyecto

1. Copia el archivo `.env.example` y renómbralo a `.env`:

```bash
cp .env.example .env
```

2. Edita el archivo `.env` con tus propias credenciales y configuraciones.

## Ejecución del proyecto

Para iniciar el proyecto en modo desarrollo:

```bash
npx expo start
# o
npm run start
```

Esto abrirá la interfaz de Expo Developer Tools en tu navegador. Desde allí podrás:
- Ejecutar la aplicación en un emulador de iOS/Android
- Escanear el código QR con la aplicación Expo Go en tu dispositivo físico
- Ejecutar en la web

## Estructura del proyecto

```
project/
├── app/                  # Carpeta principal de la aplicación
│   ├── (tabs)/           # Pestañas de navegación
│   └── restaurant/       # Páginas de detalles
├── assets/               # Imágenes, fuentes y otros recursos
├── components/           # Componentes reutilizables
├── data/                 # Datos mock y utilidades relacionadas
├── hooks/                # Custom hooks
└── ...
```

## Resolución de problemas comunes

### El proyecto no se ejecuta correctamente
- Verifica que todas las dependencias estén instaladas
- Ejecuta `npm cache clean --force` y luego `npm install`
- Reinicia el servidor de desarrollo con `--clear`: `npx expo start --clear`

### Problemas con Expo
- Asegúrate de tener la última versión de Expo CLI
- Verifica que tu dispositivo y computadora estén en la misma red WiFi

## Contribución

1. Crea una nueva rama para tu funcionalidad: `git checkout -b feature/nueva-funcionalidad`
2. Realiza tus cambios y haz commit: `git commit -am 'Agrega nueva funcionalidad'`
3. Sube tus cambios: `git push origin feature/nueva-funcionalidad`
4. Envía un Pull Request para revisión

## Licencia

Este proyecto está licenciado bajo [incluir licencia]
