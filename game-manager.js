export class GameManager {
  #gameElement;
  #trackMapElement;
  #size = 10;
  #map = [];

  constructor(size, map = []) {
    this.#gameElement = document.getElementById("game");
    this.#trackMapElement = document.getElementById("track");
    this.#size = size;
    this.#map = map;
  }

  start() {
    this.#gameElement.classList.remove("hidden");
    this.#loadMap();
    this.#tileChangeHandler();
  }

  #loadMap() {
    if (!this.#map.length) {
      this.#createMap();
    }

    this.#trackMapElement.style.gridTemplateColumns = `repeat(${this.#size}, 1fr)`;

    this.#map.forEach((row) => {
      row.forEach((tile) => {
        this.#trackMapElement.appendChild(tile);
      });
    });
  }

  #createMap() {
    this.#map = Array.from({ length: this.#size }, () =>
      Array.from({ length: this.#size }, () => {
        const tile = document.createElement("div");
        tile.classList.add("tile");
        tile.classList.add("tile-grass");
        return tile;
      }),
    );
  }

  #tileChangeHandler() {
    this.#trackMapElement.addEventListener("click", () => {
      const tile = event.target;
      if (tile.classList.contains("tile-grass")) {
        tile.classList.remove("tile-grass");
        tile.classList.add("tile-road");
      } else if (tile.classList.contains("tile-road")) {
        tile.classList.remove("tile-road");
        tile.classList.add("tile-water");
      } else if (tile.classList.contains("tile-water")) {
        tile.classList.remove("tile-water");
        tile.classList.add("tile-grass");
      }
    });
  }
}
