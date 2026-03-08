import { GameManager } from "./game-manager.js";

export class MainMenuManager {
  #mainMenuElement;
  #newGameElement;
  #loadGameElement;

  constructor() {
    this.#mainMenuElement = document.getElementById("game-menu");
    this.#newGameElement = document.getElementById("map-creation");
    this.#loadGameElement = document.getElementById("track-selection");
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
        } else if (button.id === "import-track") {
          document.getElementById("import-file").click();
        }
      });

      this.#loadGameElement.addEventListener("click", (event) => {
        const button = event.target.closest("button");
        if (!button || button.id !== "load-selected-track") return;

        const trackName = document.getElementById("saved-tracks-list").value;
        const savedTracks = this.#getSavedTracks();
        const track = savedTracks.find((t) => t.name === trackName);
        if (!track) return;

        this.#loadGameElement.classList.add("hidden");
        resolve(new GameManager(track.map.length, true, track.map, track.name));
      });

      document
        .getElementById("import-file")
        .addEventListener("change", (event) => {
          this.#importTrack(event, resolve);
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

  #loadTrack(resolve) {
    const savedTracks = this.#getSavedTracks();
    if (savedTracks.length === 0) {
      alert("No saved tracks found.");
      return;
    }

    this.#hideMenu();
    this.#populateTrackList(savedTracks);
    this.#loadGameElement.classList.remove("hidden");
  }

  #populateTrackList(savedTracks) {
    const list = document.getElementById("saved-tracks-list");
    list.innerHTML = "";
    savedTracks.forEach((track) => {
      const option = document.createElement("option");
      option.innerText = track.name;
      list.appendChild(option);
    });
  }

  #importTrack(event, resolve) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const track = JSON.parse(e.target.result);
        this.#hideMenu();
        resolve(new GameManager(track.map.length, true, track.map, track.name));
      } catch {
        alert("Invalid track file.");
      }
    };
    reader.readAsText(file);
  }

  #getSavedTracks() {
    const tracks = localStorage.getItem("savedTracks");
    return JSON.parse(tracks) ?? [];
  }

  #hideMenu() {
    this.#mainMenuElement.classList.add("hidden");
  }
}
