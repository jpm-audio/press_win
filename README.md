# Press & Win!

Amazing minigame created by Jesús Pérez de Miguel <jesus@perezdemiguel.com> as a technical test for Lady Luck Games.

## Comments

### Game States

The game flows with the following states:

- WAITING: Waiting for the game to be loaded.
- LOADING: Loading the game assets.
- READY: Game is ready to be played and symbols are set and ready but "hidden".
- SHOWING_RESULTS: Showing the results of the play after all symbols are revealed.
- REVEASED: All symbols are revealed and game is waiting for the play user action.
- PLAYING: Game is performing the play action and server request.

Initialily the game starts as:
WAITING -> LOADING -> READY

Once READY the flow cycles as:
READY -> SHOWING_RESULTS -> RELEASED -> PLAYING -> READY...

## Run

To play the game in local environment just run

```bash
  npm run dev
```

## Build

To create a new build of the game run

```bash
  npm run build
```
