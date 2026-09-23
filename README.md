# Covenant Site

## File del sito

- `index.html`: homepage italiana (`/`).
- `en/index.html`: homepage inglese (`/en/`). `index-en.html` è anche raggiungibile direttamente e va mantenuto allineato.
- `privacy-policy/index.html`, `assets/` e i loghi in `wp-content/uploads/2018/10/` sono usati dalle pagine attuali.
- Le altre pagine nelle cartelle alla radice appartengono al vecchio sito, ma restano pubblicate ai loro URL storici per non interrompere i collegamenti esistenti.
- `_archivio/` contiene copie del vecchio sito, backup e materiali non usati dalle pagine attuali. Non modificare questi file per aggiornare le homepage.

## Pubblicazione

Il dominio `www.covenant.srl` è servito da **GitHub Pages**: il DNS è un CNAME verso `covenantsrl.github.io`, la risposta HTTP riporta `server: GitHub.com` e la homepage pubblica coincide con `index.html` nel repository. Il repository remoto è `git@github.com:covenantsrl/covenantsrl.github.io.git`; il file `CNAME` contiene `www.covenant.srl`.

La configurazione interna di Pages (branch o workflow di origine) non è verificabile senza accesso al repository. Prima del deploy, controllare la sorgente in **Settings → Pages** e pubblicare le modifiche tramite quella sorgente. Il branch locale attuale è `master`.
