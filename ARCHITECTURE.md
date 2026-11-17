# Arquitectura y reglas de mantenimiento

Este proyecto es una aplicación web estática, sin backend, registro ni dependencias externas de programación. Su estructura debe seguir siendo fácil de entender y mantener.

## 1. Responsabilidades

### `index.html` — estructura y contenido de interfaz
- Contiene las pantallas de portada, partida, resultados y apoyo.
- Mantiene los identificadores (`id`) que utiliza `app.js`.
- Usa etiquetas semánticas, botones reales y textos alternativos.
- No introducir estilos en línea salvo valores que dependan realmente del resultado de una partida.

### `styles.css` — sistema visual único
Orden fijo de secciones:
1. Tokens y base.
2. Cabecera e identidad.
3. Portada.
4. Memoria e insignias.
5. Fotografías.
6. Partida y progreso.
7. Resultados y repaso.
8. Apoyo y pie.
9. Accesibilidad.
10. Responsive.

**Regla:** editar la regla existente. No agregar una segunda o tercera capa de parches al final del archivo. Si una regla cambia, reemplazar la anterior en su sección.

### `app.js` — comportamiento
- Administra el estado de una partida.
- Controla la navegación entre pantallas.
- Actualiza progreso, puntaje, rachas y resultados.
- Mantiene accesibilidad, lectura en voz alta y preferencias.
- No contiene el texto editorial completo del banco de preguntas, salvo mensajes de interfaz.

### `questions.js` — datos editoriales
Cada pregunta debe conservar este esquema:

```js
{
  id: "CH-009",
  category: "Categoría existente",
  difficulty: "FÁCIL",
  icon: "📚",
  statement: "Una afirmación clara y comprobable.",
  answer: true,
  explanation: "Una explicación sencilla que permita aprender.",
  sourceTitle: "Nombre de la fuente",
  sourceUrl: "https://...",
  sourceNote: "Observación editorial o límite de la fuente.",
  image: { src: "https://...", alt: "Descripción de la foto", caption: "EPÍGRAFE BREVE" } // opcional
}
```

- `id` es único y no se reutiliza.
- `answer` sólo puede ser `true` o `false`.
- La explicación no debe limitarse a repetir “verdadero” o “falso”.
- La fuente debe permitir comprobar el dato.
- `sourceNote` documenta cautelas; no reemplaza una fuente.
- Las categorías deben coincidir exactamente con las usadas por los botones temáticos.

### `FUENTES.md` — trazabilidad
Registrar qué fuente sostiene cada afirmación, qué aspectos están confirmados y qué cuestiones siguen pendientes. Una fuente institucional también puede contener errores o simplificaciones: no presentarla como verdad absoluta sin revisar su alcance.

### `assets/` — recursos
Priorizar SVG locales ligeros. Las fotografías externas deben ser pertinentes, tener epígrafe y texto alternativo, y contar con una ilustración alternativa cuando se utilicen dentro de una pregunta.

## 2. Flujo de una partida

1. El banco se valida al iniciar la aplicación.
2. La portada ofrece el recorrido completo y recorridos por tema.
3. La pregunta se muestra con su categoría, dificultad y recurso visual.
4. Al responder, se bloquean ambas opciones para evitar respuestas duplicadas.
5. Se muestra devolución, explicación y fuente.
6. El botón siguiente avanza una sola vez.
7. Al terminar, se muestran resultado, estadísticas y repaso.
8. Los récords se guardan localmente en el navegador; no se envían a un servidor.

## 3. Reglas de experiencia

- Diseñar primero para 320–390 px y ampliar después.
- Una pregunta por pantalla.
- Botones grandes, textos breves y contraste suficiente.
- Nunca depender sólo del color para comunicar acierto o error.
- Sin cuenta regresiva ni límite de tiempo.
- No ocultar información esencial detrás de imágenes.
- Respetar `prefers-reduced-motion`.
- Los controles de tamaño y contraste deben seguir funcionando en todas las pantallas.

## 4. Regla para incorporar mejoras

Antes de sumar una función:
1. Definir qué problema real resuelve.
2. Identificar en qué pantalla vive.
3. Revisar si ya existe un control equivalente.
4. Mantener una sola fuente de verdad para estilos y comportamiento.
5. Probar el recorrido completo, no sólo la pantalla modificada.
6. Documentar cualquier nueva responsabilidad o dato.

No agregar bibliotecas, frameworks, cuentas, bases de datos ni servicios pagos para resolver algo que la aplicación estática ya puede hacer.

## 5. Lista mínima de pruebas

- Inicio completo.
- Inicio por cada tema.
- Respuesta verdadera y falsa.
- Bloqueo de segunda respuesta.
- Avance de pregunta y finalización.
- Resultado y repaso.
- Repetición de errores.
- Reinicio.
- Récord persistente después de recargar.
- Lectura en voz alta, tamaño de letra y contraste.
- Imágenes y fallback.
- Compartir y copiar alias.
- Vista móvil estrecha, tableta y escritorio.

## 6. Publicación y caché

- La rama publicada es `main`.
- Los recursos CSS y JavaScript usan query de versión en `index.html`.
- Al cambiar CSS o JavaScript, actualizar el identificador de versión para que el navegador solicite el recurso nuevo.
- Confirmar el estado del despliegue en GitHub Actions.
- No dar por comprobada la vista visual hasta abrir el sitio desplegado en navegador.
