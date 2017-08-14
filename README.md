# A Game
> The Game

## How to start
```
$ npm install
$ npm start
```

## How to test
```
$ npm test
```

## How to build, running lint, docs everything
```
$ npm run all
```

## How to play
> You need three process. 1 as server. And other 2 as clients.

### At server
```
$ npm start
```
### At client
```
$ npm run client
```

* CLI based game. CLI will guide you what to do when.
* Both users need to register
* The first user will select the game and hence create a room
* there is by default one game, named `guess`. You are free to create more games, similar with `Guess` class methods. If created those games will also be listed.
* Number of default players configurable from config.
* The first user's client will wait untill other players join
* when all join, server will notify all users that question will be asked in 5 seconds
* Question will be to pick a number from 1 to 26.
* Whoever the first user guess the right number wins
* user have unlimited number of tries. If user does not guess right number, his score will be minus by absolute diff.
* Upon timeout 15 seconds, Otherwise the user who has the highest score will win.

## json2server
> [Read more about JSON 2 Server](https://github.com/codeofnode/json2server)

## License
MIT © [Ramesh Kumar](codeofnode-at-the-rate-gmail-dot-com)
