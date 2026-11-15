(() => {
 const questions = Array.isArray(window.CHANAR_QUESTIONS) ? window.CHANAR_QUESTIONS : [];
 const $ = (id) => document.getElementById(id);
 const intro=$("intro"), game=$("game"), results=$("results");
 const start=$("start-button"), next=$("next-button"), restart=$("restart-button"), share=$("share-button");
 const answerButtons=[...document.querySelectorAll(".answer-button")];
 let order=[], index=0, score=0, answered=false;
 const total=()=>order.length;
 function shuffle(items){const copy=[...items];for(let i=copy.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[copy[i],copy[j]]=[copy[j],copy[i]];}return copy;}
 function show(el){el.classList.remove("hidden");}
 function hide(el){el.classList.add("hidden");}
 function begin(){if(!questions.length)return;order=shuffle(questions).slice(0,Math.min(10,questions.length));index=0;score=0;hide(intro);hide(results);show(game);render();}
 function render(){
  answered=false;const q=order[index];$("question-counter").textContent=String(index+1).padStart(2,"0")+" / "+String(total()).padStart(2,"0");
  $("progress-fill").style.width=(index/total()*100)+"%";$("category-label").textContent=q.category.toUpperCase();$("difficulty-label").textContent=q.difficulty;$("question-text").textContent=q.statement;$("question-art").querySelector(".art-big-icon").textContent=q.icon||"🌿";
  $("feedback-explanation").textContent=q.explanation;$("source-link").href=q.sourceUrl;$("source-link").textContent=q.sourceTitle+" ↗";$("feedback").classList.add("hidden");$("answer-buttons").classList.remove("hidden");
  answerButtons.forEach(b=>{b.disabled=false;b.classList.remove("selected");});$("score-live").textContent="ACIERTOS: "+score;
  window.scrollTo({top:0,behavior:"smooth"});
 }
 function respond(value,button){
  if(answered)return;answered=true;const q=order[index],correct=value===q.answer;if(correct)score++;
  answerButtons.forEach(b=>{b.disabled=true;if(b===button)b.classList.add("selected");});
  $("feedback-icon").textContent=correct?"✓":"↗";$("feedback-title").textContent=correct?"¡Bien ahí!":"¡Mirá lo que pasó!";
  $("feedback").style.background=correct?"#edf1e8":"#f5eee2";$("feedback-heading").style.color=correct?"#38664f":"#98643d";
  $("feedback-explanation").textContent=(correct?"¡Acertaste! ":"La respuesta correcta es "+(q.answer?"VERDADERO. ":"FALSO. "))+q.explanation;
  $("next-button").textContent=index===total()-1?"VER MI RESULTADO →":"SEGUIR DESCUBRIENDO →";
  $("score-live").textContent="ACIERTOS: "+score;hide($("answer-buttons"));show($("feedback"));
 }
 function finish(){
  hide(game);show(results);$("progress-fill").style.width="100%";$("final-score").textContent=score+"/"+total();
  let title="¡Gracias por jugar!",message="Cada respuesta es una oportunidad para conocer un poco más nuestro lugar.";
  const pct=score/total();if(pct>=.9){title="¡Memoria chañarense!";message="¡Qué nivel! Tenés muy presente la historia de nuestro lugar. Y todavía quedan muchas historias por descubrir.";}else if(pct>=.65){title="¡Gran conocedor del Chañar!";message="Conocés un montón de historias. Algunas seguro te sorprendieron. ¡Compartí el desafío con alguien más!";}else if(pct>=.4){title="¡Vecino curioso!";message="Hay datos que ya conocías y otros que acabás de descubrir. La historia local siempre tiene algo nuevo.";}else{title="¡A seguir descubriendo!";message="No pasa nada: la idea es aprender. Ahora ya tenés varias historias nuevas para contar.";}
  $("result-title").textContent=title;$("result-message").textContent=message;window.scrollTo({top:0,behavior:"smooth"});
 }
 start.addEventListener("click",begin);restart.addEventListener("click",begin);next.addEventListener("click",()=>{index++;if(index<total())render();else finish();});
 answerButtons.forEach(b=>b.addEventListener("click",()=>respond(b.dataset.answer==="true",b)));
 share.addEventListener("click",async()=>{const text="¡Hice "+score+" de "+total()+" en ¿Cuánto sabés del Chañar?! ¿Te animás?";if(navigator.share){try{await navigator.share({title:"¿Cuánto sabés del Chañar?",text,url:location.href});}catch(e){}}else if(navigator.clipboard){try{await navigator.clipboard.writeText(text+" "+location.href);share.textContent="¡ENLACE COPIADO!";}catch(e){share.textContent="COPIÁ EL ENLACE DEL NAVEGADOR";}}});
 if(!questions.length){start.disabled=true;start.textContent="PRÓXIMAMENTE";}
})();