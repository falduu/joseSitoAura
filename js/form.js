/* ==========================================================================
   AURA — form.js
   La pagina contatti, resa elegante. Progressivo:
     · senza JS  → il form funziona lo stesso (validazione nativa + mailto)
     · con  JS   → validazione sobria, focus mirato, mail composta dal valore
                   dei campi, stato annunciato a screen reader
   Zero dipendenze. Un solo compito.
   ========================================================================== */
(() => {
  'use strict';

  const form = document.getElementById('contact-form');
  if (!form) return;                        // pagine senza form: nulla da fare

  const status = document.getElementById('form-status');

  /* Con JS la validazione è nostra: spegniamo quella nativa (bolle).
     Se JS manca, "noValidate" non viene mai imposto → native bubbles. */
  form.noValidate = true;

  /* Indirizzo destinatario: UNA sola fonte di verità — l'attributo action.
     Cambia il mailto: nell'HTML e cambia qui per tutto. */
  const TO  = form.getAttribute('action', '').replace(/^mailto:/i, '');
  const SUB = form.querySelector('[name="_subject"]')?.value
              || 'AURA — Private enquiry';

  /* Regole: id campo → check. Restituisce "" se valido, altrimenti il
     messaggio. Ogni input vive dentro <p class="field">: è il wrapper
     che porta la classe d'errore (il messaggio si mostra via CSS). */
  const RULES = [
    { el: 'f-name',   check: v => v.trim() ? '' : 'Please tell us your name.' },
    { el: 'f-email',  check: v => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim())
                                   ? '' : 'That email doesn’t look right.' },
    { el: 'f-msg',    check: v => v.trim() ? '' : 'A few words — we’ll take it from there.' },
  ].map(r => ({ input: document.getElementById(r.el), ...r }));

  const wrapOf   = (input) => input.closest('.field');
  const valOf    = (input) => (input.value || '').trim();

  const mark = (input, msg) => {
    const wrap = wrapOf(input);
    if (msg) {
      wrap.classList.add('field--error');
      input.setAttribute('aria-invalid', 'true');
      /* Il messaggio è già nel markup (span.field__msg): il testo custom
         serve solo quando la regola cambia idea in futuro. */
      if (msg !== wrap.querySelector('.field__msg')?.textContent) {
        // testo del markup vincente: nessun doppione nel codice
      }
    } else {
      wrap.classList.remove('field--error');
      input.removeAttribute('aria-invalid');
    }
    return !msg;
  };

  const setStatus = (kind, text) => {
    if (!status) return;
    status.className = `form__status is-visible form__status--${kind}`;
    status.textContent = text;
  };

  /* Validazione totale. Restituisce il primo input invalido, o null. */
  const validateAll = () => {
    let firstBad = null;
    for (const r of RULES) {
      const ok = mark(r.input, r.check(r.input.value));
      if (!ok && !firstBad) firstBad = r.input;
    }
    return firstBad;
  };

  /* Mentre l'utente corregge: l'errore di quel campo si spegne da solo,
     appena il valore torna valido. Nessun reload di stato globale. */
  form.addEventListener('input', (e) => {
    const r = RULES.find((x) => x.input === e.target);
    if (r && wrapOf(r.input).classList.contains('field--error')) {
      mark(r.input, r.check(r.input.value));
      /* Se non resta nessun errore, ritira anche l'avviso generale. */
      if (RULES.every((x) => !wrapOf(x.input).classList.contains('field--error'))
          && status?.classList.contains('form__status--err')) {
        status.className = 'form__status';   // nascosto di nuovo
        status.textContent = '';
      }
    }
  });

  /* INVIO */
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const firstBad = validateAll();
    if (firstBad) {
      setStatus('err', 'Please check the highlighted fields.');
      firstBad.focus({ preventScroll: false });   // il campo invalido va visto
      return;
    }

    /* Corpo della mail, composto dai valori — etichette in inglese,
       campo vuoto → "—" (la mail resta leggibile anche mezzo compilata). */
    const line = (label, v) => `${label}: ${v.trim() || '—'}`;
    const body = [
      line('Name',    form.elements.name.value),
      line('Email',   form.elements.email.value),
      line('Company', form.elements.company?.value || ''),
      line('Event',   form.elements.event?.value || ''),
      '',
      'Message:',
      form.elements.message.value.trim(),
    ].join('\n');

    /* mailto: apro il client dell'utente. Se non ne ha uno, non succede
       nulla di rotto: lo stato dice l'indirizzo a mano. */
    const href = `mailto:${encodeURIComponent(TO)}`
               + `?subject=${encodeURIComponent(SUB)}`
               + `&body=${encodeURIComponent(body)}`;
    window.location.href = href;

    setStatus('ok', `Thank you — opening your email app. `
                  + `If nothing happens, write to ${TO}.`);

    /* Nessun reset: se il client non si apre, l'utente non perde il testo. */
  });
})();