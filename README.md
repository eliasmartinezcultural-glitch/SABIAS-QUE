# ¿Sabías que...? — San Patricio del Chañar

Juego web gratuito de verdadero o falso para descubrir historias documentadas de San Patricio del Chañar, Neuquén. Una producción de Ocarina Producciones.

**Sitio publicado:** https://eliasmartinezcultural-glitch.github.io/SABIAS-QUE/

## Qué incluye

- Recorrido completo o por tema.
- Una pregunta por pantalla, con respuesta verdadero/falso.
- Explicación inmediata y enlace a la fuente.
- Puntaje, rachas y progreso.
- Resultados, repaso y repetición de preguntas incorrectas.
- Insignias y récord local en el dispositivo.
- Lectura en voz alta cuando el navegador la admite.
- Ajuste de tamaño de letra y alto contraste.
- Diseño adaptable a celular, tableta y computadora.
- Acceso libre, sin cuentas, servidor ni base de datos.
- Aporte voluntario opcional, sin bloquear el contenido.

## Estructura del proyecto

| Archivo | Responsabilidad |
|---|---|
| `index.html` | Estructura semántica, pantallas, controles y textos visibles |
| `styles.css` | Sistema visual único, componentes, estados, accesibilidad y adaptación responsive |
| `app.js` | Estado de partida, navegación, respuestas, puntaje, resultados y preferencias |
| `questions.js` | Banco de preguntas y metadatos editoriales de cada afirmación |
| `FUENTES.md` | Fuentes consultadas, criterios y observaciones de verificación |
| `ARCHITECTURE.md` | Reglas para mantener y ampliar el producto sin desordenarlo |
| `assets/` | Ilustraciones locales y recursos visuales |

## Cómo ampliar el juego

1. Investigar y verificar el dato antes de redactar la pregunta.
2. Agregar un objeto al banco de `questions.js`, respetando el esquema existente.
3. Asignar un identificador único y una categoría existente o documentar la nueva.
4. Incluir respuesta booleana, explicación comprensible y URL de fuente.
5. Registrar la fuente y cualquier duda en `FUENTES.md`.
6. Comprobar que el conteo por categoría, la partida completa, el repaso y los resultados sigan funcionando.

No agregar preguntas de relleno. Si dos fuentes confiables discrepan, explicitar la diferencia o dejar el dato fuera del juego hasta resolverla.

## Publicación

El sitio se publica con GitHub Pages desde la rama `main` y la raíz del repositorio. Los archivos son estáticos: no requieren compilación, dependencias ni instalación.

Después de cada actualización, comprobar la publicación en **Actions** y abrir el sitio en una ventana privada o recargar sin caché. Los archivos CSS y JavaScript llevan un identificador de versión en sus URLs para reducir problemas de caché.

## Control de calidad antes de publicar

- Abrir la portada en 320, 390, 680 y escritorio.
- Completar una partida desde el inicio hasta los resultados.
- Probar ambas respuestas y verificar que no se pueda responder dos veces.
- Confirmar que el botón siguiente sólo avance después de responder.
- Probar selección por tema, reinicio y repaso de errores.
- Verificar enlaces de fuentes e imágenes; debe existir alternativa ilustrada si una foto externa falla.
- Probar tamaño de letra, contraste y lectura en voz alta.
- Probar compartir y copiar el alias en HTTPS.
- Comprobar que no haya desbordes horizontales ni botones demasiado pequeños.

## Criterios del producto

- Primero claridad y facilidad; después decoración.
- Una acción principal por pantalla.
- Textos breves, legibles y respetuosos con todas las edades.
- Sin reloj, presión ni penalización por tardar.
- Las imágenes acompañan el contenido; nunca compiten con él.
- No introducir registro, seguimiento personal ni datos innecesarios.
- El contenido histórico debe ser trazable a fuentes; no inventar datos.

## Créditos

Investigación, diseño y desarrollo: **Elías Martínez · Ocarina Producciones**.  
Alias para aportes voluntarios: **ocarina.guitarra**, a nombre de **Elías Martínez**. La colaboración es opcional y no condiciona el acceso al juego.
