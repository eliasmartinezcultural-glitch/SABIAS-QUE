(() => {
  "use strict";

  const $ = (id) => document.getElementById(id);
  const validQuestions = Array.isArray(window.CHANAR_QUESTIONS)
    ? window.CHANAR_QUESTIONS.filter((q) =>
        q && typeof q.statement === "string" && q.statement.trim() &&
        typeof q.explanation === "string" && q.explanation.trim() &&
        typeof q.answer === "boolean" &&
        typeof q.sourceUrl === "string" && /^https?:\/\//i.test(q.sourceUrl)
      )
    : [];

  const ui = {
    intro: $("intro"), game: $("game"), results: $("results"), support: $("support"), roundLabel: $("round-label"),
    start: $("start-button"), next: $("next-button"), restart: $("restart-button"), home: $("home-button"),
    retry: $("retry-missed-button"), share: $("share-button"),
    copyAlias: $("copy-alias-button"), answers: $("answer-buttons"),
    question: $("question-text"), counter: $("question-counter"),
    category: $("category-label"), difficulty: $("difficulty-label"), shortStart: $("short-game-button"),
    art: $("question-art"), feedback: $("feedback"),
    feedbackIcon: $("feedback-icon"), feedbackTitle: $("feedback-title"),
    verdict: $("answer-verdict"), explanation: $("feedback-explanation"),
    bonus: $("learning-bonus"), source: $("source-link"),
    scoreLive: $("score-live"), progress: $("progress-track"),
    progressFill: $("progress-fill"), listen: $("listen-button"),
    listenExplain: $("listen-explanation")
  };
  const answerButtons = [...document.querySelectorAll(".answer-button")];

  function refreshDiscoveryCounts() {
    const total = validQuestions.length;
    const available = $("available-questions");
    if (available) available.textContent = total
      ? total + (total === 1 ? " curiosidad disponible para descubrir." : " curiosidades disponibles para descubrir.")
      : "Estamos preparando nuevas curiosidades verificadas.";
    document.querySelectorAll("[data-count-for]").forEach((node) => {
      const categories = node.dataset.countFor.split(",");
      const count = validQuestions.filter((q) => categories.includes(q.category)).length;
      node.textContent = count + (count === 1 ? " pregunta" : " preguntas");
    });
    document.querySelectorAll("[data-category]").forEach((button) => {
      const categories = button.dataset.category.split(",");
      const count = validQuestions.filter((q) => categories.includes(q.category)).length;
      button.disabled = count === 0;
      button.setAttribute("aria-disabled", String(count === 0));
      button.setAttribute("aria-label", (button.querySelector(".topic-name")?.textContent || "Tema") + ", " + count + (count === 1 ? " pregunta disponible" : " preguntas disponibles"));
    });
  }


  let deck = [];
  let position = 0;
  let correctCount = 0;
  let points = 0;
  let streak = 0;
  let bestStreak = 0;
  let answered = false;
  let history = [];
  let fontLevel = 0;
  let gameMode = "full";
  let lastRun = null;
  const RECORD_KEY = "sabias-que-record-v1";

  function readRecord() {
    const empty = { games: 0, bestAccuracy: 0, totalCorrect: 0, totalAnswered: 0 };
    try {
      const saved = JSON.parse(localStorage.getItem(RECORD_KEY) || "null");
      if (!saved || typeof saved !== "object") return empty;
      return {
        games: Math.max(0, Number(saved.games) || 0),
        bestAccuracy: Math.max(0, Math.min(100, Number(saved.bestAccuracy) || 0)),
        totalCorrect: Math.max(0, Number(saved.totalCorrect) || 0),
        totalAnswered: Math.max(0, Number(saved.totalAnswered) || 0)
      };
    } catch (error) { return empty; }
  }

  let playerRecord = readRecord();
  const ACHIEVEMENTS = [
    { id: "first", threshold: 1, icon: "🌱", title: "Primera huella", detail: "Acertaste tu primera curiosidad." },
    { id: "five", threshold: 5, icon: "🧭", title: "Explorador del Chañar", detail: "Sumaste cinco respuestas correctas." },
    { id: "ten", threshold: 10, icon: "🏵️", title: "Memoria en marcha", detail: "Llegaste a diez descubrimientos." },
    { id: "twenty", threshold: 20, icon: "🏛️", title: "Guardián de historias", detail: "Alcanzaste veinte aciertos." },
    { id: "forty", threshold: 40, icon: "⭐", title: "Leyenda chañarense", detail: "Ya reuniste cuarenta aciertos." }
  ];

  function earnedAchievements(totalCorrect) {
    return ACHIEVEMENTS.filter((item) => totalCorrect >= item.threshold);
  }

  function renderAchievementShelf(container, list, totalCorrect, newlyEarned = []) {
    if (!container || !list) return;
    list.replaceChildren();
    const earnedIds = new Set(earnedAchievements(totalCorrect).map((item) => item.id));
    ACHIEVEMENTS.forEach((item) => {
      const card = document.createElement("div");
      const unlocked = earnedIds.has(item.id);
      const isNew = newlyEarned.includes(item.id);
      card.className = "achievement-item" + (unlocked ? " is-earned" : " is-locked") + (isNew ? " is-new" : "");
      const icon = document.createElement("span");
      icon.className = "achievement-icon";
      icon.textContent = unlocked ? item.icon : "🔒";
      const title = document.createElement("strong");
      title.textContent = item.title;
      const detail = document.createElement("small");
      detail.textContent = unlocked ? item.detail : "Se desbloquea con " + item.threshold + " aciertos acumulados.";
      card.append(icon, title, detail);
      list.append(card);
    });
    show(container);
  }

  function updateRecordDisplay() {
    const panel = $("player-record");
    if (!panel) return;
    if (!playerRecord.games) { hide(panel); return; }
    $("record-games").textContent = playerRecord.games;
    $("record-best").textContent = playerRecord.bestAccuracy + "%";
    $("record-correct").textContent = playerRecord.totalCorrect;
    show(panel);
    renderAchievementShelf($("achievement-shelf"), $("achievement-list"), playerRecord.totalCorrect);
  }

  const show = (node) => node && node.classList.remove("hidden");
  const hide = (node) => node && node.classList.add("hidden");

  function focus(node) {
    if (!node) return;
    node.setAttribute("tabindex", "-1");
    node.focus({ preventScroll: true });
  }

  function shuffle(items) {
    const copy = items.slice();
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  function scrollTop() {
    const reduced = window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const touchDevice = window.matchMedia &&
      window.matchMedia("(pointer: coarse)").matches;
    window.scrollTo({ top: 0, behavior: reduced || touchDevice ? "auto" : "smooth" });
  }

  function stopVoice() {
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    if (ui.listen) ui.listen.textContent = "🔊 ESCUCHAR LA PREGUNTA";
    if (ui.listenExplain) ui.listenExplain.textContent = "🔊 ESCUCHAR LA EXPLICACIÓN";
  }

  function speak(text, button, idleText) {
    if (!("speechSynthesis" in window) || !window.SpeechSynthesisUtterance) {
      button.textContent = "LECTURA NO DISPONIBLE";
      return;
    }
    if (window.speechSynthesis.speaking) {
      stopVoice();
      return;
    }
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = ({ es: "es-AR", en: "en-US", fr: "fr-FR", pt: "pt-BR" })[document.documentElement.lang] || "es-AR";
    utterance.rate = 0.88;
    button.textContent = "■ DETENER LECTURA";
    utterance.onend = utterance.onerror = () => { button.textContent = idleText; };
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  }

  function updateHud() {
    const total = deck.length || 1;
    const completed = Math.min(total, position + (answered ? 1 : 0));
    const percent = Math.round(completed / total * 100);
    $("points-live").textContent = points;
    $("streak-live").textContent = streak;
    $("correct-live").textContent = correctCount;
    ui.scoreLive.textContent = "ACIERTOS: " + correctCount + " · PUNTOS: " + points;
    ui.progressFill.style.width = percent + "%";
    ui.progress.setAttribute("aria-valuenow", String(completed));
    ui.progress.setAttribute("aria-valuemax", String(total));
    ui.progress.setAttribute("aria-valuetext", completed + " de " + total + " preguntas completadas.");
    $("progress-percent").textContent = percent + "% completado";
    $("progress-label").textContent = completed === 0
      ? "¡Vamos a empezar!"
      : completed === total ? "¡Recorrido completo!" : "¡Vas muy bien!";
  }

  function resetRun(items, mode) {
    deck = items.slice();
    position = 0;
    correctCount = 0;
    points = 0;
    streak = 0;
    bestStreak = 0;
    answered = false;
    history = [];
    gameMode = mode;
  }

  function startGame(items = validQuestions, mode = "full") {
    stopVoice();
    if (!items.length) {
      ui.question.textContent = "No hay preguntas disponibles para esta partida.";
      return;
    }
    resetRun(shuffle(items), mode);
    if (ui.roundLabel) {
      ui.roundLabel.textContent = mode === "category" ? "RECORRIDO POR TEMA"
        : mode === "review" ? "REPASO DE TUS RESPUESTAS"
        : mode === "short" ? "PARTIDA CORTITA"
        : items.length === 1 ? "UNA CURIOSIDAD"
        : items.length < validQuestions.length ? "PASEO CORTO"
        : "RECORRIDO COMPLETO";
    }
    hide(ui.support);
    hide(ui.intro);
    hide(ui.results);
    show(ui.game);
    renderQuestion();
  }

  function renderQuestion() {
    if (!deck.length || position >= deck.length) {
      finishGame();
      return;
    }

    answered = false;
    stopVoice();
    const q = deck[position];
    ui.counter.textContent =
      String(position + 1).padStart(2, "0") + " / " +
      String(deck.length).padStart(2, "0");
    ui.counter.setAttribute("aria-label", "Pregunta " + (position + 1) + " de " + deck.length);
    ui.category.textContent = String(q.category || "HISTORIA").toUpperCase();
    const difficultyLabels = {
      "FÁCIL": "PARA ENTRAR EN CALOR",
      "MEDIA": "A PENSAR",
      "DIFÍCIL": "DESAFÍO EXTRA"
    };
    ui.difficulty.textContent = difficultyLabels[String(q.difficulty || "").toUpperCase()] || "UNA HISTORIA PARA DESCUBRIR";
    ui.question.textContent = q.statement;
    ui.art.querySelector(".art-big-icon").textContent = q.icon || "🌿";
    const artImage = ui.art.querySelector(".question-illustration");
    const artByCategory = {
      "Fundación": "assets/tema-historia.svg",
      "Instituciones": "assets/tema-historia.svg",
      "Agua y producción": "assets/tema-agua.svg",
      "Tierra y territorio": "assets/tema-tierra.svg",
      "Nombre e identidad": "assets/tema-identidad.svg"
    };
    // Los recursos visuales opcionales viven junto a cada pregunta en questions.js.
    // Si una fotografía externa no carga, se utiliza la ilustración local de su categoría.
    const photo = q.image && typeof q.image.src === "string" ? q.image : null;
    const illustration = artByCategory[q.category] || "assets/tema-historia.svg";
    ui.art.classList.toggle("has-photo", Boolean(photo));
    if (photo) {
      ui.art.dataset.photoCaption = photo.caption;
      artImage.alt = photo.alt;
      artImage.onerror = () => {
        ui.art.classList.remove("has-photo");
        ui.art.removeAttribute("data-photo-caption");
        artImage.onerror = null;
        artImage.src = illustration;
        artImage.alt = "Ilustración sobre " + String(q.category || "la historia local").toLowerCase();
      };
      artImage.src = photo.src;
    } else {
      ui.art.removeAttribute("data-photo-caption");
      artImage.onerror = null;
      artImage.src = illustration;
      artImage.alt = "Ilustración sobre " + String(q.category || "la historia local").toLowerCase();
    }
    ui.source.href = q.sourceUrl;
    ui.source.textContent = (q.sourceTitle || "Consultar fuente histórica") + " ↗";
    ui.explanation.textContent = "";
    ui.verdict.textContent = "";
    ui.bonus.textContent = "";
    updateHud();

    hide(ui.feedback);
    show(ui.answers);
    answerButtons.forEach((button) => {
      button.disabled = false;
      button.classList.remove("selected", "answer-correct", "answer-wrong");
      button.setAttribute("aria-pressed", "false");
    });
    ui.next.disabled = true;
    ui.next.textContent = position === deck.length - 1
      ? "VER MI RESULTADO FINAL →"
      : "SIGUIENTE PREGUNTA →";
    scrollTop();
    window.setTimeout(() => focus(ui.question), 150);
  }

  function submitAnswer(value, selected) {
    if (answered || !deck[position]) return;
    answered = true;
    stopVoice();

    const q = deck[position];
    const isCorrect = value === q.answer;
    let earned = 0;

    if (isCorrect) {
      correctCount += 1;
      streak += 1;
      bestStreak = Math.max(bestStreak, streak);
      earned = 100;
      if (streak > 0 && streak % 3 === 0) earned += 50;
      points += earned;
    } else {
      streak = 0;
    }

    history.push({
      question: q,
      chosen: value,
      correct: q.answer,
      isCorrect,
      earned
    });

    answerButtons.forEach((button) => {
      const chosen = button === selected;
      button.disabled = true;
      button.classList.toggle("selected", chosen);
      button.classList.toggle("answer-correct", button.dataset.answer === String(q.answer));
      button.classList.toggle("answer-wrong", chosen && !isCorrect);
      button.setAttribute("aria-pressed", String(chosen));
    });

    ui.feedbackIcon.textContent = isCorrect ? "✓" : "✳";
    ui.feedbackTitle.textContent = isCorrect
      ? (streak >= 3 ? "¡RACHA IMPARABLE!" : "¡MUY BIEN! ¡ACERTASTE!")
      : "¡NO IMPORTA! ¡HOY APRENDIMOS!";
    ui.verdict.textContent = isCorrect
      ? "Tu respuesta es correcta: " + (q.answer ? "VERDADERO." : "FALSO.")
      : "La respuesta correcta era: " + (q.answer ? "VERDADERO." : "FALSO.") +
        " Tu respuesta fue " + (value ? "VERDADERO." : "FALSO.");
    ui.explanation.textContent = q.explanation;

    if (isCorrect) {
      ui.bonus.textContent = "⭐ +" + earned + " PUNTOS" +
        (streak % 3 === 0 ? " · ¡BONO DE RACHA!" : "") +
        " · 🔥 RACHA: " + streak;
    } else {
      ui.bonus.textContent = "💡 La próxima pregunta es una nueva oportunidad. No perdés puntos por equivocarte.";
    }

    ui.feedback.classList.toggle("feedback-correct", isCorrect);
    ui.feedback.classList.toggle("feedback-learning", !isCorrect);
    hide(ui.answers);
    show(ui.feedback);
    updateHud();

    ui.next.disabled = false;
    ui.next.textContent = position === deck.length - 1
      ? "TERMINAR Y VER MI RESULTADO →"
      : "SIGUIENTE PREGUNTA →";
    focus(ui.feedbackTitle);
  }

  function nextQuestion() {
    if (!answered || ui.next.disabled) return;
    ui.next.disabled = true;
    stopVoice();
    position += 1;
    if (position < deck.length) renderQuestion();
    else finishGame();
  }

  function finishGame() {
    stopVoice();
    hide(ui.game);
    show(ui.results);
    show(ui.support);
    const total = history.length;
    const ratio = total ? correctCount / total : 0;
    const accuracy = total ? Math.round(ratio * 100) : 0;
    $("final-score").textContent = correctCount + " de " + total;
    $("final-points").textContent = points;
    $("final-accuracy").textContent = accuracy + "%";
    $("final-streak").textContent = bestStreak;

    let title = "¡Aventura completada!";
    let message = "Cada respuesta es una oportunidad para conocer un poco más nuestro lugar. ¡Gracias por recorrer San Patricio del Chañar!";
    let badge = "🌱 CURIOSIDAD CHAÑARENSE";
    if (ratio === 1) {
      title = "¡PERFECTO! ¡MEMORIA CHAÑARENSE!";
      message = "¡No se te escapó ninguna! Conocés muy bien estas historias. Hay muchas más esperando ser descubiertas.";
      badge = "🏆 LEYENDA DEL CHAÑAR";
    } else if (ratio >= 0.75) {
      title = "¡QUÉ GRAN PARTIDA!";
      message = "Tenés muy presente la historia de nuestro lugar. ¡Te faltó muy poquito para completar el desafío!";
      badge = "🥇 GRAN CONOCEDOR/A";
    } else if (ratio >= 0.5) {
      title = "¡VAS DESCUBRIENDO!";
      message = "Ya conocés varias historias nuevas. Repasá las que te costaron y vas a sorprenderte con lo que aprendés.";
      badge = "🥈 EXPLORADOR/A LOCAL";
    } else {
      title = "¡ESTO RECIÉN EMPIEZA!";
      message = "No importa cuántas acertaste: ahora conocés más que antes. Volvé a jugar y descubrí nuevas historias.";
      badge = "🌱 CURIOSO/A DEL CHAÑAR";
    }
    $("result-title").textContent = title;
    $("result-message").textContent = message;
    $("result-badge").textContent = badge;

    const missed = history.filter((item) => !item.isCorrect);
    const reviewPanel = $("review-panel");
    const reviewList = $("review-list");
    reviewList.replaceChildren();
    if (history.length) {
      show(reviewPanel);
      history.forEach((item, i) => {
        const card = document.createElement("article");
        card.className = "review-item " + (item.isCorrect ? "review-correct" : "review-missed");
        const label = document.createElement("strong");
        label.textContent = (item.isCorrect ? "✓ Bien respondida · " : "↗ Para volver a descubrir · ") + (i + 1);
        const statement = document.createElement("p");
        statement.textContent = item.question.statement;
        const answer = document.createElement("span");
        answer.textContent = "Respuesta correcta: " + (item.correct ? "VERDADERO" : "FALSO") +
          (item.isCorrect ? " · ¡Acertaste!" : " · Tu respuesta: " + (item.chosen ? "VERDADERO" : "FALSO"));
        const explanation = document.createElement("p");
        explanation.textContent = item.question.explanation;
        card.append(label, statement, answer, explanation);
        reviewList.append(card);
      });
    } else hide(reviewPanel);

    if (missed.length) show(ui.retry);
    else hide(ui.retry);

    const categoryPanel = $("category-breakdown");
    const categoryResults = $("category-results");
    categoryResults.replaceChildren();
    const categoryTotals = new Map();
    history.forEach((item) => {
      const name = item.question.category || "Otros temas";
      if (!categoryTotals.has(name)) categoryTotals.set(name, { total: 0, correct: 0 });
      const stats = categoryTotals.get(name);
      stats.total += 1;
      if (item.isCorrect) stats.correct += 1;
    });
    categoryTotals.forEach((stats, name) => {
      const row = document.createElement("div");
      row.className = "category-result-row";
      const title = document.createElement("strong");
      title.textContent = name;
      const score = document.createElement("span");
      score.textContent = stats.correct + " de " + stats.total + " aciertos";
      const track = document.createElement("div");
      track.className = "category-result-track";
      const fill = document.createElement("span");
      fill.style.width = Math.round(stats.correct / stats.total * 100) + "%";
      track.append(fill);
      row.append(title, score, track);
      categoryResults.append(row);
    });
    if (categoryTotals.size) show(categoryPanel);
    else hide(categoryPanel);

    const previousBest = playerRecord.bestAccuracy;
    const previousCorrect = playerRecord.totalCorrect;
    const previouslyEarned = new Set(earnedAchievements(previousCorrect).map((item) => item.id));
    playerRecord.games += 1;
    playerRecord.bestAccuracy = Math.max(playerRecord.bestAccuracy, accuracy);
    playerRecord.totalCorrect += correctCount;
    playerRecord.totalAnswered += total;
    try { localStorage.setItem(RECORD_KEY, JSON.stringify(playerRecord)); } catch (error) {}
    updateRecordDisplay();
    $("record-line").textContent = accuracy > previousBest
      ? "✨ ¡Nuevo mejor resultado en este dispositivo!"
      : "Tu mejor precisión guardada es " + playerRecord.bestAccuracy + "%.";
    const newlyEarned = earnedAchievements(playerRecord.totalCorrect)
      .filter((item) => !previouslyEarned.has(item.id)).map((item) => item.id);
    const earnedPanel = $("earned-achievements");
    if (newlyEarned.length) {
      renderAchievementShelf(earnedPanel, $("earned-list"), playerRecord.totalCorrect, newlyEarned);
    } else {
      hide(earnedPanel);
    }

    lastRun = {
      score: correctCount,
      total,
      points,
      accuracy,
      history: history.slice(),
      missed: missed.map((item) => item.question)
    };
    scrollTop();
    window.setTimeout(() => focus($("result-title")), 150);
  }

  function buildShareImage(result) {
    try {
      const canvas = document.createElement("canvas");
      canvas.width = 1200; canvas.height = 630;
      const ctx = canvas.getContext("2d");
      if (!ctx) return null;
      const lang = document.documentElement.lang || "es";
      const words = {
        en:{headline:"DID YOU KNOW...?",subtitle:"My discovery journey",correct:"CORRECT ANSWERS",points:"POINTS",footer:"CREATED BY ELÍAS MARTÍNEZ · OCARINA PRODUCCIONES"},
        fr:{headline:"LE SAVIEZ-VOUS... ?",subtitle:"Mon parcours de découvertes",correct:"BONNES RÉPONSES",points:"POINTS",footer:"CRÉÉ PAR ELÍAS MARTÍNEZ · OCARINA PRODUCCIONES"},
        pt:{headline:"VOCÊ SABIA...?",subtitle:"Meu caminho de descobertas",correct:"RESPOSTAS CORRETAS",points:"PONTOS",footer:"CRIADO POR ELÍAS MARTÍNEZ · OCARINA PRODUCCIONES"}
      }[lang] || {headline:"¿SABÍAS QUE...?",subtitle:"Mi recorrido de descubrimientos",correct:"RESPUESTAS CORRECTAS",points:"PUNTOS",footer:"CREADO Y DESARROLLADO POR ELÍAS MARTÍNEZ · OCARINA PRODUCCIONES"};
      const bg = ctx.createLinearGradient(0,0,1200,630);
      bg.addColorStop(0,"#f7f0e2"); bg.addColorStop(1,"#e9efdf");
      ctx.fillStyle=bg; ctx.fillRect(0,0,1200,630);
      ctx.strokeStyle="#cdbf9f"; ctx.lineWidth=3; ctx.beginPath();
      if (typeof ctx.roundRect === "function") ctx.roundRect(24,24,1152,582,28);
      else ctx.rect(24,24,1152,582);
      ctx.stroke();
      ctx.fillStyle="#34745e"; ctx.beginPath(); ctx.arc(94,88,28,0,Math.PI*2); ctx.fill();
      ctx.fillStyle="#fffdf7"; ctx.font="bold 28px Georgia"; ctx.textAlign="center"; ctx.fillText("¿?",94,98);
      ctx.textAlign="left"; ctx.fillStyle="#2f5241"; ctx.font="bold 20px Arial"; ctx.fillText("OCARINA PRODUCCIONES",140,82);
      ctx.fillStyle="#687764"; ctx.font="bold 11px Arial"; ctx.fillText("HISTORIAS, PERSONAS Y TERRITORIO",140,104);
      ctx.fillStyle="#263a38"; ctx.font=lang==="fr"?"bold 58px Georgia":"bold 66px Georgia"; ctx.fillText(words.headline,68,205);
      ctx.fillStyle="#34745e"; ctx.font="bold 28px Arial"; ctx.fillText("SAN PATRICIO DEL CHAÑAR",72,254);
      ctx.fillStyle="#526451"; ctx.font="26px Georgia"; ctx.fillText(words.subtitle,72,307);
      ctx.fillStyle="#245344"; ctx.font="bold 62px Georgia"; ctx.fillText(result.score+" / "+result.total,72,407);
      ctx.fillStyle="#526451"; ctx.font="bold 21px Arial"; ctx.fillText(words.correct,75,445);
      ctx.fillStyle="#34745e"; ctx.font="bold 22px Arial"; ctx.fillText(result.points+" "+words.points,75,493);
      // Paisaje ilustrado: valle, río y chacras, sin presentarlo como fotografía histórica.
      ctx.fillStyle="#dfb157"; ctx.beginPath(); ctx.arc(1000,170,72,0,Math.PI*2); ctx.fill();
      ctx.fillStyle="#a8b88f"; ctx.beginPath(); ctx.moveTo(610,420); ctx.lineTo(790,270); ctx.lineTo(920,380); ctx.lineTo(1040,285); ctx.lineTo(1160,410); ctx.lineTo(1160,555); ctx.lineTo(610,555); ctx.closePath(); ctx.fill();
      ctx.fillStyle="#6f9875"; ctx.beginPath(); ctx.moveTo(610,455); ctx.lineTo(790,350); ctx.lineTo(920,440); ctx.lineTo(1040,350); ctx.lineTo(1160,445); ctx.lineTo(1160,565); ctx.lineTo(610,565); ctx.closePath(); ctx.fill();
      ctx.fillStyle="#91c0ba"; ctx.beginPath(); ctx.moveTo(700,515); ctx.lineTo(835,465); ctx.lineTo(960,490); ctx.lineTo(1080,445); ctx.lineTo(1160,475); ctx.lineTo(1160,570); ctx.lineTo(700,570); ctx.closePath(); ctx.fill();
      ctx.strokeStyle="#557d59"; ctx.lineWidth=5;
      for(let y=415;y<490;y+=25){for(let x=790;x<1150;x+=42){ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x,y+15);ctx.stroke();ctx.beginPath();ctx.arc(x,y-5,7,0,Math.PI*2);ctx.fillStyle="#315c43";ctx.fill();}}
      ctx.fillStyle="#34745e"; ctx.fillRect(68,548,1064,2);
      ctx.fillStyle="#405b49"; ctx.font="bold 15px Arial"; ctx.fillText(words.footer,70,580);
      const data=canvas.toDataURL("image/png");
      const raw=atob(data.split(",")[1]); const bytes=new Uint8Array(raw.length);
      for(let i=0;i<raw.length;i++) bytes[i]=raw.charCodeAt(i);
      return new File([bytes],"mi-resultado-sabias-que.png",{type:"image/png"});
    } catch(error) { return null; }
  }

  async function shareResult() {
    const result = lastRun || { score: correctCount, total: history.length, points };
    const message = "¡Hice " + result.score + " de " + result.total +
      " en ¿Sabías que...? San Patricio del Chañar y sumé " + result.points +
      " puntos. ¿Te animás a jugar?";
    const payload = {
      title: "¿Sabías que...? — San Patricio del Chañar",
      text: message,
      url: "https://eliasmartinezcultural-glitch.github.io/SABIAS-QUE/"
    };
    $("share-feedback").textContent = "";
    if (navigator.share) {
      const card = buildShareImage(result);
      let canShareFile = false;
      try { canShareFile = Boolean(card && navigator.canShare && navigator.canShare({files:[card]})); } catch(error) {}
      if (canShareFile) {
        try { await navigator.share({files:[card],title:payload.title,text:message,url:payload.url}); return; }
        catch (error) { if (error && error.name === "AbortError") return; }
      }
      try { await navigator.share(payload); return; }
      catch (error) { if (error && error.name === "AbortError") return; }
    }
    const shareText = message + " " + payload.url;
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(shareText);
        $("share-feedback").textContent = "¡Resultado copiado! Podés pegarlo en WhatsApp. En celulares compatibles también se comparte una tarjeta con imagen.";
      } else {
        window.prompt("Copiá tu resultado y compartilo:", shareText);
      }
    } catch (error) {
      window.prompt("Copiá tu resultado y compartilo:", shareText);
    }
  }

  function shareWhatsAppResult() {
    const result = lastRun || { score: correctCount, total: history.length, points };
    const message = "¡Terminé mi recorrido en ¿Sabías que...?\n\n" +
      "📍 San Patricio del Chañar\n" +
      "🏅 Resultado: " + result.score + " de " + result.total + " respuestas correctas\n" +
      "⭐ Puntos: " + result.points + "\n\n" +
      "Es un juego gratuito de Ocarina Producciones para descubrir historias reales de nuestro lugar. ¿Te animás a jugar?\n\n" +
      "🎮 https://eliasmartinezcultural-glitch.github.io/SABIAS-QUE/";
    const url = "https://wa.me/?text=" + encodeURIComponent(message);
    window.open(url, "_blank", "noopener,noreferrer");
    $("share-feedback").textContent = "Se abrió WhatsApp con tu invitación lista para revisar y enviar.";
  }

  async function copyDonationAlias() {
    const alias = $("donation-alias").textContent.trim();
    const feedback = $("copy-feedback");
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(alias);
      } else {
        const temp = document.createElement("textarea");
        temp.value = alias;
        temp.readOnly = true;
        temp.style.position = "absolute";
        temp.style.left = "-9999px";
        document.body.appendChild(temp);
        temp.select();
        const copied = document.execCommand("copy");
        temp.remove();
        if (!copied) throw new Error("copy");
      }
      ui.copyAlias.textContent = "¡ALIAS COPIADO!";
      feedback.textContent = "Alias copiado. La transferencia solo se realiza si vos decidís hacerla. ♡";
    } catch (error) {
      feedback.textContent = "Copiá manualmente: ocarina.guitarra";
    }
  }

  $("font-smaller").addEventListener("click", () => {
    fontLevel = Math.max(-1, fontLevel - 1);
    document.body.classList.toggle("text-small", fontLevel < 0);
    document.body.classList.toggle("text-large", fontLevel === 1);
    document.body.classList.toggle("text-extra-large", fontLevel === 2);
    document.documentElement.classList.toggle("text-small", fontLevel < 0);
    document.documentElement.classList.toggle("text-large", fontLevel === 1);
    document.documentElement.classList.toggle("text-extra-large", fontLevel === 2);
  });
  $("font-larger").addEventListener("click", () => {
    fontLevel = Math.min(2, fontLevel + 1);
    document.body.classList.toggle("text-small", fontLevel < 0);
    document.body.classList.toggle("text-large", fontLevel === 1);
    document.body.classList.toggle("text-extra-large", fontLevel === 2);
    document.documentElement.classList.toggle("text-small", fontLevel < 0);
    document.documentElement.classList.toggle("text-large", fontLevel === 1);
    document.documentElement.classList.toggle("text-extra-large", fontLevel === 2);
  });
  $("contrast-toggle").addEventListener("click", (event) => {
    const active = document.body.classList.toggle("high-contrast");
    event.currentTarget.setAttribute("aria-pressed", String(active));
    event.currentTarget.textContent = active ? "CONTRASTE NORMAL" : "MÁS CONTRASTE";
  });

  if (!("speechSynthesis" in window)) {
    ui.listen.disabled = true;
    ui.listenExplain.disabled = true;
    ui.listen.title = "La lectura en voz alta no está disponible en este navegador.";
    ui.listenExplain.title = ui.listen.title;
  }
  ui.listen.addEventListener("click", () => {
    if (deck[position]) speak(deck[position].statement, ui.listen, "🔊 ESCUCHAR LA PREGUNTA");
  });
  ui.listenExplain.addEventListener("click", () => {
    if (deck[position] && answered) speak(ui.explanation.textContent, ui.listenExplain, "🔊 ESCUCHAR LA EXPLICACIÓN");
  });

  ui.start.addEventListener("click", () => startGame());
  if (ui.shortStart) {
    ui.shortStart.addEventListener("click", () => {
      const shortDeck = shuffle(validQuestions).slice(0, Math.min(5, validQuestions.length));
      startGame(shortDeck, "short");
    });
  }
  refreshDiscoveryCounts();
  updateRecordDisplay();

  document.querySelectorAll("[data-category]").forEach((button) => {
    button.addEventListener("click", () => {
      const selectedCategories = button.dataset.category.split(",");
      const selection = validQuestions.filter((q) => selectedCategories.includes(q.category));
      startGame(selection, "category");
    });
  });
  ui.home.addEventListener("click", () => {
    stopVoice();
    hide(ui.game);
    hide(ui.results);
    hide(ui.support);
    show(ui.intro);
    scrollTop();
    focus($("main-title"));
  });
  ui.restart.addEventListener("click", () => startGame());
  ui.retry.addEventListener("click", () => {
    if (lastRun && lastRun.missed.length) startGame(lastRun.missed, "review");
  });
  ui.next.addEventListener("click", nextQuestion);
  answerButtons.forEach((button) => {
    button.addEventListener("click", () => submitAnswer(button.dataset.answer === "true", button));
  });
  ui.share.addEventListener("click", shareResult);
  const whatsappResult = $("whatsapp-result-button");
  if (whatsappResult) whatsappResult.addEventListener("click", shareWhatsAppResult);
  ui.copyAlias.addEventListener("click", copyDonationAlias);

  // En navegadores móviles y vistas embebidas, detener el audio al salir de la página.
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) stopVoice();
  });
  window.addEventListener("pagehide", stopVoice);

  if (!validQuestions.length) {
    ui.start.disabled = true;
    ui.start.textContent = "PRÓXIMAMENTE";
    ui.question.textContent = "Estamos preparando nuevas preguntas.";
  }
})();