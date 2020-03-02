## Was in der App programmiert werden muss

In dieser Datei stehen die Dinge, die bei jedem Schritt der App-Entwicklung programmiert werden müssen. Die Augraben werden in umgekehrter Reihenfolge aufgelistet, also die neuesten Aufgaben ganz oben und die, die schon erledigt sind, darunter.

## Aufgabe 01 - Pseudo-Datenbank und Controller

Bei den meisten Web-Applikationen werden Daten manipuliert. Damit unsere Daten manipuliert werden können, müssen zuerst zwei Dinge gemacht werden:

    - Wir müssen die Endpunkte unserer app definieren, über die Nutzer unterschiedliche Anfragen machen können (GET, POST, DELETE, etc).
    - Wir müssen festlegen, wie die Daten strukturiert sein sollen und wir müssen sie irgendwo speichern.

**Konzept**: Unser Kunde ist der Besitzer eines Musikladens, der eine Produktliste auf der Startseite seines Shops haben will. Er will, dass für jeden Artikel im Sortiment, der Titel, der Künstler, das Jahr, das Album-Bild und der Preis angezeigt werden soll. Der Kunde hat aber bisher keine Liste aller Produkte. Er hätte auch gerne die Möglichkeit, neue Artikel zum Sortiment hinzuzufügen.

**Aufgaben**:

1. Mach zwei Endpunkte(Routen) für den Shop-Besitzer

   - `api/records` -> ein `GET`-Endpunkt, der alle Artikel des Shops zurückgibt
   - `api/records` -> ein `POST`-Endpunkt, der einen neuen Artikel zur Liste hinzufügt

   For now you can just return a string from the above endpoints, just to make sure everything works. 

2. Using `lowdb` set up a mock database for our records. It can be empty or it can contain already some fake data. Update the routes above so that they work just like they should.

   - `api/records` -> should return all the records that are in our lowdb database
   - `api/records` -> should add a new record to our lowdb database
