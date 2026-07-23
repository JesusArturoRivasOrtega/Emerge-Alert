# Emerge Alert

Plataforma web educativa para orientar la respuesta inicial ante emergencias sanitarias. Reúne un manual de primeros auxilios, recursos para incidentes y tres demostradores visuales asistidos por IA.

> **Aviso importante:** Emerge Alert no sustituye a los servicios de emergencia, la valoración de un profesional ni un diagnóstico médico. Ante peligro inmediato, llama al **911**.

## Contenido

- Inicio y acceso rápido a recursos de emergencia.
- Manual de primeros auxilios: conducta inicial, hemorragias, quemaduras, atragantamiento, desmayo, sismos y alertas sanitarias.
- Detectores educativos de heridas, quemaduras y lesiones compatibles con viruela símica (mpox), mediante modelos de Teachable Machine y cámara web.

## Ejecutar localmente

El sitio no requiere compilación. Para evitar restricciones de cámara en algunos navegadores, sírvelo desde un servidor local:

```powershell
cd html
python -m http.server 8080
```

Abre `http://localhost:8080` y permite el acceso a la cámara solo si deseas probar un detector.

## Estructura

```text
html/
├── index.html              # Inicio
├── manual.html             # Manual de primeros auxilios
├── aguda.html              # Recursos ante incidentes y lesiones
├── cronica.html            # Alertas sanitarias y mpox
├── css/emerge.css          # Sistema visual compartido
├── js/emerge.js            # Navegación e interacciones
├── js/detector.js          # Lógica común de detectores
├── heridas/heridas.html
├── quemadura/quemadura.html
└── viruela/viruela.html
```

## Diseño visual

La interfaz usa una estética oscura de respuesta operativa, acentos turquesa y ámbar, video ambiental y tres imágenes optimizadas en WebP. Incluye animaciones de entrada, progreso de lectura, navegación móvil accesible y soporte para `prefers-reduced-motion`.

Las imágenes de `html/media/` fueron generadas específicamente para el proyecto y no contienen texto, logotipos ni contenido gráfico sensible.

## Fuentes del manual

Las recomendaciones se muestran de forma resumida y enlazan a fuentes de consulta oficiales: [MedlinePlus — heridas](https://medlineplus.gov/spanish/ency/article/000043.htm), [MedlinePlus — sangrado](https://medlineplus.gov/spanish/ency/article/000045.htm), [MedlinePlus — quemaduras](https://medlineplus.gov/spanish/ency/article/000030.htm), [MedlinePlus — atragantamiento](https://medlineplus.gov/spanish/choking.html) y [CDC — mpox](https://www.cdc.gov/monkeypox/caring/index.html).
