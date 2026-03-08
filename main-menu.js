import { GameManager } from "./game-manager.js";

export class MainMenuManager {
  #mainMenuElement;
  #newGameElement;

  constructor() {
    this.#mainMenuElement = document.getElementById("game-menu");
    this.#newGameElement = document.getElementById("map-creation");
  }

  handleMenu() {
    return new Promise((resolve) => {
      this.#mainMenuElement.addEventListener("click", (event) => {
        const button = event.target.closest("button");
        if (!button) return;

        if (button.id === "new-track") {
          this.#newTrack(resolve);
        } else if (button.id === "load-track") {
          this.#loadTrack(resolve);
        }
      });
    });
  }

  #newTrack(resolve) {
    this.#hideMenu();
    this.#newGameElement.classList.remove("hidden");

    this.#newGameElement.addEventListener("click", (event) => {
      event.preventDefault();
      const button = event.target.closest("button");
      if (!button || button.type !== "submit") return;

      this.#newGameElement.classList.add("hidden");
      const size = document.getElementById("size-selection").value;
      resolve(new GameManager(size, false));
    });
  }

  #loadTrack() {
    this.#hideMenu();
  }

  #hideMenu() {
    this.#mainMenuElement.classList.add("hidden");
  }
}
