## Was in der App programmiert werden muss

In dieser Datei stehen die Dinge, die bei jedem Schritt der App-Entwicklung programmiert werden müssen. Die Augraben werden in umgekehrter Reihenfolge aufgelistet, also die neuesten Aufgaben ganz oben und die, die schon erledigt sind, darunter.

## Aufgabe 08 - Authentifizierung

Unsere App kann man schon gut benutzen aber sie ist bisher überhaupt nicht sicher. Jeder kann ein fremdes Nutzer-Konto löschen wenn er die ID kennt. Die Passwörter sind nicht verschlüsselt, so dass sie leicht in falsche Hände geraten können. Es wird nirgendwo geprüft, ob man eingeloggt ist.
Wir werden mit JSON Web Tokens eine Berechtigungsprüfung für jede Anfrage programmieren, damit Daten nur von den Benutzern verwalten können, die sie erstellt haben. Wir werden außerdem Rollen für Benutzer hinzufügen. Wir brauchen eine Admin-Rolle und eine Kunde-Rolle und ihre Berechtigungen sollten so sein:

**Admin Role**

- Records
  - POST/GET/PUT/DELETE.
- Users
  - POST/GET/PUT/DELETE.
- Orders
  - POST/GET/PUT/DELETE.

**Client Role**

- Records
  - GET.
- Users
  - POST/GET/PUT/DELETE.
- Orders
  - POST/GET/PUT/DELETE.

**Aufgaben**

1. Füg im `users`-Router die POST-Route `/login` hinzu und mach einen Controller, in dem das gesendete Passwort geprüft wird.
2. Wenn ein neuer User erstellt wird oder sich einloggt, soll für diesen ein Authentifizierungs-Token erzeugt werden.
3. Schreib eine Middleware, die die Berechtigung für alle Endpunkte unserer App mit dem Token prüft, so dass Operationen nur von berechtigten Benutzern(wie oben aufgelistet) durchgeführt werden können.
4. Wenn ein neuer User erstellt wird oder die Userdaten aktualisiert werden, wandle das Passwort in einen Verschlüsselungs-Hash um und speichere es in dieser Form in der Datenbank.
5. Schreib eine Middleware, die feststellt, ob ein Benutzer die Admin-Rolle hat.

## Aufgabe 07 - Verknüpfungen

MongoDB ist eine NoSQL-Datenbank, das heißt, es ist nicht-relational - unter anderem. Um Zusammenhänge zwischen Documents abzubilden, nutzen wir references mit IDs oder betten Sub-Dokumente direkt ein. In diesem Schritt, werden wir unseren Code anpassen um Verknüpfungen(relations) zwischen unseren Models herzustellen. Wie man sieht, hat eine Bestellung(Order) die ID einer Platte(record), aber wenn wir eine Bestellung aufrufen, sehen wir nur die ID aber keine Informationen über die Platte. Wir fügen eins-zu-eins- und eins-zu-mehrere-Verknüpfungen zu unseren Models hinzu und rufen die entsprechenden Daten ab, wenn nötig.

**Konzept**: Unser Kunde - der Plattenladen - will die Adressen aller Kunden in einem bestimmten Format haben. Er will auch die Infos der Platte angezeigt bekommen, wenn eine Bestellung aufgerufen wird, so dass der Einkaufswagen gut aussieht.

**Aufgaben**

1. Mach ein neues Schema `address` mit den Feldern `street` und `city`.
2. Verbinde das `address`-Schema mit unserem `user`-Schema (1-to-1).
3. Mit Hilfe von `refs`, verknüpfe das `record`-Schema mit dem `order`-Schema (1-to-many).
4. Unter `/orders` und `/orders/:id` soll Record der Bestellungen ohne `price` und `year` ausgegeben werden.
5. Ändere die Users-Controller so, dass das Passwort nie in der Antwort(response) mitgesendet wird.
6. Unter `/users` sollen maximal 5 Benutzer ausgegeben werden.
7. Die Benutzer sollen nach `lastName` sortiert ausgegeben werden.

## Aufgabe 06 - Validation und Sanitization

In diesem Schritt werden wir Daten-Validierung hinzufügen. Wie können wir feststellen, dass das Format der E-Mail-Adresse, die der Nutzer eingegeben hat, richtig ist? Wir werden mit `express-validator` die Daten überprüfen, bevor wir sie in die Datenbank speichern. Wenn etwas nicht valide ist, schicken wir eine detaillierte Fehlermeldung an den Benutzer. Nach der Validierung, werden wir die Daten bereinigen(Satitization), und zwar auch mit `express-validator`.
Bei Validierung stellen wir sicher, dass die Daten das richtige Format haben. Bei Bereinigung(Sanitization) geht es darum, Störfaktoren aus den Daten zu entfernen, wie unnötige Leerzeichen, falsche Groß- und Kleinschreibung usw.

**Aufgaben**

1. Installiere `express-validator`.
2. Validiere die Daten für das User-Schema. Es soll geprüft werden, ob die Email valide ist, das Passwort mindestens zehn zeichen hat und der Vorname nicht leer ist.
3. Richte nach der Validierung, auch eine Bereinigung der Daten ein. Bei `email` sollen die Email-spezifischen Bereinigungen von `express-validator` angewendet werden. Bei `firstName` sollen überschüssige Leerzeichen am Anfang und am Ende entfert werden.
4. Schreib eine Middleware in `middleware/validator.js`, die das Ergebnis einer Validierung (validationResult) annehmen und eine Fehlermeldung als Antwort schicken kann. Die Middleware-Funktion soll als `validateInputs` exportiert werden. Benutze die Middleware in der `post`-Route des `users`-Routers.

## Aufgabe 05 - Mongoose und Controller

In diesem Schritt werden wir die Controller in der App so anpassen, dass sie mit der Datenbank kommunizieren. Wir brauchen die Pseudo-Datenbank (`notarealdb`) nicht mehr, deshalb können wir sie entfernen. Wir werden uns mit der Mongoose-API beschäftigen und über die Methoden lernen, über die man mit der Datenbank kommuniziert. Wir werden mit Mongoose Daten aus der Datenbank holen, Daten speichern und schon gespeicherte Daten aktualisieren.

**Aufgaben**:

1. Schreib die Controller so um, dass sie Mongoose benutzen um die Daten mit der Datenbank zu synchronisieren.
2. Alle API-Endpunkte für `records` sollen funktionieren wie gedacht.
3. Mach diese Änderungen und die Tests auch für die Controller für `users` und `orders` 

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
