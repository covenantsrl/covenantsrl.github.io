# Covenant Site
## Stato

Le homepage italiana (`index.html`) e inglesi (`en/index.html`, `index-en.html`) includono Cyber nel menu e nel footer e una scheda Cybersecurity al posto di Web & Mobile Development. La privacy policy collegata dalla homepage è allineata nel menu e nel footer. Gli snapshot duplicati e i backup sono in `_archivio/`. Le modifiche sono verificate localmente ma non sono state pubblicate.

## Decisioni prese

- Mantenere gli URL delle vecchie pagine ancora pubblicate, come richiesto dall'utente; quindi i relativi file restano alla radice.
- Conservare entrambe le varianti inglesi, perché `/en/` pubblica `en/index.html` e `index-en.html` è raggiungibile direttamente.
- Documentare GitHub Pages come hosting, confermato da DNS e risposta HTTP del sito.

## Questioni aperte

- Verificare in GitHub Settings → Pages la sorgente precisa della pubblicazione (branch o workflow).
- L'accesso SSH non è disponibile; la prova di push HTTPS tramite Portachiavi macOS è riuscita, ma la preparazione del commit richiede la scrittura nell'indice `.git` ed è stata rifiutata. L'utente ha installato il plugin GitHub, che non è ancora visibile tra gli strumenti di questa sessione.
- La pagina `/en/` contiene già un link a `/services/index.html` che non trova un file locale; non è stato modificato per mantenere invariato il sito.

## Prossimi passi

- Rendere disponibile il plugin GitHub nella sessione, oppure autorizzare la scrittura nell'indice `.git`; poi creare il commit e pubblicare le modifiche tramite la sorgente Pages configurata.
- Verificare le homepage online dopo la pubblicazione.
