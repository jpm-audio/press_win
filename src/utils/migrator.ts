export default class Migrator {
  public async migrate(currentVersion: string, storedVersion: string) {
    const gameStateRaw = await window.localStorage.getItem("gameState");

    if (currentVersion === storedVersion) return;

    switch (currentVersion) {
      case "0.1.2":
        if (gameStateRaw) {
          const gameState = JSON.parse(gameStateRaw);
          if (gameState.cards && gameState.cards.tableu) {
            gameState.cards.tableau = gameState.cards.tableu;
            delete gameState.cards.tableu;
            await localStorage.setItem("gameState", JSON.stringify(gameState));
          }
        }
        break;
      case "0.2.1":
        await localStorage.removeItem("gameState");
        await localStorage.removeItem("actions");
        await localStorage.removeItem("gameSettings");
        await localStorage.removeItem("initial-gameState");
        break;
      default:
        break;
    }
  }
}
