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
      }
    });

    document
      .getElementById("import-track")
      .addEventListener("change", (event) => {
        this.#importTrack(event);
      });
  }

  #loadSavedTracksOptions() {
    const loadList = document.getElementById("load-list");

    let savedTracks = this.#getSavedTracks();
    loadList.innerHTML = "";
    const documentFrag = document.createDocumentFragment();

    savedTracks.forEach((track) => {
      const option = document.createElement("option");
      option.innerText = track.name;
      documentFrag.appendChild(option);
    });

    loadList.appendChild(documentFrag);
  }

  #getSelectedTrackName() {
    const option = document.getElementById("load-list").value;
    return option;
  }

  #loadTrack(trackName) {
    const savedTracks = this.#getSavedTracks();
    const track = savedTracks.find((t) => t.name === trackName);
    if (!track) return;

    this.#map = track.map.map((row) =>
      row.map((tileType) => {
        const tile = document.createElement("div");
        tile.classList.add("tile", `tile-${tileType}`);
        return tile;
      }),
    );

    this.#trackMapElement.innerHTML = "";
    this.#map.forEach((row) =>
      row.forEach((tile) => this.#trackMapElement.appendChild(tile)),
    );
  }

  #saveTrack() {
    const name = prompt("Enter name:");

    const serializedMap = this.#map.map((row) =>
      row.map((tile) => {
        if (tile.classList.contains("tile-road")) return "road";
        if (tile.classList.contains("tile-water")) return "water";
        return "grass";
      }),
    );

    const newTrack = { name, map: serializedMap };
    let savedTracks = this.#getSavedTracks();
    savedTracks.push(newTrack);
    localStorage.setItem("savedTracks", JSON.stringify(savedTracks));
    this.#loadSavedTracksOptions();
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
    let converted = JSON.parse(tracks);
    if (!converted) {
      converted = [];
    }
    return converted;
  }

  #exportTrack() {
    const serializedMap = this.#map.map((row) =>
      row.map((tile) => {
        if (tile.classList.contains("tile-road")) return "road";
        if (tile.classList.contains("tile-water")) return "water";
        return "grass";
      }),
    );

    const name = prompt("Enter export name:") || "track";
    const data = JSON.stringify({ name, map: serializedMap });
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `${name}.json`;
    a.click();

    URL.revokeObjectURL(url);
  }

  #importTrack(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const track = JSON.parse(e.target.result);

        this.#map = track.map.map((row) =>
          row.map((tileType) => {
            const tile = document.createElement("div");
            tile.classList.add("tile", `tile-${tileType}`);
            return tile;
          }),
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
