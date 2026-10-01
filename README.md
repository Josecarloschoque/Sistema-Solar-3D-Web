# Sistema Solar 3D — Versión Web

Versión web interactiva preparada a partir del proyecto académico C++/OpenGL original.

## Ejecutar localmente
Por seguridad del navegador, no abras `index.html` con doble clic. Sirve la carpeta por HTTP:

```bash
python -m http.server 8000
```

Luego abre `http://localhost:8000`.

## Publicar en GitHub Pages
1. Sube el contenido de esta carpeta a un repositorio (o a una carpeta dedicada del repositorio).
2. En GitHub: Settings → Pages.
3. Selecciona `Deploy from a branch`, rama `main/principal`, carpeta `/ (root)`.
4. Guarda y espera el enlace de Pages.

## Notas
- Renderiza con WebGL en la GPU del visitante.
- Usa Three.js desde jsDelivr, por lo que requiere conexión a Internet para cargar la librería.
- Conserva las texturas JPG del proyecto original.
- Esta es una adaptación web independiente; no reemplaza el proyecto C++/OpenGL de Visual Studio.
