/* SABÍAS QUE · Opciones, idiomas, música y reinicio.
   Capa complementaria: mantiene intacta la lógica central del juego. */
(() => {
  "use strict";
  const $ = (id) => document.getElementById(id);
  const LANG_KEY = "sabias-que-language-v1";
  const MUSIC_KEY = "sabias-que-music-v1";
  const RECORD_KEY = "sabias-que-record-v1";
  const translations = {
    en: {
      questions: {
        "CH-001": ["San Patricio del Chañar recognizes May 21, 1973 as its founding date.", "The Municipal Charter expressly recognizes May 21, 1973 as the founding date. The consulted documents distinguish this date from the start of the first local authorities, which took place in April 1974."],
        "CH-002": ["The first authorities of the Development Commission began working on May 21, 1973.", "The recognized founding date is May 21, 1973, but provincial information states that the first authorities took office on April 8, 1974. These are two different milestones."],
        "CH-003": ["The first crops of the productive project were irrigated in 1969 by pumping water from the Neuquén River.", "The municipal historical account states that land-preparation works began in 1969 and the first crops and plantations were irrigated with pumps drawing water from the Neuquén River."],
        "CH-004": ["From the very beginning, crops were irrigated exclusively through canals and without pumps.", "The municipal account describes how the first crops in 1969 were irrigated by pumping water from the Neuquén River. The first intake structure mentioned in that timeline was built in 1971."],
        "CH-005": ["In 1966, a group of residents from Cinco Saltos acquired the property known as El Chañar.", "The municipal historical account states that a group of residents from Cinco Saltos acquired El Chañar in 1966. According to the same source, financial difficulties meant the project did not progress beyond subdividing the property."],
        "CH-006": ["The Gasparri company was the first to acquire El Chañar, in 1966.", "This statement is false because the 1966 acquisition is attributed to a group of residents from Cinco Saltos, not to Gasparri. The consulted sources do not fully agree on who appears as the buyer in 1968: the municipal account mentions Frigorífico Cipolletti S.A., while the CFI plan mentions Gasparri Hnos. For that reason, we do not claim a single version for that second event."],
        "CH-007": ["The name San Patricio is related to the patron saint of Campo Filone, Italy.", "The provincial account explains that the name San Patricio was taken from the patron saint of Campo Filone, an Italian town connected to the history of the Gasparri family. The name Chañar refers to the tree found in the area."],
        "CH-008": ["San Patricio del Chañar was declared a first-category municipality in 1978.", "In 1978 it became a third-category municipality. In 1987 it reached the second category, and on July 31, 2003 it was declared a first-category municipality through Provincial Law 2435."]
      },
      ui: {
        "¿NECESITÁS VER MEJOR?":"NEED A CLEARER VIEW?","MÁS CONTRASTE":"HIGH CONTRAST","CONTRASTE NORMAL":"NORMAL CONTRAST",
        "UN JUEGO DE SAN PATRICIO DEL CHAÑAR":"A GAME ABOUT SAN PATRICIO DEL CHAÑAR",
        "¿Cuánto sabés de":"How much do you know about","nuestro lugar?":"our home?",
        "Curiosidades para jugar, compartir y descubrir historias reales del Chañar.":"Fun facts to play, share and discover real stories from Chañar.",
        "JUGAR TODO EL RECORRIDO":"PLAY THE FULL JOURNEY","🎲 JUGAR 5 PREGUNTAS":"🎲 PLAY 5 QUESTIONS",
        "Podés jugar solo, en familia o por turnos. ¡Lo importante es descubrir!":"Play alone, with family or taking turns. The important thing is to discover!",
        "Leé":"Read","Una historia breve.":"A short story.","Elegí":"Choose","Verdadero o falso.":"True or false.","Descubrí":"Discover","Aprendé algo nuevo.":"Learn something new.",
        "Sin reloj, sin apuro y sin respuestas que den vergüenza. Cada edad, a su ritmo.":"No timer, no rush and no embarrassing answers. Everyone at their own pace.",
        "También podés elegir un tema":"You can also choose a topic","Entrá directo a lo que más te interesa.":"Go straight to what interests you most.",
        "Los comienzos":"The beginnings","Fundación e instituciones":"Founding & institutions","Agua y chacras":"Water & farms","Producción y riego":"Farming & irrigation",
        "La tierra":"The land","Territorio e historias":"Territory & stories","Nuestra identidad":"Our identity","Nombres y símbolos":"Names & symbols",
        "Ver San Patricio del Chañar en imágenes":"See San Patricio del Chañar in pictures",
        "Jugar solo, en familia o por turnos.":"Play alone, with family or taking turns.",
        "← INICIO":"← HOME","RECORRIDO COMPLETO":"FULL JOURNEY","⭐ PUNTOS":"⭐ POINTS","🔥 RACHA":"🔥 STREAK","✓ ACIERTOS":"✓ CORRECT",
        "Tu recorrido":"Your journey","¿VERDADERO O FALSO?":"TRUE OR FALSE?","Leé o escuchá. Después tocá una de las dos respuestas.":"Read or listen. Then tap one of the two answers.",
        "🔊 ESCUCHAR LA PREGUNTA":"🔊 LISTEN TO THE QUESTION","No hace falta saberlo todo. ¡Acá venimos a descubrir!":"You don't need to know everything. We're here to discover!",
        "VERDADERO":"TRUE","FALSO":"FALSE","PARA SABER MÁS":"LEARN MORE","Consultar fuente histórica ↗":"View historical source ↗",
        " SIGUIENTE PREGUNTA ":" NEXT QUESTION ","FIN DEL DESAFÍO":"CHALLENGE COMPLETE","RESPUESTAS":"ANSWERS","CORRECTAS":"CORRECT",
        "PUNTOS":"POINTS","PRECISIÓN":"ACCURACY","MEJOR RACHA":"BEST STREAK","INSIGNIAS CONSEGUIDAS":"BADGES EARNED",
        "VOLVER A JUGAR LAS QUE ME COSTARON ↻":"REPLAY THE ONES I MISSED ↻","JUGAR DE NUEVO ↻":"PLAY AGAIN ↻","COMPARTIR MI RESULTADO ↗":"SHARE MY RESULT ↗",
        "La historia de nuestro lugar siempre tiene algo más para contar.":"There is always more to discover about our home.",
        "Ayudanos a seguir contando historias.":"Help us keep telling stories.","Alias a nombre de":"Alias registered to","ALIAS PARA DONATIVOS":"DONATION ALIAS",
        "COPIAR ALIAS":"COPY ALIAS","HECHO PARA JUGAR EN TU CELULAR":"MADE FOR YOUR PHONE","Una creación de":"Created by"
      }
    },
    fr: {
      questions: {
        "CH-001": ["San Patricio del Chañar reconnaît le 21 mai 1973 comme date de fondation.", "La Charte municipale reconnaît expressément le 21 mai 1973 comme date de fondation. Les documents consultés distinguent cette date de l'entrée en fonction des premières autorités locales, qui a eu lieu en avril 1974."],
        "CH-002": ["Les premières autorités de la Commission de développement ont commencé à travailler le 21 mai 1973.", "La date de fondation reconnue est le 21 mai 1973, mais les informations provinciales indiquent que les premières autorités ont pris leurs fonctions le 8 avril 1974. Il s'agit de deux événements distincts."],
        "CH-003": ["Les premières cultures du projet productif ont été irriguées en 1969 grâce à un pompage depuis le río Neuquén.", "L'histoire municipale indique qu'en 1969 les travaux d'aménagement ont commencé et que les premières cultures et plantations ont été irriguées par des pompes prélevant l'eau du río Neuquén."],
        "CH-004": ["Dès le début, les cultures ont été irriguées exclusivement par des canaux et sans utiliser de pompes.", "Le récit municipal explique que les premières cultures de 1969 ont été irriguées par pompage depuis le río Neuquén. Le premier ouvrage de prise d'eau mentionné dans cette chronologie a été construit en 1971."],
        "CH-005": ["En 1966, un groupe d'habitants de Cinco Saltos a acquis le domaine connu sous le nom d'El Chañar.", "Le récit historique municipal indique qu'en 1966 un groupe d'habitants de Cinco Saltos a acquis El Chañar. Selon la même source, des difficultés financières ont empêché le projet d'aller au-delà du lotissement du domaine."],
        "CH-006": ["L'entreprise Gasparri a été la première à acquérir El Chañar, en 1966.", "Cette affirmation est fausse car l'acquisition de 1966 est attribuée à un groupe d'habitants de Cinco Saltos, et non à Gasparri. Les sources consultées ne concordent pas entièrement sur l'acheteur de 1968 : le récit municipal mentionne Frigorífico Cipolletti S.A. et le plan du CFI mentionne Gasparri Hnos. Nous ne présentons donc pas une version unique de ce second événement."],
        "CH-007": ["Le nom San Patricio est lié au saint patron de Campo Filone, en Italie.", "Le récit provincial explique que le nom San Patricio vient du saint patron de Campo Filone, localité italienne liée à l'histoire de la famille Gasparri. Le nom Chañar fait référence à l'arbre présent dans la région."],
        "CH-008": ["San Patricio del Chañar a été déclaré municipalité de première catégorie en 1978.", "En 1978, la localité est devenue une municipalité de troisième catégorie. En 1987, elle a atteint la deuxième catégorie et, le 31 juillet 2003, elle a été déclarée municipalité de première catégorie par la loi provinciale 2435."]
      },
      ui: {
        "¿NECESITÁS VER MEJOR?":"BESOIN DE MIEUX VOIR ?","MÁS CONTRASTE":"CONTRASTE ÉLEVÉ","CONTRASTE NORMAL":"CONTRASTE NORMAL",
        "UN JUEGO DE SAN PATRICIO DEL CHAÑAR":"UN JEU SUR SAN PATRICIO DEL CHAÑAR",
        "¿Cuánto sabés de":"Que savez-vous de","nuestro lugar?":"notre région ?",
        "Curiosidades para jugar, compartir y descubrir historias reales del Chañar.":"Des anecdotes pour jouer, partager et découvrir les histoires réelles de Chañar.",
        "JUGAR TODO EL RECORRIDO":"JOUER TOUT LE PARCOURS","🎲 JUGAR 5 PREGUNTAS":"🎲 JOUER 5 QUESTIONS",
        "Podés jugar solo, en familia o por turnos. ¡Lo importante es descubrir!":"Jouez seul, en famille ou à tour de rôle. L'essentiel est de découvrir !",
        "Leé":"Lisez","Una historia breve.":"Une courte histoire.","Elegí":"Choisissez","Verdadero o falso.":"Vrai ou faux.","Descubrí":"Découvrez","Aprendé algo nuevo.":"Apprenez quelque chose de nouveau.",
        "Sin reloj, sin apuro y sin respuestas que den vergüenza. Cada edad, a su ritmo.":"Sans chronomètre et sans pression. Chacun à son rythme.",
        "También podés elegir un tema":"Vous pouvez aussi choisir un thème","Entrá directo a lo que más te interesa.":"Accédez directement à ce qui vous intéresse.",
        "Los comienzos":"Les débuts","Fundación e instituciones":"Fondation et institutions","Agua y chacras":"Eau et fermes","Producción y riego":"Production et irrigation",
        "La tierra":"La terre","Territorio e historias":"Territoire et histoires","Nuestra identidad":"Notre identité","Nombres y símbolos":"Noms et symboles",
        "Ver San Patricio del Chañar en imágenes":"Voir San Patricio del Chañar en images",
        "← INICIO":"← ACCUEIL","RECORRIDO COMPLETO":"PARCOURS COMPLET","⭐ PUNTOS":"⭐ POINTS","🔥 RACHA":"🔥 SÉRIE","✓ ACIERTOS":"✓ BONNES RÉPONSES",
        "Tu recorrido":"Votre parcours","¿VERDADERO O FALSO?":"VRAI OU FAUX ?","Leé o escuchá. Después tocá una de las dos respuestas.":"Lisez ou écoutez. Puis choisissez l'une des deux réponses.",
        "🔊 ESCUCHAR LA PREGUNTA":"🔊 ÉCOUTER LA QUESTION","No hace falta saberlo todo. ¡Acá venimos a descubrir!":"Pas besoin de tout savoir. Nous sommes ici pour découvrir !",
        "VERDADERO":"VRAI","FALSO":"FAUX","PARA SABER MÁS":"EN SAVOIR PLUS","Consultar fuente histórica ↗":"Consulter la source historique ↗",
        " SIGUIENTE PREGUNTA ":" QUESTION SUIVANTE ","FIN DEL DESAFÍO":"FIN DU DÉFI","PUNTOS":"POINTS","PRECISIÓN":"PRÉCISION","MEJOR RACHA":"MEILLEURE SÉRIE",
        "VOLVER A JUGAR LAS QUE ME COSTARON ↻":"REJOUER LES QUESTIONS DIFFICILES ↻","JUGAR DE NUEVO ↻":"REJOUER ↻","COMPARTIR MI RESULTADO ↗":"PARTAGER MON RÉSULTAT ↗",
        "La historia de nuestro lugar siempre tiene algo más para contar.":"L'histoire de notre région a toujours quelque chose à raconter.",
        "Ayudanos a seguir contando historias.":"Aidez-nous à continuer à raconter des histoires.","ALIAS PARA DONATIVOS":"ALIAS DE DON","COPIAR ALIAS":"COPIER L'ALIAS",
        "HECHO PARA JUGAR EN TU CELULAR":"FAIT POUR JOUER SUR MOBILE","Una creación de":"Une création de",
        "⚙ Opciones":"⚙ Options","Opciones del juego":"Options du jeu","Idioma":"Langue","♫ Activar música":"♫ Activer la musique",
        "Música instrumental suave. Solo se activa cuando vos lo decidís.":"Musique instrumentale douce. Elle ne démarre que si vous le choisissez.",
        "↻ Reiniciar partida":"↻ Recommencer la partie","Borrar todo el progreso guardado":"Effacer toute la progression enregistrée",
        "Esto elimina puntos, partidas e insignias guardadas en este dispositivo.":"Cela efface les points, les parties et les badges enregistrés sur cet appareil.",
        "Jugar es y seguirá siendo gratis. Si esta experiencia te resultó valiosa, podés colaborar voluntariamente con Ocarina Producciones con un aporte del tamaño que quieras. No es obligatorio ni cambia tu experiencia de juego.":"Le jeu restera toujours gratuit. Si cette expérience vous a plu, vous pouvez soutenir volontairement Ocarina Producciones par une contribution du montant de votre choix. Ce n'est pas obligatoire et cela ne change pas votre expérience de jeu."
      }
    },
    pt: {
      questions: {
        "CH-001": ["San Patricio del Chañar reconhece 21 de maio de 1973 como sua data de fundação.", "A Carta Orgânica Municipal reconhece expressamente 21 de maio de 1973 como data de fundação. Os documentos consultados distinguem essa data do início das atividades das primeiras autoridades locais, ocorrido em abril de 1974."],
        "CH-002": ["As primeiras autoridades da Comissão de Fomento começaram a trabalhar em 21 de maio de 1973.", "A data de fundação reconhecida é 21 de maio de 1973, mas as informações provinciais indicam que as primeiras autoridades tomaram posse em 8 de abril de 1974. São dois marcos diferentes."],
        "CH-003": ["As primeiras plantações do projeto produtivo foram irrigadas em 1969 por meio de bombeamento do rio Neuquén.", "O histórico municipal informa que em 1969 começaram as obras de sistematização e as primeiras plantações foram irrigadas por bombas que captavam água do rio Neuquén."],
        "CH-004": ["Desde o primeiro dia, as plantações foram irrigadas exclusivamente por canais e sem o uso de bombas.", "O histórico municipal descreve que as primeiras plantações de 1969 foram irrigadas por bombeamento do rio Neuquén. A primeira estrutura de captação mencionada nessa cronologia foi construída em 1971."],
        "CH-005": ["Em 1966, um grupo de moradores de Cinco Saltos adquiriu a propriedade conhecida como El Chañar.", "O histórico municipal informa que em 1966 um grupo de moradores de Cinco Saltos adquiriu El Chañar. Segundo a mesma fonte, dificuldades econômicas impediram que o projeto avançasse além do loteamento da propriedade."],
        "CH-006": ["A empresa Gasparri foi a primeira a adquirir El Chañar, em 1966.", "A afirmação é falsa porque a aquisição de 1966 é atribuída a um grupo de moradores de Cinco Saltos, não à Gasparri. As fontes consultadas não concordam totalmente sobre quem aparece como comprador em 1968: o histórico municipal menciona Frigorífico Cipolletti S.A. e o plano do CFI menciona Gasparri Hnos. Por isso, não afirmamos uma única versão sobre esse segundo momento."],
        "CH-007": ["O nome San Patricio está relacionado ao padroeiro de Campo Filone, na Itália.", "O histórico provincial explica que o nome San Patricio foi escolhido em referência ao padroeiro de Campo Filone, localidade italiana ligada à história da família Gasparri. O nome Chañar refere-se à árvore presente na região."],
        "CH-008": ["San Patricio del Chañar foi declarado município de primeira categoria em 1978.", "Em 1978, tornou-se município de terceira categoria. Em 1987 alcançou a segunda categoria e, em 31 de julho de 2003, foi declarado município de primeira categoria pela Lei Provincial 2435."]
      },
      ui: {
        "¿NECESITÁS VER MEJOR?":"PRECISA ENXERGAR MELHOR?","MÁS CONTRASTE":"MAIS CONTRASTE","CONTRASTE NORMAL":"CONTRASTE NORMAL",
        "UN JUEGO DE SAN PATRICIO DEL CHAÑAR":"UM JOGO SOBRE SAN PATRICIO DEL CHAÑAR",
        "¿Cuánto sabés de":"Quanto você sabe sobre","nuestro lugar?":"nosso lugar?",
        "Curiosidades para jugar, compartir y descubrir historias reales del Chañar.":"Curiosidades para jogar, compartilhar e descobrir histórias reais de Chañar.",
        "JUGAR TODO EL RECORRIDO":"JOGAR TODO O PERCURSO","🎲 JUGAR 5 PREGUNTAS":"🎲 JOGAR 5 PERGUNTAS",
        "Podés jugar solo, en familia o por turnos. ¡Lo importante es descubrir!":"Você pode jogar sozinho, em família ou em turnos. O importante é descobrir!",
        "Leé":"Leia","Una historia breve.":"Uma história breve.","Elegí":"Escolha","Verdadero o falso.":"Verdadeiro ou falso.","Descubrí":"Descubra","Aprendé algo nuevo.":"Aprenda algo novo.",
        "Sin reloj, sin apuro y sin respuestas que den vergüenza. Cada edad, a su ritmo.":"Sem relógio e sem pressa. Cada pessoa no seu ritmo.",
        "También podés elegir un tema":"Você também pode escolher um tema","Entrá directo a lo que más te interesa.":"Vá direto ao que mais interessa.",
        "Los comienzos":"Os começos","Fundación e instituciones":"Fundação e instituições","Agua y chacras":"Água e plantações","Producción y riego":"Produção e irrigação",
        "La tierra":"A terra","Territorio e historias":"Território e histórias","Nuestra identidad":"Nossa identidade","Nombres y símbolos":"Nomes e símbolos",
        "Ver San Patricio del Chañar en imágenes":"Ver San Patricio del Chañar em imagens",
        "← INICIO":"← INÍCIO","RECORRIDO COMPLETO":"PERCURSO COMPLETO","⭐ PUNTOS":"⭐ PONTOS","🔥 RACHA":"🔥 SEQUÊNCIA","✓ ACIERTOS":"✓ ACERTOS",
        "Tu recorrido":"Seu percurso","¿VERDADERO O FALSO?":"VERDADEIRO OU FALSO?","Leé o escuchá. Después tocá una de las dos respuestas.":"Leia ou ouça. Depois toque em uma das duas respostas.",
        "🔊 ESCUCHAR LA PREGUNTA":"🔊 OUVIR A PERGUNTA","No hace falta saberlo todo. ¡Acá venimos a descubrir!":"Você não precisa saber tudo. Estamos aqui para descobrir!",
        "VERDADERO":"VERDADEIRO","FALSO":"FALSO","PARA SABER MÁS":"SAIBA MAIS","Consultar fuente histórica ↗":"Consultar fonte histórica ↗",
        " SIGUIENTE PREGUNTA ":" PRÓXIMA PERGUNTA ","FIN DEL DESAFÍO":"FIM DO DESAFIO","PUNTOS":"PONTOS","PRECISIÓN":"PRECISÃO","MEJOR RACHA":"MELHOR SEQUÊNCIA",
        "VOLVER A JUGAR LAS QUE ME COSTARON ↻":"JOGAR NOVAMENTE AS MAIS DIFÍCEIS ↻","JUGAR DE NUEVO ↻":"JOGAR NOVAMENTE ↻","COMPARTIR MI RESULTADO ↗":"COMPARTILHAR MEU RESULTADO ↗",
        "La historia de nuestro lugar siempre tiene algo más para contar.":"A história do nosso lugar sempre tem mais para contar.",
        "Ayudanos a seguir contando historias.":"Ajude-nos a continuar contando histórias.","ALIAS PARA DONATIVOS":"ALIAS PARA DOAÇÕES","COPIAR ALIAS":"COPIAR ALIAS",
        "HECHO PARA JUGAR EN TU CELULAR":"FEITO PARA JOGAR NO CELULAR","Una creación de":"Uma criação de",
        "⚙ Opciones":"⚙ Opções","Opciones del juego":"Opções do jogo","Idioma":"Idioma","♫ Activar música":"♫ Ativar música",
        "Música instrumental suave. Solo se activa cuando vos lo decidís.":"Música instrumental suave. Ela só toca quando você decidir.",
        "↻ Reiniciar partida":"↻ Reiniciar partida","Borrar todo el progreso guardado":"Apagar todo o progresso salvo",
        "Esto elimina puntos, partidas e insignias guardadas en este dispositivo.":"Isso apaga pontos, partidas e medalhas salvos neste dispositivo.",
        "Jugar es y seguirá siendo gratis. Si esta experiencia te resultó valiosa, podés colaborar voluntariamente con Ocarina Producciones con un aporte del tamaño que quieras. No es obligatorio ni cambia tu experiencia de juego.":"Jogar continuará sendo gratuito. Se esta experiência foi valiosa para você, pode apoiar voluntariamente a Ocarina Producciones com uma contribuição de qualquer valor. Não é obrigatório e não muda sua experiência de jogo."
      }
    }
  };
  const baseQuestions = new Map((window.CHANAR_QUESTIONS || []).map(q => [q.id, { statement:q.statement, explanation:q.explanation }]));
  let language = "es";
  let audioContext = null, musicTimer = null, musicOn = false, musicNodes = [];
  const languageNames = { es:"Español", en:"English", fr:"Français", pt:"Português" };

  function translateQuestions(lang) {
    (window.CHANAR_QUESTIONS || []).forEach(q => {
      const base = baseQuestions.get(q.id);
      if (!base) return;
      const translated = translations[lang]?.questions?.[q.id];
      q.statement = translated ? translated[0] : base.statement;
      q.explanation = translated ? translated[1] : base.explanation;
    });
  }
  const originalTextNodes = new WeakMap();
  function translateTextNodes(lang) {
    const dict = translations[lang]?.ui || {};
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(node => {
      if (!originalTextNodes.has(node)) originalTextNodes.set(node, node.nodeValue);
      const original = originalTextNodes.get(node);
      const trimmed = original.trim();
      const translated = dict[trimmed] || trimmed;
      const next = original.replace(trimmed, translated);
      if (node.nodeValue !== next) node.nodeValue = next;
    });
    const labels = {
      "font-smaller": {en:"Decrease text size",fr:"Réduire le texte",pt:"Diminuir texto"},
      "font-larger": {en:"Increase text size",fr:"Agrandir le texte",pt:"Aumentar texto"},
      "contrast-toggle": {en:"HIGH CONTRAST",fr:"CONTRASTE ÉLEVÉ",pt:"MAIS CONTRASTE"},
      "listen-explanation": {en:"🔊 LISTEN TO THE EXPLANATION",fr:"🔊 ÉCOUTER L'EXPLICATION",pt:"🔊 OUVIR A EXPLICAÇÃO"}
    };
    Object.entries(labels).forEach(([id, map]) => { if ($(id) && map[lang]) $(id).textContent = map[lang]; });
    document.documentElement.lang = lang;
  }
  function applyLanguage(lang) {
    const current = $("question-text");
    const previousStatement = current ? current.textContent : "";
    const currentQuestion = (window.CHANAR_QUESTIONS || []).find(q =>
      q.statement === previousStatement ||
      baseQuestions.get(q.id)?.statement === previousStatement ||
      Object.values(translations).some(pack => pack.questions?.[q.id]?.[0] === previousStatement)
    );
    language = ["es","en","fr","pt"].includes(lang) ? lang : "es";
    translateQuestions(language);
    translateTextNodes(language);
    try { localStorage.setItem(LANG_KEY, language); } catch(e) {}
    if (currentQuestion && current) current.textContent = currentQuestion.statement;
    const selector = $("language-select");
    if (selector) selector.value = language;
  }

  function injectControls() {
    const topbar = document.querySelector(".topbar");
    if (!topbar || $("game-options")) return;
    const button = document.createElement("button");
    button.id = "game-options"; button.type = "button"; button.className = "access-button";
    button.textContent = "⚙ Opciones"; button.setAttribute("aria-expanded","false");
    topbar.append(button);
    const panel = document.createElement("section");
    panel.id = "options-panel"; panel.className = "options-panel"; panel.hidden = true;
    panel.setAttribute("aria-label","Opciones del juego");
    panel.innerHTML = '<div class="options-head"><strong id="options-title">Opciones del juego</strong><button type="button" id="options-close" aria-label="Cerrar opciones">×</button></div><label for="language-select" id="language-label">Idioma</label><select id="language-select"><option value="es">Español</option><option value="en">English</option><option value="fr">Français</option><option value="pt">Português</option></select><button type="button" id="music-toggle" class="secondary-button">♫ Activar música</button><p id="music-note">Música instrumental suave. Solo se activa cuando vos lo decidís.</p><button type="button" id="restart-current" class="secondary-button">↻ Reiniciar partida</button><button type="button" id="reset-record" class="danger-option">Borrar todo el progreso guardado</button><p id="reset-note">Esto elimina puntos, partidas e insignias guardadas en este dispositivo.</p>';
    document.querySelector(".page-shell").append(panel);
    const style = document.createElement("style");
    style.textContent = '.topbar{position:relative}.options-panel{position:relative;z-index:20;margin:10px 0 14px;padding:16px;border:1px solid #d8c8aa;border-radius:14px;background:#fffdf7;box-shadow:0 10px 28px rgba(48,60,43,.13);display:grid;gap:9px}.options-panel[hidden]{display:none}.options-head{display:flex;align-items:center;justify-content:space-between;font-family:Georgia,serif;font-size:1.12rem}.options-head button{border:0;background:transparent;font-size:1.5rem;cursor:pointer}.options-panel label{font-size:.8rem;font-weight:800}.options-panel select{width:100%;min-height:46px;padding:8px;border:1px solid #d8c8aa;border-radius:9px;background:white;font:inherit}.options-panel .secondary-button{width:100%;min-height:46px}.options-panel p{margin:0;color:#596d6a;font-size:.76rem}.danger-option{min-height:44px;border:1px solid #dfb9ad;border-radius:9px;background:#fff4ef;color:#8b4336;font-weight:800;cursor:pointer}.options-panel button:focus-visible,.options-panel select:focus-visible{outline:3px solid #98552f;outline-offset:2px}';
    document.head.append(style);
    $("game-options").addEventListener("click", () => {
      const open = panel.hidden; panel.hidden = !open;
      button.setAttribute("aria-expanded",String(open));
      if (open) $("language-select").focus();
    });
    $("options-close").addEventListener("click", () => { panel.hidden=true; button.setAttribute("aria-expanded","false"); button.focus(); });
    $("language-select").value = language;
    $("language-select").addEventListener("change", e => applyLanguage(e.target.value));
    $("music-toggle").addEventListener("click", toggleMusic);
    $("restart-current").addEventListener("click", () => {
      if (confirm(language==="es" ? "¿Querés abandonar esta partida y comenzar de nuevo? El progreso histórico guardado no se borrará." : language==="fr" ? "Abandonner cette partie et recommencer ? Les statistiques enregistrées ne seront pas effacées." : language==="pt" ? "Deseja abandonar esta partida e começar novamente? O histórico salvo não será apagado." : "Leave this game and start again? Your saved record will not be deleted.")) {
        stopMusic(); location.reload();
      }
    });
    $("reset-record").addEventListener("click", () => {
      const promptText = language==="es" ? "¿Borrar todas las partidas, puntos e insignias guardadas en este dispositivo? Esta acción no se puede deshacer." : language==="fr" ? "Effacer toutes les parties, tous les points et badges enregistrés sur cet appareil ? Cette action est irréversible." : language==="pt" ? "Apagar todas as partidas, pontos e medalhas salvos neste dispositivo? Esta ação não pode ser desfeita." : "Delete all games, points and badges saved on this device? This cannot be undone.";
      if (!confirm(promptText)) return;
      try { localStorage.removeItem(RECORD_KEY); } catch(e) {}
      location.reload();
    });
  }

  function startMusic() {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) { $("music-note").textContent = "La música no está disponible en este navegador."; return; }
    try {
      audioContext = audioContext || new AudioCtx();
      if (audioContext.state === "suspended") audioContext.resume();
      musicOn = true;
      const melody = [261.63,329.63,392,329.63,293.66,349.23,440,349.23];
      let step = 0;
      const playNote = () => {
        if (!musicOn || !audioContext) return;
        const now = audioContext.currentTime;
        const osc = audioContext.createOscillator();
        const gain = audioContext.createGain();
        const filter = audioContext.createBiquadFilter();
        osc.type = "sine"; osc.frequency.value = melody[step++ % melody.length];
        filter.type = "lowpass"; filter.frequency.value = 850;
        gain.gain.setValueAtTime(0.0001,now);
        gain.gain.exponentialRampToValueAtTime(0.018,now+0.18);
        gain.gain.exponentialRampToValueAtTime(0.0001,now+1.15);
        osc.connect(filter); filter.connect(gain); gain.connect(audioContext.destination);
        osc.start(now); osc.stop(now+1.2);
        musicNodes.push(osc);
        osc.onended = () => { musicNodes = musicNodes.filter(n => n !== osc); };
      };
      playNote();
      musicTimer = window.setInterval(playNote, 820);
      $("music-toggle").textContent = "♫ " + (language==="es"?"Desactivar música":language==="fr"?"Désactiver la musique":language==="pt"?"Desativar música":"Turn music off");
      $("music-note").textContent = language==="es" ? "Música suave activada. Podés apagarla cuando quieras." : language==="fr" ? "Musique douce activée. Vous pouvez l'arrêter à tout moment." : language==="pt" ? "Música suave ativada. Você pode desligá-la quando quiser." : "Soft background music is on. You can turn it off at any time.";
      try { localStorage.setItem(MUSIC_KEY,"on"); } catch(e) {}
    } catch(e) { $("music-note").textContent = "No se pudo iniciar el audio en este navegador."; }
  }
  function stopMusic() {
    musicOn = false;
    if (musicTimer) window.clearInterval(musicTimer);
    musicTimer = null;
    musicNodes.forEach(n => { try { n.stop(); } catch(e) {} });
    musicNodes = [];
    if ($("music-toggle")) $("music-toggle").textContent = "♫ " + (language==="es"?"Activar música":language==="fr"?"Activer la musique":language==="pt"?"Ativar música":"Turn music on");
    try { localStorage.setItem(MUSIC_KEY,"off"); } catch(e) {}
  }
  function toggleMusic() { if (musicOn) stopMusic(); else startMusic(); }

  function init() {
    language = (() => { try { return localStorage.getItem(LANG_KEY) || "es"; } catch(e) { return "es"; } })();
    if (language !== "es") {
      translateQuestions(language);
      translateTextNodes(language);
    }
    injectControls();
    translateTextNodes(language);
    if (language !== "es") $("language-select").value = language;
    // La música nunca se reproduce automáticamente: requiere una acción explícita.
    if (document.hidden) stopMusic();
    const languageObserver = new MutationObserver(() => translateTextNodes(language));
    languageObserver.observe(document.body, {subtree:true,childList:true,characterData:true});
    document.addEventListener("visibilitychange", () => { if (document.hidden) stopMusic(); });
    window.addEventListener("pagehide", stopMusic);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded",init,{once:true});
  else init();
})();