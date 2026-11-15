(() => {
  "use strict";

  const $ = (id) => document.getElementById(id);
  const questions = Array.isArray(window.CHANAR_QUESTIONS)
    ? window.CHANAR_QUESTIONS.filter((q) =>
        q &&
        typeof q.statement === "string" && q.statement.trim() &&
        typeof q.explanation === "string" && q.explanation.trim() &&
        typeof q.answer === "boolean" &&
        typeof q.sourceUrl === "string" && /^https?:\/\//i.test(q.sourceUrl)
      )
    : [];

  const el = {
    intro: $("intro"), game: $("game"), results: $("results"),
    start: $("start-button"), next: $("next-button"), restart: $("restart-button"),
    share: $("share-button"), copyAlias: $("copy-alias-button"),
    answers: $("answer-buttons"), question: $("question-text"),
    counter: $("question-counter"), category: $("category-label"),
    difficulty: $("difficulty-label"), art: $("question-art"),
    feedback: $("feedback"), feedbackIcon: $("feedback-icon"),
    feedbackTitle: $("feedback-title"), explanation: $("feedback-explanation"),
    source: $("source-link"), scoreLive: $("score-live"),
    progress: $("progress-track"), progressFill: $("progress-fill"),
    listen: $("listen-button"), listenExplain: $("listen-explanation")
  };

  const answerButtons = [...document.querySelectorAll(".answer-button")];
  let order = [];
  let index = 0;
  let score = 0;
  let answered = false;
  let fontLevel = 0;

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

  function scrollToTop() {
    const reduce = window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
  }

  function stopVoice() {
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    if (el.listen) el.listen.textContent = "🔊 ESCUCHAR LA PREGUNTA";
    if (el.listenExplain) el.listenExplain.textContent = "🔊 ESCUCHAR LA EXPLICACIÓN";
  }

  function speak(text, button, idleLabel) {
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
    utterance.onend = utterance.onerror = () => {
      button.textContent = idleLabel;
    };
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  }

  function updateProgress(completed) {
    const total = order.length || 1;
    const percent = Math.max(0, Math.min(100, completed / total * 100));
    el.progressFill.style.width = percent + "%";
    el.progress.setAttribute("aria-valuenow", String(completed));
    el.progress.setAttribute("aria-valuemax", String(total));
  }

  function begin() {
    stopVoice();
    if (!questions.length) {
      el.question.textContent = "Estamos preparando nuevas preguntas. Volvé pronto.";
      return;
    }
    order = shuffle(questions);
    index = 0;
    score = 0;
    answered = false;
    hide(el.intro);
    hide(el.results);
    show(el.game);
    renderQuestion();
  }

  function renderQuestion() {
    if (!order.length || index < 0 || index >= order.length) {
      finish();
      return;
    }

    answered = false;
    stopVoice();
    const q = order[index];

    el.counter.textContent =
      String(index + 1).padStart(2, "0") + " / " +
      String(order.length).padStart(2, "0");
    el.category.textContent = String(q.category || "HISTORIA").toUpperCase();
    el.difficulty.textContent = "PREGUNTA " + (index + 1);
    el.question.textContent = q.statement;
    el.art.querySelector(".art-big-icon").textContent = q.icon || "🌿";
    el.explanation.textContent = "";
    el.source.href = q.sourceUrl;
    el.source.textContent = (q.sourceTitle || "Consultar fuente") + " ↗";

    updateProgress(index);
    hide(el.feedback);
    show(el.answers);

    answerButtons.forEach((button) => {
      button.disabled = false;
      button.classList.remove("selected");
      button.setAttribute("aria-pressed", "false");
    });

    el.scoreLive.textContent = "ACIERTOS: " + score;
    el.next.disabled = false;
    el.next.textContent = index === order.length - 1
      ? "TERMINAR Y VER MI RESULTADO →"
      : "SEGUIR CON LA PRÓXIMA →";

    scrollToTop();
    window.setTimeout(() => focus(el.question), 180);
  }

  function answerQuestion(value, selectedButton) {
    if (answered || !order[index]) return;

    answered = true;
    stopVoice();

    const q = order[index];
    const correct = value === q.answer;
    if (correct) score++;

    answerButtons.forEach((button) => {
      const chosen = button === selectedButton;
      button.disabled = true;
      button.classList.toggle("selected", chosen);
      button.setAttribute("aria-pressed", String(chosen));
    });

    el.feedbackIcon.textContent = correct ? "✓" : "✳";
    el.feedbackTitle.textContent = correct
      ? "¡Muy bien! ¡Acertaste!"
      : "¡No importa! ¡Hoy aprendimos!";
    el.feedback.classList.toggle("feedback-correct", correct);
    el.feedback.classList.toggle("feedback-learning", !correct);
    el.explanation.textContent =
      (correct ? "¡Acertaste! " :
        "La respuesta correcta es " + (q.answer ? "VERDADERO. " : "FALSO. ")) +
      q.explanation;

    el.scoreLive.textContent = "ACIERTOS: " + score;
    hide(el.answers);
    show(el.feedback);

    el.next.disabled = false;
    el.next.textContent = index === order.length - 1
      ? "TERMINAR Y VER MI RESULTADO →"
      : "SEGUIR CON LA PRÓXIMA →";

    focus(el.feedbackTitle);
  }

  function advance() {
    // El botón de avance solo se muestra después de responder.
    // La comprobación de answered evita saltar preguntas por dobles clics.
    if (!answered) return;

    stopVoice();
    if (index + 1 < order.length) {
      index += 1;
      renderQuestion();
    } else {
      finish();
    }
  }

  function finish() {
    stopVoice();
    hide(el.game);
    show(el.results);
    updateProgress(order.length);

    $("final-score").textContent = score + " de " + order.length;
    const ratio = order.length ? score / order.length : 0;
    let title = "¡Gracias por jugar!";
    let message = "Cada respuesta es una oportunidad para conocer un poco más nuestro lugar.";

    if (ratio >= 0.9) {
      title = "¡Memoria chañarense!";
      message = "¡Qué nivel! Tenés muy presente la historia de nuestro lugar. Y todavía quedan muchas historias por descubrir.";
    } else if (ratio >= 0.65) {
      title = "¡Gran conocedor del Chañar!";
      message = "Conocés un montón de historias. Algunas seguro te sorprendieron. ¡Compartí el desafío con alguien más!";
    } else if (ratio >= 0.4) {
      title = "¡Vecino curioso!";
      message = "Hay datos que ya conocías y otros que acabás de descubrir. La historia local siempre tiene algo nuevo.";
    } else {
      title = "¡A seguir descubriendo!";
      message = "No pasa nada: la idea es aprender. Ahora ya tenés varias historias nuevas para contar.";
    }

    $("result-title").textContent = title;
    $("result-message").textContent = message;
    scrollToTop();
    window.setTimeout(() => focus($("result-title")), 180);
  }

  async function shareResult() {
    const message = "¡Hice " + score + " de " + order.length +
      " en ¿Sabías que...? San Patricio del Chañar. ¿Te animás?";
    const payload = {
      title: "¿Sabías que...? — San Patricio del Chañar",
      text: message,
      url: location.href
    };
    $("share-feedback").textContent = "";

    if (navigator.share) {
      try {
        await navigator.share(payload);
        return;
      } catch (error) {
        if (error && error.name === "AbortError") return;
      }
    }

    const value = message + " " + location.href;
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(value);
        $("share-feedback").textContent =
          "¡Resultado copiado! Ahora podés pegarlo en WhatsApp.";
      } else {
        window.prompt("Copiá tu resultado y compartilo:", value);
      }
    } catch (error) {
      window.prompt("Copiá tu resultado y compartilo:", value);
    }
  }

  async function copyDonationAlias() {
    const alias = $("donation-alias").textContent.trim();
    const feedback = $("copy-feedback");
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(alias);
      } else {
        const temporary = document.createElement("textarea");
        temporary.value = alias;
        temporary.readOnly = true;
        temporary.style.position = "absolute";
        temporary.style.left = "-9999px";
        document.body.appendChild(temporary);
        temporary.select();
        const copied = document.execCommand("copy");
        temporary.remove();
        if (!copied) throw new Error("No se pudo copiar");
      }
      el.copyAlias.textContent = "¡ALIAS COPIADO!";
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
    const enabled = document.body.classList.toggle("high-contrast");
    event.currentTarget.setAttribute("aria-pressed", String(enabled));
    event.currentTarget.textContent = enabled ? "CONTRASTE NORMAL" : "MÁS CONTRASTE";
  });

  if (!("speechSynthesis" in window)) {
    el.listen.disabled = true;
    el.listenExplain.disabled = true;
    el.listen.title = "La lectura en voz alta no está disponible en este navegador.";
    el.listenExplain.title = el.listen.title;
  }

  el.listen.addEventListener("click", () => {
    if (order[index]) speak(order[index].statement, el.listen, "🔊 ESCUCHAR LA PREGUNTA");
  });

  el.listenExplain.addEventListener("click", () => {
    if (order[index] && answered) {
      speak(el.explanation.textContent, el.listenExplain, "🔊 ESCUCHAR LA EXPLICACIÓN");
    }
  });

  el.start.addEventListener("click", begin);
  el.restart.addEventListener("click", begin);
  el.next.addEventListener("click", advance);

  answerButtons.forEach((button) => {
    button.addEventListener("click", () => {
      answerQuestion(button.dataset.answer === "true", button);
    });
  });

  el.share.addEventListener("click", shareResult);
  el.copyAlias.addEventListener("click", copyDonationAlias);

  if (!questions.length) {
    el.start.disabled = true;
    el.start.textContent = "PRÓXIMAMENTE";
    el.question.textContent = "Estamos preparando nuevas preguntas.";
  }
})();