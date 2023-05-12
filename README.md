# Avian-Banter

A chat application built with Socket.IO and React. In this application you can enter a username, create or join a room, and chat with other users in rooms.

We have used the following tools in this project:

- React
- Socket.IO
- Mantine
- TypeScript
- MongoDB

Krav för godkänt:

- [x] Användaren får börja med att välja ett eget visningsnamn när den besöker sidan.
- [x] Det ska gå att skapa ett rum (och samtidigt gå med i rummet).
- [x] Det ska gå att lämna ett rum (tomma rum ska automatiskt försvinna).
- [x] Samtliga rum skall vara synligt i en lista.
- [x] De går att gå med i ett rum genom att klicka på det i listan.
- [x] När en användare går med i ett nytt rum ska befintligt rum lämnas automatiskt.
- [x] Användare ska kunna skicka och läsa nya meddelanden i rummet de har gått med i
- [x] När en användare håller på att skriva ett meddelande skall det synas för alla andra i
      rummet.
- [x] Git & GitHub har använts.
- [x] Projektmappen innehåller en README.md fil (läs ovan för mer info).
- [x] Uppgiften lämnas in i tid!

Krav för väl godkänt:

- [x] Alla punkter för godkänt är uppfyllda.
- [ ] Varje rum i listan skall även visa vilka användare som finns i rummet .
- [x] Det ska gå att ha privata konversationer med enskilda användare (DM’s).
- [x] Historik ska sparas för skickade meddelanden och visas när en konversation öppnas
      (gäller både för Rum och för DM’s).
- [x] När sidan laddas om ska användaren behålla sitt användarnamn, läggas tillbaka i
      konversationen som den befann sig i (Rum eller DM) och kunna sina läsa tidigare
      DM’s.

## For developers

To get started, clone the repository and run `npm run setup`. This will install all dependencies.

Once all dependencies have been installed, you can alternatively run `npm run dev` to start the server and client in the same terminal.

If you want to start the server or client in separate terminals, you can use `npm run server` or `npm run client` respectively.

### The Team

- [Emil Helgesson](https://github.com/Emil-Helge)
- [Gabriel Lugo Méndez](https://github.com/gabriel-lugo)
- [Hampus Isebring](https://github.com/Isebring)
