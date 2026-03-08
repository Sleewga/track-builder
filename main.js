import { MainMenuManager } from "./main-menu.js";
import { GameManager } from "./game-manager.js";

const mainMenuManager = new MainMenuManager();
const gameManager = await mainMenuManager.handleMenu();
gameManager.start();
