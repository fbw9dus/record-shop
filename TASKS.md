## Was in der App programmiert werden muss

In dieser Datei stehen die Dinge, die bei jedem Schritt der App-Entwicklung programmiert werden müssen. Die Augraben werden in umgekehrter Reihenfolge aufgelistet, also die neuesten Aufgaben ganz oben und die, die schon erledigt sind, darunter.

## Aufgabe 02 - Middleware und CORS
Middleware-Funktionen haben Zugriff auf das Anfrage-Objekt (req), Das Antwort-Objekt (res) und die nächste Middleware-Funktion im Request-Response-Kreislauf der App. Die nächste Middleware-Funktion heißt normalerweise `next`. Es gibt schon einige fertige Middleware-Funktionen, die wir benutzen können, und wir können unsere eigenen machen. Du siehst, dass deine Express-App standardmäßig schon `morgan` und `express.json()` als Middleware benutzt.

Cross-Origin Resource Sharing (CORS) nutzt zusätzliche HTTP-Header damit der Browser einer App einer bestimmten Herkunft den Zugriff auf Ressourcen einer anderen Herkunft erlauben kann. Eine Web-App macht eine cross-origin-HTTP-Anfrage wenn es etwas von einer Adresse anderer Herkunft lädt (Domain, Protokoll oder Port) als der eigenen.

**Aufgaben**:

1. Mach bitte deine eigene Middleware-Funktion, die CORS für jede Anfrage aktiviert. Mach einen `middleware`-Ordner, leg dort deine Middleware-Funktion ab und nutze sie dann in deiner App.


## Aufgabe 01 - Pseudo-Datenbank und Controller

Bei den meisten Web-Applikationen werden Daten manipuliert. Damit unsere Daten manipuliert werden können, müssen zuerst zwei Dinge gemacht werden:

    - Wir müssen die Endpunkte unserer app definieren, über die Nutzer unterschiedliche Anfragen machen können (GET, POST, DELETE, etc).
    - Wir müssen festlegen, wie die Daten strukturiert sein sollen und wir müssen sie irgendwo speichern.

**Konzept**: Unser Kunde ist der Besitzer eines Musikladens, der eine Produktliste auf der Startseite seines Shops haben will. Er will, dass für jeden Artikel im Sortiment, der Titel, der Künstler, das Jahr, das Album-Bild und der Preis angezeigt werden soll. Der Kunde hat aber bisher keine Liste aller Produkte. Er hätte auch gerne die Möglichkeit, neue Artikel zum Sortiment hinzuzufügen.

**Aufgaben**:

1. Mach zwei Endpunkte(Routen) für den Shop-Besitzer

   - `api/records` -> ein `GET`-Endpunkt, der alle Artikel des Shops zurückgibt
   - `api/records` -> ein `POST`-Endpunkt, der einen neuen Artikel zur Liste hinzufügt

   Fürden Anfang können diese Endpunkte einfach Strings zurückgeben, damit man sieht, dass sie funktionieren.

2. Richte eine Pseudo-Datenbank für unsere Artikel ein. Dafür kannst du [lowdb](https://github.com/typicode/lowdb) oder [notarealdb](https://github.com/mirkonasato/notarealdb) benutzen.

   - `api/records` -> Soll alle Artikel zurückgeben, die in der Pseudo-Datenbank sind.
   - `api/records` -> Soll einen neuen Artikel in die Pseudo-Datenbank einfügen.