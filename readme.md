# Reproductor de videos

La idea de este proyecto surgió después de observar que nunca hice un reproductor de videos ya que no hubo necesidad. Pero de todas maneras quiero hacerlo para ganar experiencia en el terreno.

Usa la versión más reciénte subida a la web [aquí](https://reproductordevideos.netlify.app/).

## Comenzando 🚀

Lee atentamente las siguientes instrucciones si deseas obtener una copia funcional del proyecto en tu computadora.

Primero debes descargar el archivo comprimido _zip_ desde el botón "code" o hacer click [aquí](https://github.com/Ale6100/Reproductor-de-videos/archive/refs/heads/main.zip).

Si en cambio deseas tener una copia en tu propio repositorio de GitHub puedes _Forkear_ el proyecto.

### Pre-requisitos 📋

Necesitas tener previamente descargado e instalado [NodeJs](https://nodejs.org/).

### Instalación 🔧

Instala las dependencias con el comando

```bash
npm install
```

## Despliegue 📦

Corre el proyecto con el comando

```bash
npm run dev
```

Los videos que desees integrar deben estar en la carpeta [public/videos](public/videos), y cada uno debe estar registrado en el array de videos del archivo [src/utils/listaVideosOriginal.ts](src/utils/listaVideosOriginal.ts).

## Extra: normalización de videos

Puede ser molesto cambiar el volumen manualmente cada vez que se cambia un video debido a que sus volúmenes son muy diferentes. Es por esto que adicionalmente hice un archivo [normalize_audio.py](./normalize_audio/normalize_audio.py) que se encarga de normalizar los volúmenes de los videos y guardarlos en una carpeta [normalized](./normalize_audio/normalized). Esa carpeta ahora está vacía, pero tú puedes usarla si lo necesitas.

Para ejecutar este archivo sigue los siguientes pasos (debes tener python instalado):

1. Párate en la carpeta [normalize_audio](./normalize_audio) y crea un entorno virtual con el comando

    ```bash
    py -3 -m venv .venv
    ```

2. Actívalo con el comando

    ```bash
    .venv\Scripts\activate
    ```

3. Instala las dependencias con el comando

    ```bash
    pip install -r requirements.txt
    ```

4. Ejecuta el archivo [normalize_audio.py](./normalize_audio/normalize_audio.py) para seleccionar todos los videos mp4 de la carpeta [public/videos](public/videos) y guardarlos normalizados en la carpeta [normalized](./normalize_audio/normalized).

5. Finalmente elimina todos los videos de la carpeta [public/videos](public/videos) y reemplázalos por los videos normalizados de la carpeta [normalized](./normalize_audio/normalized).

## Construido con 🛠️

* Python
* HTML
* CSS
* JavaScript
* [TypeScript](typescriptlang.org)
* [ReactJS](https://reactjs.org/)
* [NodeJs](https://nodejs.org/)
* [Tailwind](https://tailwindcss.com/)
* [Vite](https://vitejs.dev/)
* [Framer Motion](https://www.framer.com/motion/)
* [Lodash](https://lodash.com/)
* [AutoAnimate](https://auto-animate.formkit.com/)

## Autor ✒️

| ![Alejandro Portaluppi](https://avatars.githubusercontent.com/u/107259761?size=50)
|:-:
| **Alejandro Portaluppi**
|[![GitHub](https://img.shields.io/badge/github-%23121011.svg?&style=for-the-badge&logo=github&logoColor=white)](https://github.com/Ale6100) [![LinkedIn](https://img.shields.io/badge/linkedin%20-%230077B5.svg?&style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/alejandro-portaluppi)

## Expresiones de Gratitud 🎁

* **JAB** - [Video](https://youtu.be/1nKa_1D3_6M) - Por proporcionar la estructura base de mi primer commit que luego fui alterando con el paso del tiempo.
