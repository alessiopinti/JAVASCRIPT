const game1 = { name: "Spider Man 2", type: "Actie/Avontuur", rating: 9.0, isFavourite: false };
const game2 = { name: "Hogwart's Legacy", type: "Open World", rating: 8.5, isFavourite: false };
const game3 = { name: "Final Fantasy XIV", type: "MMORPG", rating: 8.7, isFavourite: true };
const game4 = { name: "Resident Evil 4 (Remake)", type: "Horror/Survival", rating: 9.2, isFavourite: true };
const game5 = { name: "Gran Turismo", type: "Car", rating: 6.0, isFavourite: false };
const game6 = { name: "Call of duty: Black Ops 6", type: "Shooter", rating: 10, isFavourite: true };
const game7 = { name: "Astrobot", type: "Car", rating: 9.5, isFavourite: false };

const games = [game1, game2, game3, game4, game5, game6, game7];
const listOfGames = [game3, game5];

const friendGame1 = { name: "Minecraft", type: "Open World", rating: 9.3, isFavourite: true };
const friendGame2 = { name: "Zelda: Breath of the Wild", type: "Adventure", rating: 9.6, isFavourite: true };
const friendGame3 = { name: "Super Mario Odyssey", type: "Platformer", rating: 8.9, isFavourite: false };
const friendGame4 = { name: "Animal Crossing", type: "Simulation", rating: 8.5, isFavourite: false };

const friendGames = [friendGame1, friendGame2, friendGame3, friendGame4]; 

const [first, second] = games;


function toString(game) {
    return `Name: ${game.name} - Type: ${game.type} - Rating: ${game.rating} - isFavourite: ${game.isFavourite}`;
}

function printAllGames(gameArray) {
    gameArray
        .map(toString) 
        .forEach(addStatus); 
}


function getAverageRating() {
    let som = 0;
    games.forEach(game => {
        som += game.rating;
    })
    return som / games.length;
}

function getHighestRating() {
    let highestRatedGame = games[0];
    games.forEach(game => {
        if (game.rating > highestRatedGame.rating) {
            highestRatedGame = game;
        }
    });
    return highestRatedGame;
}

function isFavourite(game) {
    return game.isFavourite === true;
}

function printFavouriteGames() {
    addStatus("<span id='heading'>Favourite Games:</span>");
    games
        .filter(game => isFavourite(game))
        .forEach(game => addStatus(game.name));
}

function printGamesRatingAbove(games, rating) {
    addStatus(`<span id='heading'>These are all games with rating above 3:</span>`);
    games
        .filter(game => game.rating > rating)
        .forEach(game => {
            addStatus(`Name: ${game.name} - Type: ${game.type} - Rating: ${game.rating} - Favourite: ${game.isFavourite}`);
        });
}

function filterAndPrintGames(games, customFilter) {
    games
        .filter(customFilter)
        .forEach(game => {
            addStatus(`Name: ${game.name} - Type: ${game.type} - Rating: ${game.rating} - Favourite: ${game.isFavourite}`);
        });
}

document.addEventListener("DOMContentLoaded", () => {

    addStatus("<span id='heading'>All Games:</span>");
    printAllGames(games);

    addStatus("<span id='heading'>My Games List:</span>");
    printAllGames(listOfGames);

    addStatus("<span id='heading'>Friend's Games:</span>");
    printAllGames(friendGames);

 
    const allGames = [...games, ...friendGames]; 
    addStatus("<span id='heading'>All Games (Mine and Friend's):</span>");
    printAllGames(allGames); 

    printFavouriteGames();

    addStatus("<span id='heading'>Some statistics...</span>");
    addStatus(`Average rating: ${getAverageRating().toFixed(1)}`);
    const highestRatedGame = getHighestRating();
    addStatus(`${highestRatedGame.name} is the game with the highest rating: ${highestRatedGame.rating}`);

    addStatus("<span id='heading'>My first 2 games are:</span>");
    addStatus(first.name);
    addStatus(second.name);

    printGamesRatingAbove(games, 3);

    addStatus("<span id='heading'>These are all the favourite games in the library</span>");
    filterAndPrintGames(games, game => game.isFavourite === true);
    addStatus('<span id="heading">These games have type "Open World"</span>');
    filterAndPrintGames(games, game => game.type.toLowerCase() === "open world");
});

