async function addGame() {
    const name = document.getElementById("name").value.trim();
    const type = document.getElementById("type").value.trim();
    const rating = parseFloat(document.getElementById("rating").value);
  
    if (!name || !type || isNaN(rating)) {
      addStatusError("No empty values allowed for name, type, and rating.");
      return;
    }
  
    if (name.length < 2 || name.length > 64) {
      addStatusError("Game name must be between 2 and 64 characters.");
      return;
    }
  
    if (rating < 0 || rating > 10) {
      addStatusError("Rating must be between 0 and 10.");
      return;
    }
  
    const isUnique = await nameIsUnique(name);
    if (!isUnique) {
      addStatusError(`Game name "${name}" must be unique.`);
      return;
    }
  
    
    try {
      const game = { name, type, rating };
      const response = await fetch("http://localhost:3000/games", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(game),
      });
  
      if (response.ok) {
        document.getElementById("status").textContent = "Game added successfully!";
        document.getElementById("name").value = "";
        document.getElementById("type").value = "";
        document.getElementById("rating").value = ""; 
      } else {
        addStatusError("Failed to add the game. Please try again.");
      }
    } catch (error) {
      addStatusError("Error adding the game. Please try again.");
    }
}
    
async function nameIsUnique(gameName) {
  try {
    const response = await fetch(`http://localhost:3000/games/name/${gameName}`);
    if (!response.ok) {
      throw new Error("Failed to check game name uniqueness.");
    }
    const data = await response.json();
    return data === null; 
  } catch (error) {
    addStatusError("Error checking game name uniqueness. Please try again.");
    return false; 
  }
}
  
  
document.querySelector("#add-game-form").addEventListener("submit", (event) => {
    event.preventDefault();
    addGame();
});


  



