export class GameManager {
  #gameElement;
  #trackMapElement;
  #trackMenuElement;
  #size = 10;
  #map = [];
  #isFromSaved = false;

  constructor(size, isFromSaved, map = []) {
    this.#gameElement = document.getElementById("game");
    this.#trackMapElement = document.getElementById("track");
    this.#trackMenuElement = document.getElementById("track-menu");

    this.#size = size;
    this.#isFromSaved = isFromSaved;

    this.#map = map;
  }

  start() {
    this.#gameElement.classList.remove("hidden");
    this.#loadMap();
    this.#tileChangeHandler();

    this.#createLayout();

    this.#loadSavedTracksOptions();
    this.#trackMenuHandler();
  }

  #createLayout() {
    const body = document.querySelector("body");
    body.classList.remove("site-center");
  }

  #trackMenuHandler() {
    this.#trackMenuElement.addEventListener("click", () => {
      const button = event.target.closest("button");
      if (!button) return;

      if (button.id === "save-track") {
        this.#saveTrack();
      } else if (button.id === "load-track") {
      }
    });
  }

  #loadSavedTracksOptions() {
    const loadList = document.getElementById("load-list");

    let savedTracks = this.#getSavedTracks();
    const documentFrag = document.createDocumentFragment();

    savedTracks.forEach((track) => {
      const option = document.createElement("option");
      option.innerText = track.name;
      documentFrag.appendChild(option);
    });

    loadList.appendChild(documentFrag);
  }

  #loadTrack() {
    const savedTracks = this.#getSavedTracks();
  }

  #saveTrack() {
    if (this.#isFromSaved) {
      this.#getSavedTracks();
    } else {
      const name = prompt("Enter name:");
      const newTrack = {
        name: name,
        map: this.#map,
      };

      let savedTracks = this.#getSavedTracks();
      if (!savedTracks) {
        savedTracks = [];
      }
      savedTracks.push(newTrack);
      localStorage.setItem("savedTracks", JSON.stringify(savedTracks));
    }
  }

  #loadMap() {
    if (!this.#isFromSaved) {
      this.#createMap();
    } else {
    }

    this.#trackMapElement.style.gridTemplateColumns = `repeat(${this.#size}, 2rem)`;

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

  #getSavedTrack(name) {
    const savedTracks = this.#getSavedTracks();
    savedTracks.forEach((track) => {
      if (track.name === name) {
        return track.map;
      }
    });
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

  #getSavedTracks() {
    const tracks = localStorage.getItem("savedTracks");
    return JSON.parse(tracks);
  }
}
