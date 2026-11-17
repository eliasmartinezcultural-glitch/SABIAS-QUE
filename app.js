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
    intro: $("intro"), game: $("game"), results: $("results"),
    start: $("start-button"), next: $("next-button"), restart: $("restart-button"), home: $("home-button"),
    retry: $("retry-missed-button"), share: $("share-button"),
    copyAlias: $("copy-alias-button"), answers: $("answer-buttons"),
    question: $("question-text"), counter: $("question-counter"),
    category: $("category-label"), difficulty: $("difficulty-label"),
    art: $("question-art"), feedback: $("feedback"),
    feedbackIcon: $("feedback-icon"), feedbackTitle: $("feedback-title"),
    verdict: $("answer-verdict"), explanation: $("feedback-explanation"),
    bonus: $("learning-bonus"), source: $("source-link"),
    scoreLive: $("score-live"), progress: $("progress-track"),
    progressFill: $("progress-fill"), listen: $("listen-button"),
    listenExplain: $("listen-explanation")
  };
  const answerButtons = [...document.querySelectorAll(".answer-button")];
  const quickButtons = [...document.querySelectorAll("[data-quick-count]")];

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
    quickButtons.forEach((button) => {
      const count = button.dataset.quickCount === "all"
        ? total : Math.min(Number(button.dataset.quickCount), total);
      button.disabled = !count;
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

  function updateRecordDisplay() {
    const panel = $("player-record");
    if (!panel) return;
    if (!playerRecord.games) { hide(panel); return; }
    $("record-games").textContent = playerRecord.games;
    $("record-best").textContent = playerRecord.bestAccuracy + "%";
    $("record-correct").textContent = playerRecord.totalCorrect;
    show(panel);
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
    utterance.lang = "es-AR";
    utterance.rate = 0.88;
    button.textContent = "■ DETENER LECTURA";
    utterance.onend = utterance.onerror = () => { button.textContent = idleText; };
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  }

  function updateHud() {
    const total = deck.length || 1;
    const completed = position;
    const percent = Math.round(completed / total * 100);
    $("points-live").textContent = points;
    $("streak-live").textContent = streak;
    $("correct-live").textContent = correctCount;
    ui.scoreLive.textContent = "ACIERTOS: " + correctCount + " · PUNTOS: " + points;
    ui.progressFill.style.width = percent + "%";
    ui.progress.setAttribute("aria-valuenow", String(completed));
    ui.progress.setAttribute("aria-valuemax", String(total));
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
    ui.category.textContent = String(q.category || "HISTORIA").toUpperCase();
    ui.difficulty.textContent = String(q.difficulty || "DESAFÍO").toUpperCase();
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
    artImage.src = artByCategory[q.category] || "assets/tema-historia.svg";
    artImage.alt = "Ilustración sobre " + String(q.category || "la historia local").toLowerCase();
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
    const total = history.length;
    const ratio = total ? correctCount / total : 0;
    const accuracy = total ? Math.round(ratio * 100) : 0;
    $("final-score").textContent = correctCount + " de " + total;
    $("final-points").textContent = points;
    $("final-accuracy").textContent = accuracy + "%";
    $("final-streak").textContent = bestStreak;

    let title = "¡Gracias por jugar!";
    let message = "Cada respuesta es una oportunidad para conocer un poco más nuestro lugar.";
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
    playerRecord.games += 1;
    playerRecord.bestAccuracy = Math.max(playerRecord.bestAccuracy, accuracy);
    playerRecord.totalCorrect += correctCount;
    playerRecord.totalAnswered += total;
    try { localStorage.setItem(RECORD_KEY, JSON.stringify(playerRecord)); } catch (error) {}
    updateRecordDisplay();
    $("record-line").textContent = accuracy > previousBest
      ? "✨ ¡Nuevo mejor resultado en este dispositivo!"
      : "Tu mejor precisión guardada es " + playerRecord.bestAccuracy + "%.";

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

  async function shareResult() {
    const result = lastRun || { score: correctCount, total: history.length, points };
    const message = "¡Hice " + result.score + " de " + result.total +
      " en ¿Sabías que...? San Patricio del Chañar y sumé " + result.points +
      " puntos. ¿Te animás a jugar?";
    const payload = {
      title: "¿Sabías que...? — San Patricio del Chañar",
      text: message,
      url: location.href
    };
    $("share-feedback").textContent = "";
    if (navigator.share) {
      try { await navigator.share(payload); return; }
      catch (error) { if (error && error.name === "AbortError") return; }
    }
    const text = message + " " + location.href;
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        $("share-feedback").textContent = "¡Resultado copiado! Ahora podés pegarlo en WhatsApp.";
      } else {
        window.prompt("Copiá tu resultado y compartilo:", text);
      }
    } catch (error) {
      window.prompt("Copiá tu resultado y compartilo:", text);
    }
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
      feedback.textContent = "¡Gracias por apoyar este proyecto! ♡";
    } catch (error) {
      feedback.textContent = "Copiá manualmente: ocarina.guitarra";
    }
  }

  $("font-smaller").addEventListener("click", () => {
    fontLevel = Math.max(-1, fontLevel - 1);
    document.body.classList.toggle("text-small", fontLevel < 0);
    document.body.classList.toggle("text-large", fontLevel === 1);
    document.body.classList.toggle("text-extra-large", fontLevel === 2);
  });
  $("font-larger").addEventListener("click", () => {
    fontLevel = Math.min(2, fontLevel + 1);
    document.body.classList.toggle("text-small", fontLevel < 0);
    document.body.classList.toggle("text-large", fontLevel === 1);
    document.body.classList.toggle("text-extra-large", fontLevel === 2);
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
  quickButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const requested = button.dataset.quickCount === "all"
        ? validQuestions.length : Number(button.dataset.quickCount);
      startGame(shuffle(validQuestions).slice(0, requested), "quick");
    });
  });
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