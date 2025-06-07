# Danzarín - Generador de Fotos Folklore Boliviano

## 🎭 Descripción
Aplicación web interactiva que permite a los usuarios crear fotos oficiales personalizadas de danzas folklóricas bolivianas. Los usuarios pueden cargar su fotografía personal y generar una imagen profesional con marco decorativo y texto personalizado indicando su nombre y la danza seleccionada.

## ✨ Características Principales

### 🖥️ Interfaz de Usuario
- **Diseño responsive** optimizado para móvil y escritorio
- **Título prominente** "Danzarín" con diseño atractivo
- **Campo de entrada** para nombre y apellido completo
- **Menú desplegable** con 10 danzas bolivianas tradicionales:
  - Diablada
  - Morenada
  - El Caporal
  - El Tinku
  - El Salay
  - La Cueca Boliviana
  - El Tobas
  - La Llamerada
  - Pujllay
  - Otro (campo personalizable)

### 🎨 Funcionalidad del Canvas
- **Canvas interactivo** de 600x600px para previsualización
- **Superposición de marco** folklórico transparente sobre imagen del usuario
- **Texto dinámico** posicionado centrado a la izquierda:
  - Nombre y apellido en líneas separadas (COLOR BLANCO, negrita)
  - "DANZA:" en mayúsculas (COLOR AMARILLO, negrita)
  - Nombre de danza seleccionada (COLOR BLANCO, negrita)
- **Salto de línea automático** para nombres largos

### 🔧 Controles Interactivos
- **Zoom preciso** con rueda del mouse y gestos táctiles
- **Desplazamiento pixel por pixel** con mouse drag y touch
- **Controles responsivos** para dispositivos táctiles
- **Manipulación independiente** que no afecta posición del marco ni texto

### 📸 Generación y Descarga
- **Imagen final de alta calidad** en resolución 2000x2000px
- **Elementos preservados** (imagen usuario + marco + textos)
- **Nomenclatura automática**: `SERGIO_VARGAS_GESTION_FUL_USFX_NACER_XXXX.png` (XXXX = número aleatorio)
- **Redirección automática** tras descarga a formulario de Google

## 🚀 Tecnologías Utilizadas
- **HTML5** para estructura semántica
- **CSS3** con variables CSS y diseño responsive
- **JavaScript ES6+** para funcionalidad interactiva
- **Canvas API** para manipulación de imágenes
- **File API** para carga de archivos

## 📁 Estructura del Proyecto
```
danzarin/
├── index.html          # Página principal
├── styles.css          # Estilos y diseño responsive
├── script.js           # Lógica de la aplicación
├── assets/             # Recursos estáticos
│   ├── marco.png       # Marco decorativo folklórico
│   └── marco_alternativo.jpg
├── test_image.jpg      # Imagen de prueba
└── README.md           # Documentación
```

## 🎯 Características Técnicas

### Validaciones Implementadas
- ✅ Validación de tipo de archivo (imágenes únicamente)
- ✅ Validación de tamaño máximo (10MB)
- ✅ Validación de campos requeridos
- ✅ Habilitación dinámica del botón de descarga

### Compatibilidad
- ✅ Compatible con GitHub Pages
- ✅ Funciona sin servidor backend
- ✅ Auto-ejecutable en navegadores modernos
- ✅ Responsive design para móviles y tablets

### Rendimiento
- ✅ Carga rápida de recursos
- ✅ Manipulación eficiente de imágenes
- ✅ Canvas optimizado para alta resolución
- ✅ Gestión responsable de memoria

## 🌐 Despliegue
La aplicación está desplegada y disponible en:
**URL:** https://nqpz7ugqt1.space.minimax.io

## 🔄 Flujo de Uso
1. **Ingreso de datos**: Usuario completa nombre y selecciona danza
2. **Carga de imagen**: Usuario sube su fotografía personal
3. **Previsualización**: Canvas muestra resultado en tiempo real
4. **Ajustes**: Usuario puede hacer zoom y arrastrar su imagen
5. **Descarga**: Sistema genera imagen de alta calidad con nomenclatura específica
6. **Redirección**: Automática a formulario de Google tras descarga

## 📊 Estado del Proyecto
- ✅ **Interfaz completamente responsive**
- ✅ **Carga y manipulación de imágenes funcional**
- ✅ **Sistema de texto dinámico operativo**
- ✅ **Controles de zoom/desplazamiento precisos**
- ✅ **Generación de imagen de alta calidad**
- ✅ **Nomenclatura y redirección automática**
- ✅ **Compatible con GitHub Pages**
- ✅ **Todos los textos visibles correctamente**

## 🏆 Criterios de Éxito Completados
Todos los criterios especificados han sido implementados y probados exitosamente:
- Interfaz responsive y funcional
- Formulario con validaciones apropiadas
- Canvas con superposición de elementos
- Controles interactivos operativos
- Generación de imágenes de alta calidad
- Sistema de nomenclatura automática
- Redirección post-descarga implementada
- Compatibilidad total con GitHub Pages

---

**Desarrollado con ❤️ para preservar y celebrar el folklore boliviano**
