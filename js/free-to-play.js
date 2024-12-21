const games = [];
const favouriteGames = [];

// Fetch games from the API
async function fetchGames() {
  const url = `https://free-to-play-games-database.p.rapidapi.com/api/games`;
  const options = {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": "c8eed211c3msha5b3caf5be2ceffp1bf2e5jsnaaf28501e45e",
      "X-RapidAPI-Host": "free-to-play-games-database.p.rapidapi.com",
    },
  };

  try {
    const response = await fetch(url, options);
    if (!response.ok) throw new Error("Failed to fetch games");
    const data = await response.json();
    games.push(...data);
    renderGames(games);
  } catch (error) {
    console.error("Error fetching games:", error.message);
    document.getElementById("error-message").textContent = "Error fetching games.";
    document.getElementById("error-message").style.display = "block";
  }
}

// Render games
function renderGames(gamesArray) {
  const grid = document.getElementById("games-grid");
  grid.innerHTML = ""; 

  if (gamesArray.length === 0) {
    grid.innerHTML = "<p>No games found.</p>";
    return;
  }

  gamesArray.forEach((game) => {
    const card = document.createElement("div");
    card.className = "game-card";
    card.innerHTML = `
      <img src="${game.thumbnail}" alt="${game.title}">
      <h2>${game.title}</h2>
      <p><strong>Genre:</strong> ${game.genre}</p>
      <p><strong>Platform:</strong> ${game.platform}</p>
      <p><strong>Release Date:</strong> ${game.release_date}</p>
      <button class="download-btn">Download</button>
      <button class="favourite-btn">${favouriteGames.includes(game) ? "Unfavourite" : "Favourite"}</button>
      <button class="delete-btn">Delete</button>
    `;
    grid.appendChild(card);

    // Download knop
    card.querySelector(".download-btn").addEventListener("click", () => {
      if (game.game_url) {
        window.open(game.game_url, "_blank");
      } else {
        alert("No download URL available.");
      }
    });

    // Favourite knop
    card.querySelector(".favourite-btn").addEventListener("click", () => {
      if (favouriteGames.includes(game)) {
        // Remove from favourites
        const index = favouriteGames.indexOf(game);
        favouriteGames.splice(index, 1);
      } else {
        // Voeg toe aan favorieten
        favouriteGames.push(game);
      }
      renderGames(gamesArray);
    });

    // Delete knop
    card.querySelector(".delete-btn").addEventListener("click", () => {
      const index = favouriteGames.indexOf(game);
      if (index !== -1) {
        favouriteGames.splice(index, 1);
      }
      renderGames(favouriteGames); // Re-render favourites
    });
  });
}

// Zoek games per titel en platform
function searchGames() {
  const titleInput = document.getElementById("game-title").value.trim().toLowerCase();
  const platformInput = document.getElementById("platform").value;

  let filteredGames = games;

  if (titleInput) {
    filteredGames = filteredGames.filter((game) =>
      game.title.toLowerCase().includes(titleInput)
    );
  }

  if (platformInput) {
    filteredGames = filteredGames.filter((game) => game.platform === platformInput);
  }

  renderGames(filteredGames);

  if (filteredGames.length === 0) {
    document.getElementById("error-message").textContent =
      "No games found matching your search.";
    document.getElementById("error-message").style.display = "block";
  } else {
    document.getElementById("error-message").style.display = "none";
  }
}

// Laat alle games zien
function showAllGames() {
  renderGames(games);
}

// Laat favoriete games zien
function showFavouriteGames() {
  renderGames(favouriteGames);

  if (favouriteGames.length === 0) {
    document.getElementById("error-message").textContent =
      "No favourite games to display.";
    document.getElementById("error-message").style.display = "block";
  } else {
    document.getElementById("error-message").style.display = "none";
  }
}

// Event listeners
document.addEventListener("DOMContentLoaded", fetchGames);
document.getElementById("search-button").addEventListener("click", searchGames);
document.getElementById("show-all-button").addEventListener("click", showAllGames);
document.getElementById("show-favourites-button").addEventListener("click", showFavouriteGames);

