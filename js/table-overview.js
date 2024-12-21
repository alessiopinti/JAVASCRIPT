// 1. Voegt een footer toe aan de pagina
const footer = document.createElement("footer");
footer.innerHTML = "Alessio Pinti - Front End";
document.querySelector("body").appendChild(footer);
footer.className = "message";

// 2. Voegt header "My Games" toe aan de pagina
const mainContent = document.querySelector("#main");
const title = document.createElement("h2");
title.textContent = "My Games";
mainContent.appendChild(title);

// 3. Maakt de tabel met <thead> en kolomkoppen
const tableID = document.createElement("table");
tableID.className = "tableID";

// Voegt een caption toe aan de tabel
const caption = document.createElement("caption");
caption.textContent = "All games"; 
tableID.appendChild(caption);

// Code voor tabelkop aan te maken
const thead = document.createElement("thead");
const headerRow = createTableRow();

const headers = ["Name", "Type", "Rating"];
headers.forEach(headerText => {
  const th = document.createElement("th");
  th.textContent = headerText;
  headerRow.appendChild(th);
});

thead.appendChild(headerRow);
tableID.appendChild(thead);
mainContent.appendChild(tableID);

// 4. Maakt element div#status en h3 in die div
const statusDiv = document.createElement("div");
statusDiv.id = "status";

const statusHeading = document.createElement("h3");
statusDiv.appendChild(statusHeading);

mainContent.appendChild(statusDiv);

// Maakt de <tbody> en geef het de ID "my-games-table-body"
const tbody = document.createElement("tbody");
tbody.id = "my-games-table-body";
tableID.appendChild(tbody);

// 5. Voeg de games-array toe
const games = [];

// 6. Functie om games te renderen in de tabel
function renderGames(gamesArray) {
  const filterValue = document.getElementById("filter").value || 0;
  const table = document.querySelector(".tableID");
  const statusDiv = document.getElementById("status");

  clearTableRows({ tableBody: "my-games-table-body" });

  if (gamesArray.length === 0) {
    // Als er geen games zijn, verberg de tabel en toon een foutmelding
    table.classList.add("hidden");
    addStatus('<p class="error">No games available. Please add some games.</p>');
    return;
  }

  // Als er games zijn, laat de tabel zien en verwijder foutmeldingen
  table.classList.remove("hidden");
  statusDiv.innerHTML = ""; // Verwijder foutmeldingen

  gamesArray
    .filter(game => game.rating > filterValue)
    .forEach(game => {
      const row = createTableRow(); // maakt een tabelrij aan

      addTableCell({ // maakt td element aan voor de naam
        tableRow: row,
        value: game.name
      });

      addTableCell({ // maakt td element aan voor de type
        tableRow: row,
        value: game.type 
      });

      addTableCell({ // maakt td element aan voor de rating
        tableRow: row,
        value: game.rating
      });
      
      const deleteButton = document.createElement("button"); // delete knop aanmaken
      deleteButton.textContent = "Delete"; // tekst op knop
      deleteButton.addEventListener("click", () => deleteGame(game)); // roept functie aan bij het klikken
      const deleteCell = document.createElement("td"); // cell aanmaken
      deleteCell.appendChild(deleteButton); // delete knop toevoegen
      row.appendChild(deleteCell);

      addTableRow({ tableBody: tbody, tableRow: row });

      row.addEventListener("dblclick", () => toggleFavourite(game)); // bij dubbelklik roep functie aan

      row.addEventListener("click", () => { // bij het klikken info weergeven bij status
        clearStatus(); 
        const p = document.createElement("p");
        p.textContent = toString(game);
        statusDiv.appendChild(p);
      });
    });
}


// Functie om de game-informatie als string weer te geven
function toString(game) {
  return `Name: ${game.name} - Type: ${game.type} - Rating: ${game.rating} - Favourite: ${game.isFavourite}`;
}

// Voeg een event listener toe aan het filter inputveld voor real-time filtering
document.getElementById("filter").addEventListener("input", () => renderGames(games));

// 7. Voegt een hover-effect toe aan div#status
statusDiv.addEventListener("mouseover", () => {
  statusDiv.setAttribute("style", "background-color: #F00;");
});

statusDiv.addEventListener("mouseout", () => {
  statusDiv.removeAttribute("style");
});

// 8. Voegt een click-effect aan h2
const h2Element = document.querySelector("h2");

const createColor = () => {
  const willekeurig = Math.floor(Math.random() * 360);
  return `hsl(${willekeurig}, 100%, 50%)`;
};

h2Element.addEventListener("click", () => {
  h2Element.style.color = createColor();
});

// 9. Voegt knoppen toe voor het filteren van games
const buttonContainer = document.createElement("div");
buttonContainer.id = "button-container";

const showFavouritesButton = document.createElement("button");
showFavouritesButton.id = "show-favourites";
showFavouritesButton.textContent = "Show my favourite games";
showFavouritesButton.addEventListener("click", () => {
  renderGames(games.filter(game => game.isFavourite));
});

const showAllButton = document.createElement("button");
showAllButton.id = "show-all";
showAllButton.textContent = "Show all games";
showAllButton.addEventListener("click", () => {
  document.getElementById("filter").value = ""; 
  document.getElementById("name").value = ""; 
  fetchAndRenderGames(); 
});

// Voegt de knoppen toe aan de knoppencontainer en voeg deze toe aan de pagina
buttonContainer.appendChild(showFavouritesButton);
buttonContainer.appendChild(showAllButton);
mainContent.insertBefore(buttonContainer, tableID);

// 10. Fetch and Render Games functie
async function fetchAndRenderGames() {
  const server = "http://localhost:3000/games";
  try {
    const response = await fetch(server);

    if (!response.ok) {
      throw new Error("Failed to fetch games from the server.");
    }

    const fetchedGames = await response.json();
    games.length = 0; 
    games.push(...fetchedGames); 
    renderGames(games); 
  } catch (error) {
    console.error("Error fetching games:", error.message);
    document.getElementById("status").innerHTML = '<p class="error">Failed to fetch games from the server. Please try again.</p>';
  }
}


// 11.Voegt een click event listener aan de fetch button om games te zoeken bij naam
document.getElementById("fetchButton").addEventListener("click", () => {
  fetchAndRenderGames();
});

const toggleFavourite = async (game) => {
  
  const response = await fetch(`http://localhost:3000/games/${game.id}/favourite`, {
    method: "POST",
  });

  if (response.ok) {
    const message = game.isFavourite
    document.getElementById("status").textContent = message;

    fetchAndRenderGames();
  } else {
    document.getElementById("status").textContent = "Failed to toggle favourite status.";
  }
};





async function deleteGame(game) {
  const response = await fetch(`http://localhost:3000/games/${game.id}`, {
    method: "DELETE",
  });

  if (response.ok) {
    document.getElementById("status").textContent = `Game "${game.name}" is successfully deleted.`;
    fetchAndRenderGames(); 
  } else {
    document.getElementById("status").textContent = `Failed to delete game "${game.name}".`;
  }
};



fetchAndRenderGames();
