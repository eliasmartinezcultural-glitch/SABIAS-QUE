(() => {
  "use strict";

  const questions = Array.isArray(window.CHANAR_QUESTIONS)
    ? window.CHANAR_QUESTIONS.filter(isUsableQuestion)
    : [];

  function isUsableQuestion(q) {
    return q && typeof q.statement === "string" &&
      typeof q.explanation === "string" &&
      typeof q.answer === "boolean" &&
      typeof q.sourceUrl === "string" &&
      /^https?:\/\//i.test(q.sourceUrl);
  }

  const $ = (id) => document.getElementById(id);
  const intro = $("intro"), game = $("game"), results = $("results");
  const start = $("start-button"), next = $("next-button");
  const restart = $("restart-button"), share = $("share-button");
  const copyAlias = $("copy-alias-button");
  const answerButtons = Array.from(document.querySelectorAll(".answer-button"));

  let order = [], index = 0, score = 0, answered = false;

  function show(el) { if (el) el.classList.remove("hidden"); }
  function hide(el) { if (el) el.classList.add("hidden"); }
  function shuffle(items) {
    const copy = items.slice();
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }
  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  }
  function setProgress(value) {
    const percent = Math.max(0, Math.min(100, value));
    $("progress-fill").style.width = percent + "%";
    $("progress-track").setAttribute("aria-valuenow", String(Math.round(percent / 100 * order.length)));
  }

  function begin() {
    if (!questions.length) {
      $("question-text").textContent = "Estamos preparando nuevas preguntas. Volvé pronto.";
      return;
    }
    order = shuffle(questions);
    index = 0;
    score = 0;
    hide(intro); hide(results); show(game);
    render();
  }

  function render() {
    answered = false;
    const q = order[index];
    $("question-counter").textContent = String(index + 1).padStart(2, "0") + " / " + String(order.length).padStart(2, "0");
    setProgress(index / order.length * 100);
    $("category-label").textContent = String(q.category || "HISTORIA").toUpperCase();
    $("difficulty-label").textContent = q.difficulty || "PARA DESCUBRIR";
    $("question-text").textContent = q.statement;
    $("question-art").querySelector(".art-big-icon").textContent = q.icon || "🌿";
    $("feedback-explanation").textContent = "";
    $("source-link").href = q.sourceUrl;
    $("source-link").textContent = (q.sourceTitle || "Consultar fuente") + " ↗";
    $("feedback").classList.add("hidden");
    $("answer-buttons").classList.remove("hidden");
    answerButtons.forEach((button) => {
      button.disabled = false;
      button.classList.remove("selected");
      button.setAttribute("aria-pressed", "false");
    });
    $("score-live").textContent = "ACIERTOS: " + score;
    scrollToTop();
  }

  function respond(value, selectedButton) {
    if (answered) return;
    answered = true;
    const q = order[index];
    const correct = value === q.answer;
    if (correct) score++;

    answerButtons.forEach((button) => {
      button.disabled = true;
      const selected = button === selectedButton;
      button.classList.toggle("selected", selected);
      button.setAttribute("aria-pressed", String(selected));
    });

    $("feedback-icon").textContent = correct ? "✓" : "✳";
    $("feedback-title").textContent = correct ? "¡Bien ahí!" : "¡Mirá lo que pasó!";
    $("feedback").classList.toggle("feedback-correct", correct);
    $("feedback").classList.toggle("feedback-learning", !correct);
    $("feedback-explanation").textContent =
      (correct ? "¡Acertaste! " : "La respuesta correcta es " + (q.answer ? "VERDADERO. " : "FALSO. ")) +
      q.explanation;
    $("next-button").innerHTML = index === order.length - 1
      ? "VER MI RESULTADO <span aria-hidden=\"true\">→</span>"
      : "SEGUIR DESCUBRIENDO <span aria-hidden=\"true\">→</span>";
    $("score-live").textContent = "ACIERTOS: " + score;
    hide($("answer-buttons"));
    show($("feedback"));
  }

  function finish() {
    hide(game); show(results);
    setProgress(100);
    $("final-score").textContent = score + "/" + order.length;
    const percentage = score / order.length;
    let title = "¡Gracias por jugar!";
    let message = "Cada respuesta es una oportunidad para conocer un poco más nuestro lugar.";
    if (percentage >= 0.9) {
      title = "¡Memoria chañarense!";
      message = "¡Qué nivel! Tenés muy presente la historia de nuestro lugar. Y todavía quedan muchas historias por descubrir.";
    } else if (percentage >= 0.65) {
      title = "¡Gran conocedor del Chañar!";
      message = "Conocés un montón de historias. Algunas seguro te sorprendieron. ¡Compartí el desafío con alguien más!";
    } else if (percentage >= 0.4) {
      title = "¡Vecino curioso!";
      message = "Hay datos que ya conocías y otros que acabás de descubrir. La historia local siempre tiene algo nuevo.";
    } else {
      title = "¡A seguir descubriendo!";
      message = "No pasa nada: la idea es aprender. Ahora ya tenés varias historias nuevas para contar.";
    }
    $("result-title").textContent = title;
    $("result-message").textContent = message;
    scrollToTop();
  }

  async function shareResult() {
    const message = "¡Hice " + score + " de " + order.length +
      " en ¿Sabías que...? San Patricio del Chañar. ¿Te animás?";
    const payload = { title: "¿Sabías que...? — San Patricio del Chañar", text: message, url: location.href };
    if (navigator.share) {
      try { await navigator.share(payload); return; } catch (error) {
        if (error && error.name === "AbortError") return;
      }
    }
    const shareText = message + " " + location.href;
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(shareText);
        share.textContent = "¡RESULTADO COPIADO!";
      } else {
        window.prompt("Copiá tu resultado y compartilo:", shareText);
      }
    } catch (error) {
      window.prompt("Copiá tu resultado y compartilo:", shareText);
    }
  }

  async function copyDonationAlias() {
    const alias = $("donation-alias").textContent.trim();
    const feedback = $("copy-feedback");
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(alias);
      } else {
        const helper = document.createElement("textarea");
        helper.value = alias;
        helper.setAttribute("readonly", "");
        helper.style.position = "absolute";
        helper.style.left = "-9999px";
        document.body.appendChild(helper);
        helper.select();
        const copied = document.execCommand("copy");
        helper.remove();
        if (!copied) throw new Error("No se pudo copiar automáticamente");
      }
      copyAlias.textContent = "¡ALIAS COPIADO!";
      feedback.textContent = "¡Gracias por apoyar este proyecto! ♡";
    } catch (error) {
      feedback.textContent = "Copiá manualmente: ocarina.guitarra";
    }
  }

  start.addEventListener("click", begin);
  restart.addEventListener("click", begin);
  next.addEventListener("click", () => {
    if (!answered) return;
    index++;
    if (index < order.length) render();
    else finish();
  });
  answerButtons.forEach((button) => {
    button.addEventListener("click", () => respond(button.dataset.answer === "true", button));
  });
  share.addEventListener("click", shareResult);
  copyAlias.addEventListener("click", copyDonationAlias);

  if (!questions.length) {
    start.disabled = true;
    start.textContent = "PRÓXIMAMENTE";
    $("question-text").textContent = "Estamos preparando nuevas preguntas.";
  }
})();