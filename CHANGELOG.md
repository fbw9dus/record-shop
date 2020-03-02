# Changelog - Änderungsverlauf deines Projekts

Dieser Changelog ist in umgekehrter Reihenfolge sortiert, die neuesten Änderungen stehen also oben und die älteren darunter, so dass man sofort sieht, was als nächstes gemacht werden muss.

## Stage 0(master): Boilerplate

In diesem Branch ist ein Grundaufbau, der so für fast alle Express-Server gebraucht wird, die du machen wirst.
Der Grundaufbau besteht aus:

- Dateien, die vom [`npx express-generator`](https://expressjs.com/en/starter/generator.html) mit den Optionen `--no-view` und `--git` erzeugt wurden, etwas abgeändert und aktualisiert.

### Änderungen an den `express-generator`-Dateien:

- `routes/index.js` und `routes/users.js` nutzen `const`
- `app.js` nutzt `const`. Es wurden Kommentare hinzugefügt um den Code besser lesbar zu machen.
