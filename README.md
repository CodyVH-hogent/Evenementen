# Examenopdracht Web Services

- Student: Cody Van Hauwermeiren
- Studentennummer: 202293731
- E-mailadres: <mailto:cody.vanhauwermeiren@student.hogent.be>

## Vereisten

Ik verwacht dat volgende software reeds geïnstalleerd is:

- [NodeJS v20.6 or higher](https://nodejs.org/)
- [Yarn](https://yarnpkg.com/)
- [MySQL v8](https://dev.mysql.com/downloads/windows/installer/8.0.html)
- [MySQL Workbench](https://dev.mysql.com/downloads/workbench/)

## Opstarten

Maak een `.env` bestand aan met volgende informatie(verander uiteraard naar eigen credentials):

```
NODE_ENV=development
DATABASE_URL="mysql://root:root@localhost:3306/events"
```

Voer vervolgens `yarn install` uit zodat alle packages kunnen geïnstalleerd worden.
Wanneer dit gebeurt is kan je via `yarn start` de server opstarten

## Testen

Maak een `.env.test` bestand aan met volgende informatie(verander uiteraard naar eigen credentials):

```
NODE_ENV=development
DATABASE_URL="mysql://root:root@localhost:3306/events_test"
```

Voer vervolgens `yarn test` of `yarn test --coverage` om de test te runnen. Het eerste commando runt de testen gewoon,
maar het tweede toont je ook welke lijntjes je nog moet testen bv.([jest-coverge-docs](https://jestjs.io/blog/2020/01/21/jest-25#v8-code-coverage)) 
