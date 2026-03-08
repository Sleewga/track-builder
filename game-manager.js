export class GameManager {
  #gameElement;
  #trackMapElement;
  #trackMenuElement;
  #size = 10;
  #map = [];
  #isFromSaved = false;
  #trackName;

  constructor(size, isFromSaved, map = [], trackName = "") {
    this.#gameElement = document.getElementById("game");
    this.#trackMapElement = document.getElementById("track");
    this.#trackMenuElement = document.getElementById("track-menu");

    this.#size = size;
    this.#isFromSaved = isFromSaved;
    this.#map = map;
    this.#trackName = trackName;
  }

  start() {
    this.#gameElement.classList.remove("hidden");
    this.#loadMap();
    this.#tileChangeHandler();
    this.#createLayout();
    this.#loadSavedTracksOptions();
    this.#trackMenuHandler();

    document
      .getElementById("import-file-ingame")
      .addEventListener("change", (event) => {
        this.#importTrack(event);
      });
  }

  #createLayout() {
    document.querySelector("body").classList.remove("site-center");
  }

  #trackMenuHandler() {
    this.#trackMenuElement.addEventListener("click", (event) => {
      const button = event.target.closest("button");
      if (!button) return;

      if (button.id === "save-track") {
        this.#saveTrack();
      } else if (button.id === "load-track") {
        const trackName = this.#getSelectedTrackName();
        this.#loadTrack(trackName);
      } else if (button.id === "export-track") {
        this.#exportTrack();
      } else if (button.id === "import-track-ingame") {
        document.getElementById("import-file-ingame").click();
      }
    });
  }

  #getTileType(tile) {
    if (tile.classList.contains("tile-road")) return "road";
    if (tile.classList.contains("tile-water")) return "water";
    return "grass";
  }

  #createTileElement(tileType) {
    const tile = document.createElement("div");
    tile.classList.add("tile", `tile-${tileType}`);
    return tile;
  }

  #exportTrack() {
    const name = prompt("Enter export name:") || "track";

    const serializedMap = this.#map.map((row) =>
      row.map((tile) => this.#getTileType(tile)),
    );
    const data = JSON.stringify({ name, map: serializedMap });

    const a = document.createElement("a");
    a.href = "data:application/json," + encodeURIComponent(data);
    a.download = `${name}.json`;
    a.click();
  }

  #loadSavedTracksOptions() {
    const loadList = document.getElementById("load-list");
    const savedTracks = this.#getSavedTracks();
    loadList.innerHTML = "";
    const fragment = document.createDocumentFragment();
    savedTracks.forEach((track) => {
      const option = document.createElement("option");
      option.innerText = track.name;
      fragment.appendChild(option);
    });
    loadList.appendChild(fragment);
  }

  #getSelectedTrackName() {
    return document.getElementById("load-list").value;
  }

  #loadTrack(trackName) {
    const savedTracks = this.#getSavedTracks();
    const track = savedTracks.find((t) => t.name === trackName);
    if (!track) return;

    this.#map = track.map.map((row) =>
      row.map((tileType) => this.#createTileElement(tileType)),
    );

    this.#trackMapElement.innerHTML = "";
    this.#trackMapElement.style.gridTemplateColumns = `repeat(${track.map[0].length}, 2rem)`;
    this.#map.forEach((row) =>
      row.forEach((tile) => this.#trackMapElement.appendChild(tile)),
    );
  }

  #saveTrack() {
    const name = prompt("Enter name:");
    if (!name) return;

    const serializedMap = this.#map.map((row) =>
      row.map((tile) => this.#getTileType(tile)),
    );
    const newTrack = { name, map: serializedMap };

    const savedTracks = this.#getSavedTracks();
    savedTracks.push(newTrack);
    localStorage.setItem("savedTracks", JSON.stringify(savedTracks));
    this.#loadSavedTracksOptions();
  }

  #loadMap() {
    if (!this.#isFromSaved) {
      this.#createMap();
    } else {
      this.#map = this.#map.map((row) =>
        row.map((tileType) => this.#createTileElement(tileType)),
      );
    }

    this.#trackMapElement.style.gridTemplateColumns = `repeat(${this.#size}, 2rem)`;
    this.#map.forEach((row) =>
      row.forEach((tile) => this.#trackMapElement.appendChild(tile)),
    );
  }

  #createMap() {
    this.#map = Array.from({ length: this.#size }, () =>
      Array.from({ length: this.#size }, () =>
        this.#createTileElement("grass"),
      ),
    );
  }

  #tileChangeHandler() {
    this.#trackMapElement.addEventListener("click", (event) => {
      const tile = event.target;
      if (tile.classList.contains("tile-grass")) {
        tile.classList.replace("tile-grass", "tile-road");
      } else if (tile.classList.contains("tile-road")) {
        tile.classList.replace("tile-road", "tile-water");
      } else if (tile.classList.contains("tile-water")) {
        tile.classList.replace("tile-water", "tile-grass");
      }
    });
  }

  #getSavedTracks() {
    const tracks = localStorage.getItem("savedTracks");
    return JSON.parse(tracks) ?? [];
  }

  #importTrack(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const track = JSON.parse(e.target.result);

        this.#map = track.map.map((row) =>
          row.map((tileType) => this.#createTileElement(tileType)),
        );

        this.#trackMapElement.innerHTML = "";
        this.#trackMapElement.style.gridTemplateColumns = `repeat(${track.map[0].length}, 2rem)`;
        this.#map.forEach((row) =>
          row.forEach((tile) => this.#trackMapElement.appendChild(tile)),
        );

        event.target.value = "";
      } catch {
        alert("Invalid track file.");
      }
    };
    reader.readAsText(file);
  }
}
