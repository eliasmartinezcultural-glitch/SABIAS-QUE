/* =========================================================
   BANCO EDITORIAL · ¿SABÍAS QUE...?
   Reglas: una afirmación comprobable, respuesta booleana,
   explicación propia y enlace a una fuente consultable.
   ========================================================= */
window.CHANAR_QUESTIONS = [
  {
    id: "CH-001",
    category: "Fundación",
    difficulty: "FÁCIL",
    icon: "🏛️",
    statement: "San Patricio del Chañar reconoce como fecha de fundación el 21 de mayo de 1973.",
    answer: true,
    explanation: "La Carta Orgánica Municipal reconoce expresamente el 21 de mayo de 1973 como fecha de fundación. La documentación consultada distingue esa fecha de la puesta en funciones de las primeras autoridades comunales, que se ubica en abril de 1974.",
    sourceTitle: "Carta Orgánica Municipal · artículo 2",
    sourceUrl: "https://www.economianqn.gob.ar/contenido/file/2755",
    sourceNote: "Fuente normativa provincial; corroborar además con el Boletín Oficial."
  },
  {
    id: "CH-002",
    category: "Instituciones",
    difficulty: "MEDIA",
    icon: "📜",
    statement: "Las primeras autoridades de la Comisión de Fomento comenzaron a funcionar el mismo 21 de mayo de 1973.",
    answer: false,
    explanation: "La fecha de fundación reconocida es el 21 de mayo de 1973, pero la información provincial señala que la puesta en funciones de las primeras autoridades ocurrió el 8 de abril de 1974. Son dos hitos distintos.",
    sourceTitle: "Neuquén Informa · aniversario de 2016",
    sourceUrl: "https://www.neuqueninforma.gob.ar/noticias/2016/05/20/81371-san-patricio-del-chanar-festeja-manana-sus-43-anos",
    sourceNote: "La nota provincial distingue la fundación de la puesta en funciones."
  },
  {
    id: "CH-003",
    category: "Agua y producción",
    difficulty: "MEDIA",
    icon: "💧",
    statement: "Los primeros cultivos del proyecto productivo se regaron en 1969 mediante bombeo desde el río Neuquén.",
    answer: true,
    explanation: "La reseña histórica municipal indica que en 1969 comenzaron las obras de sistematización y se regaron los primeros cultivos y plantaciones mediante bombas que tomaban agua del río Neuquén.",
    sourceTitle: "Municipalidad · Nuestra Identidad",
    sourceUrl: "https://www.sanpatricio.gob.ar/identidad",
    sourceNote: "Reseña institucional municipal. Conviene localizar documentación técnica de las obras para una segunda corroboración."
    image: {
      src: "https://sanpatricio.gob.ar/assets/images/municipio/Balneario-Municipal.JPG",
      alt: "Río Neuquén y balneario municipal de San Patricio del Chañar",
      caption: "RÍO NEUQUÉN · NUESTRO PAISAJE"
    },
  },
  {
    id: "CH-004",
    category: "Agua y producción",
    difficulty: "MEDIA",
    icon: "🚜",
    statement: "Desde el primer día, los cultivos se regaron exclusivamente por canales y sin utilizar bombas.",
    answer: false,
    explanation: "La reseña municipal describe que los primeros cultivos de 1969 se regaron por bombeo desde el río Neuquén. La primera bocatoma mencionada en esa cronología se construyó en 1971.",
    sourceTitle: "Municipalidad · Nuestra Identidad",
    sourceUrl: "https://www.sanpatricio.gob.ar/identidad",
    sourceNote: "La pregunta contrasta el bombeo inicial con la posterior infraestructura de bocatomas."
    image: {
      src: "https://sanpatricio.gob.ar/assets/images/municipio/vinedos.JPG",
      alt: "Viñedos de San Patricio del Chañar",
      caption: "VIÑEDOS · PRODUCCIÓN CHAÑARENSE"
    },
  },
  {
    id: "CH-005",
    category: "Tierra y territorio",
    difficulty: "MEDIA",
    icon: "🌾",
    statement: "En 1966, un grupo de vecinos de Cinco Saltos adquirió el campo conocido como El Chañar.",
    answer: true,
    explanation: "La reseña histórica municipal indica que en 1966 un grupo de vecinos de Cinco Saltos adquirió El Chañar. Según esa misma fuente, por dificultades económicas el proyecto no avanzó más allá de la subdivisión del campo.",
    sourceTitle: "Municipalidad · Nuestra Identidad",
    sourceUrl: "https://www.sanpatricio.gob.ar/identidad",
    sourceNote: "Dato atribuido a la reseña municipal; requiere contraste con escrituras o registros de propiedad."
    image: {
      src: "https://sanpatricio.gob.ar/assets/images/municipio/Chacra-Municipal.JPG",
      alt: "Chacra Municipal Valles del Chañar",
      caption: "CHACRAS · TIERRA DE TRABAJO"
    },
  },
  {
    id: "CH-006",
    category: "Tierra y territorio",
    difficulty: "DIFÍCIL",
    icon: "🧭",
    statement: "La firma Gasparri fue la primera en adquirir El Chañar, en 1966.",
    answer: false,
    explanation: "La afirmación es falsa porque la adquisición de 1966 se atribuye a un grupo de vecinos de Cinco Saltos, no a Gasparri. Atención: las fuentes consultadas no coinciden del todo sobre quién figura como comprador en 1968: la reseña municipal menciona a Frigorífico Cipolletti S.A. y el plan del CFI menciona a Gasparri Hnos. Por eso no afirmamos aquí una única versión sobre ese segundo momento.",
    sourceTitle: "Municipalidad · Nuestra Identidad",
    sourceUrl: "https://www.sanpatricio.gob.ar/identidad",
    sourceNote: "La secuencia de titularidad debe seguir cotejándose con documentos registrales y otras publicaciones."
    image: {
      src: "https://sanpatricio.gob.ar/assets/images/municipio/Chacra-Municipal.JPG",
      alt: "Vista de la Chacra Municipal Valles del Chañar",
      caption: "EL TERRITORIO Y SU HISTORIA"
    },
  },
  {
    id: "CH-007",
    category: "Nombre e identidad",
    difficulty: "MEDIA",
    icon: "☘️",
    statement: "El nombre San Patricio está relacionado con el patrono de Campo Filone, en Italia.",
    answer: true,
    explanation: "La reseña provincial explica que el nombre San Patricio fue tomado del patrono de Campo Filone, localidad italiana vinculada con la historia de la familia Gasparri. El nombre Chañar refiere al árbol presente en la zona.",
    sourceTitle: "Neuquén Informa · reseña histórica",
    sourceUrl: "https://www.neuqueninforma.gob.ar/noticias/2014/05/22/48785-jorge-sapag-asistira-al-41-aniversario-de-san-patricio-del-chanar",
    sourceNote: "Fuente provincial de divulgación; buscar documentación familiar e histórica complementaria."
  },
  {
    id: "CH-008",
    category: "Instituciones",
    difficulty: "DIFÍCIL",
    icon: "⚖️",
    statement: "San Patricio del Chañar fue declarado municipio de primera categoría en 1978.",
    answer: false,
    explanation: "En 1978 pasó a ser municipio de tercera categoría. En 1987 alcanzó la segunda y el 31 de julio de 2003 fue declarado municipio de primera categoría mediante la Ley Provincial 2435.",
    sourceTitle: "Legislatura del Neuquén · Ley 2435",
    sourceUrl: "https://www.legislaturaneuquen.gob.ar/svrfiles/neuleg/DiariosSesion/DS_P_39_R218_3637.pdf?var=17",
    sourceNote: "La secuencia 1978-1987-2003 también está reseñada por Neuquén Informa en 2013."
  }
];
