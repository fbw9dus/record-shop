## Was in der App programmiert werden muss

In dieser Datei stehen die Dinge, die bei jedem Schritt der App-Entwicklung programmiert werden müssen. Die Augraben werden in umgekehrter Reihenfolge aufgelistet, also die neuesten Aufgaben ganz oben und die, die schon erledigt sind, darunter.

## Aufgabe 04 - Mongoose und Seeding

In diesem Schritt des Projekts führen wir Mongoose ein. Mongoose ist eine Object Data Modeling (ODM)-Bibliothek für MongoDB und Node.js. Sie regelt Verknüpfungen zwischen Daten, ermöglicht Validierung und macht die Umwandlung zwischen Objekten im Code und deren Entsprechung in MongoDB.
Wir werden eigene Models und Schema erstellen und genau definieren, wie record-, user- und order-Objekte aufgebaut sein sollen.
Der nächste Schritt wird sein, eine Feed-Funktion zu schreiben, die Beispiel-Daten in die Datenbank schreibt, damit wir alle Endpunkte der API direkt nach dem Starten des Servers testen können.

**Aufgaben**:

1. Installiere Mongoose in deinem Projekt.
2. Schreib Schemas und Models für die Shop-Artikel(records), Kunden(users) und Bestellungen(orders).
3. Schreib ein Seed-Skript, das faker nutzt. Das Skript soll jedes mal am Anfang laufen, wenn dein Server gestartet wird. Es soll prüfen ob die Datenbank leer ist und in dem Fall Beispieldaten für records, users und orders zum Testen in die Datenbank schreiben.

## Aufgabe 03 - Routing und error handling
Wie wir in der ersten Aufgabe gesehen haben, gibt es Anfragen wie `GET` und `POST`, die die Funktionalität jedes Endpunkts definieren. Jetzt fügen wir `PUT` und `DELETE` hinzu.
  
  - `PUT` wird einen existirenden Eintrag aktualisieren
  - `DELETE` wird einen existierenden Eintrag löschen

Nachdem wir diese Anfragen zu unserem Musikladen hinzugefügt haben, müssen wir error handling hinzufügen. Was passiert, wenn bei einer Anfrage etwas schief geht? Wir müssen dem Nutzer mitteilen, was schief gelaufen ist. Dafür können wir Middleware-Funktionen schreiben, die mit Fehlern umgehen.


**Konzept**: Unser Kunde, der Musikladen-Besitzer, will die Möglichkeit haben, Artikel des Ladens zu ändern und zu löschen. Außer Artikel, will der Kunde noch zwei andere Datentypen verwalten: Kunden und Bestellungen.


**Aufgaben**:

1. Mach drei neue Endpunkte (Routen) für records

   - `records/:id` -> `GET`, das einen Artikel mit einer bestimmten `id` zurückgibt
   - `records/:id` -> `PUT`, das Änderungen an einem Artikel mit bestimmter `id` macht
   - `records/:id` -> `DELETE`, das einen Artikel mit einer `id` löscht

2. Mach Endpunkte für `users` und `orders`. Kunden(users) sollen diese Infos haben: first name, last name, email, password. Bestellungen(orders) sollen diese Infos haben: record id und quantity. Später fügen wir weitere Infos hinzu.

      Users Model
      - `users` -> `GET` all users
      - `users/:id` -> `GET` a user
      - `users` -> `POST` a user
      - `users/:id` -> `PUT` a user
      - `users/:id` -> `DELETE` a user

      Orders Model
      - `orders` -> `GET` all orders
      - `orders/:id` -> `GET` an order
      - `orders` -> `POST` an order
      - `orders/:id` -> `PUT` an order
      - `orders/:id` -> `DELETE` an order 

3. Wenn wir all diese Endpunkte getestet haben und die Datenbank korrekt aktualisiert wird, schreib eine Middleware-Funktion, die mit Fehlern bei der Anfrage umgehen kann. Denk daran, dass es in unserem Projekt schon das Standard-Modul `http-errors` gibt.


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
