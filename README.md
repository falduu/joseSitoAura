# AURA — Private Motorsport Hospitality

Sito vetrina in HTML / CSS / JavaScript nativi.
Zero framework, zero build, zero dipendenze: si apre e funziona.

## Struttura

Aura/
├── index.html          Home — hero, manifesto, 3 pilastri, vision, galleria, CTA
├── team.html           The Team — crew, valori, chiusura
├── contatti.html       Contact — form "by invitation" + recapiti
├── robots.txt          Istruzioni per i motori di ricerca
├── sitemap.xml         Mappa del sito (3 pagine)
├── README.md           Questo file
├── .gitignore
├── css/
│   ├── global.css      Fondazioni: token (colori, tipografia, spazi), reset, utility
│   ├── components.css  Componenti: bottoni, card, quote, campi form
│   └── layout.css      Struttura: header, nav, hero, sezioni, footer, pagine interne
├── js/
│   ├── main.js         Header, menu, reveal, anno footer — tutte le pagine
│   └── form.js         Validazione e invio — solo contatti.html
└── assets/
    ├── img/            Foto attuali: dal media del cliente (Wix). Da sostituire col tempo.
    └── icons/
        └── favicon.svg

## Aprire il sito

Doppio click su `index.html`, oppure tasto destro → *Open with Live Server*.
Non esiste una build: i file sono il sito. Deploy su qualunque hosting statico
(Netlify, GitHub Pages, Vercel o il classico FTP): si carica la cartella così com'è.

## Da personalizzare

### TODO(client) — contenuti, in questo ordine
1. **contatti.html** — email reale (2 posti: `action` del form + recapiti),
   telefono, sede. Il JSON-LD in `<head>` va tenuto sincronizzato.
2. **team.html** — nomi, ruoli, bio del team vero; foto: scambiare `div.member__mono`
   con `figure.figure--portrait` (stesso aspect-ratio, griglia invariata).
3. **Footer** — parte legale: © e eventuale P.IVA.
4. **Foto** — sostituirle in `assets/img` con gli stessi nomi: zero modifiche HTML.
   Se cambiano misure: aggiornare `width`/`height` negli `img`.

### TODO(live) — al lancio, un solo gesto
Find & replace di `https://aura-hospitality.com` (dominio segnaposto) con il dominio
reale, in: `robots.txt`, `sitemap.xml`, blocco SEO in `<head>` delle 3 pagine.

## Regole del progetto

- **Colori, spazi, tipografia**: solo i token in `:root` (`global.css`). Mai hardcoded.
- **Unità relative ovunque**: `%`, `clamp()`, `em`; breakpoint in `em` (40 · 48 · 56 · 64).
- **Mobile-first**: il base è il telefono; il desktop è un arricchimento.
- **Immagini**: sempre `width`/`height` + classe `figure--*` (aspect-ratio) = CLS 0.
- **Progressive enhancement**: ogni pagina funziona anche senza JavaScript.
- **Nomi**: `blocco__elemento--modificatore`. Ne aggiungi uno? Segui la famiglia.

## Manutenzione

- **Anno footer**: lo aggiorna `main.js`; il valore statico è il fallback senza JS —
  da aggiornare a mano a ogni inizio d'anno.
- **sitemap.xml**: `lastmod` omesso di proposito; aggiungerlo (AAAA-MM-GG) a ogni
  modifica reale di una pagina.

## Prestazioni — e come non perderle

~25 KB di CSS totale, 1 font (2 pesi), 0 dipendenze.
Non aggiungere framework "per fare prima": sarebbe la fine della velocità.