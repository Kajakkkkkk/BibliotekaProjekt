const songsTable = document.querySelector(".songs tbody");
let data = [];

function createTableRow(song) {
  const row = document.createElement("tr");
  row.innerHTML = `
      <td>${song.title}</td>
      <td>${song.artists}</td>
      <td>${song.genre}</td>
      <td>${song.bpm}</td>
      <td>${song.duration}</td>
      <td><button class="favorite-button" data-id="${song.id}">&#10084;</button></td>
    `;
  return row;
}

function toggleFavorite(id) {
  const song = data.find(song => song.id === id);
  if (song) {
    song.favorite = !song.favorite;
  }
  applyFilters();
}

function showFavorites() {
  const favoriteSongs = data.filter(song => song.favorite);
  songsTable.innerHTML = "";
  favoriteSongs.forEach(song => {
    const row = createTableRow(song);
    songsTable.appendChild(row);
  });
}

async function fetchAndDisplaySongs() {
  try {
    const response = await fetch(
      "https://gist.githubusercontent.com/techniadrian/c39f844edbacee0439bfeb107227325b/raw/81eec7847b1b3dfa1c7031586405c93e9a9c1a2d/songs.json"
    );
    data = await response.json();
    songsTable.innerHTML = "";
    data.forEach(song => {
      const row = createTableRow(song);
      songsTable.appendChild(row);
    });

    const favoriteButtons = document.querySelectorAll(".favorite-button");
    favoriteButtons.forEach(button => {
      button.addEventListener("click", () => {
        const songId = button.getAttribute("data-id");
        toggleFavorite(songId);
      });
    });
  } catch (error) {
    console.error("Błąd", error);
  }
}

document.getElementById("showTable").addEventListener("click", () => {
  document.getElementById("menu").style.display = "none";
  document.getElementById("filters").classList.remove("hidden");
  document.querySelector(".songs").classList.remove("hidden");
  document.getElementById("fetchSongs").classList.remove("hidden");
  document.getElementById("sortSongs1").classList.remove("hidden");
  document.getElementById("sortSongs2").classList.remove("hidden");
  document.getElementById("showFavorites").classList.remove("hidden");
  document.getElementById("sortTitles").classList.remove("hidden");
});

document
  .getElementById("fetchSongs")
  .addEventListener("click", fetchAndDisplaySongs);

document.getElementById("sortSongs1").addEventListener("click", () => {
  data.sort((a, b) => b.duration - a.duration);
  displaySortedData();
});

document.getElementById("sortSongs2").addEventListener("click", () => {
  data.sort((a, b) => a.duration - b.duration);
  displaySortedData();
});

document
  .getElementById("showFavorites")
  .addEventListener("click", showFavorites);

const genreSelect = document.getElementById("genre-select");
const bpmSelect = document.getElementById("bpm-select");
const searchInput = document.getElementById("search-input");

document.getElementById("sortTitles").addEventListener("click", () => {
  data.sort((a, b) => a.title.localeCompare(b.title));
  displaySortedData();
});

genreSelect.addEventListener("change", () => {
  applyFilters();
});

bpmSelect.addEventListener("change", () => {
  applyFilters();
});

searchInput.addEventListener("input", () => {
  applyFilters();
});

function handleEnter(event) {
  if (event.key === "Enter") {
    applyFilters();
  }
}

function displaySortedData() {
  songsTable.innerHTML = "";
  data.forEach(song => {
    const row = createTableRow(song);
    songsTable.appendChild(row);
  });
}

function applyFilters() {
  const selectedGenre = genreSelect.value;
  const selectedBPM = bpmSelect.value;
  const searchPhrase = searchInput.value.toLowerCase();

  const filteredData = data.filter(song => {
    if (selectedGenre !== "Wszystkie" && song.genre !== selectedGenre) {
      return false;
    }
    if (selectedBPM === "Slow" && song.bpm >= 110) {
      return false;
    }
    if (selectedBPM === "Medium" && (song.bpm < 110 || song.bpm > 130)) {
      return false;
    }
    if (selectedBPM === "Fast" && song.bpm <= 130) {
      return false;
    }
    if (
      searchPhrase &&
      (song.title.toLowerCase().includes(searchPhrase) ||
        song.artists.toLowerCase().includes(searchPhrase))
    ) {
      return true;
    }
    return true;
  });

  filteredData.sort((a, b) => a.title.localeCompare(b.title));

  songsTable.innerHTML = "";
  filteredData.forEach(song => {
    const row = createTableRow(song);
    songsTable.appendChild(row);
  });
}
