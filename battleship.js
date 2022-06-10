let view = {
    displayMessage : function(msg) {
        
        let messageArea = document.getElementById('messageArea');
        messageArea.innerHTML = msg;

    },

    displayHit: function(location) {

        let cell = document.getElementById(location);
        cell.setAttribute('class', 'hit')

    },

    displayMiss: function(location) {

        let cell = document.getElementById(location);
        cell.setAttribute('class', 'miss')

    }
};


let model = {
    boardSize: 7,
    numShips: 3,
    shipsSunk: 0,
    shipLength: 3,

    ships: [
		{ locations: ["", "", ""], hits: ["", "", ""] },
		{ locations: ["", "", ""], hits: ["", "", ""] },
		{ locations: ["", "", ""], hits: ["", "", ""] }],

    fire: function (guess) {
        for(let i=0; i<this.numShips; i++) {

            let ship = this.ships[i];
            let index = ship.locations.indexOf(guess)
            if (index >= 0) {
                ship.hits[index] = 'hit';
                view.displayHit(guess)
                view.displayMessage('HIT!');
                if (this.isSunk(ship)) {
                    view.displayMessage('You sank my battleShip!')
                    this.shipsSunk++;
                }
                return true
            }
        }
        view.displayMiss(guess);
        view.displayMessage('You have missed');
        return false
    },

    isSunk: function (ship) {
        for (let i=0; i<this.numShips; i++) {
            if (ship.hits[i]!= 'hit') {
                return false
            }
        }

        return true;
    },

    generateShipLocations: function() {
        let locations;
        for (let i=0; i <this.numShips; i++) {
            do {
                locations=this.generateShip();
            } while (this.collision(locations));
            this.ships[i].locations = locations;
        }
    },

    generateShip: function(){
        let direction = Math.floor(Math.random() * 2);
        let row, col;

        if (direction === 1) {
            row = Math.floor(Math.random() * this.boardSize);
            col = Math.floor(Math.random() * (this.boardSize -this.shipLength));
        } else {
            row = Math.floor(Math.random() * (this.boardSize -this.shipLength));
            col = Math.floor(Math.random() * this.boardSize);
        }

        let newShipLocations = [];
        for (let i=0; i<this.shipLength; i++) {
            if (direction === 1) {
                newShipLocations.push(row + '' + (col + i));
            } else {
                newShipLocations.push((row + i) + '' + col);
            }
        }
        return newShipLocations;
    },

    collision: function(locations) {
        for (let i=0; i < this.numShips; i++) {
            let ship = model.ships[i];
            for (let j = 0; j<locations.length; j++){
                if (ship.locations.indexOf(locations[j]) >= 0) {
                    return true
                }
            }
        }
        return false;
    }

}

// Проверка данных

function parseGuess(guess) {
	let alphabet = ["A", "B", "C", "D", "E", "F", "G"];

	if (guess === null || guess.length !== 2) {
		alert("Oops, please enter a letter and a number on the board.");
	} else {
		let row = alphabet.indexOf(guess.charAt(0));
		let column = guess.charAt(1);
		
		if (isNaN(row) || isNaN(column)) {
			alert("Oops, that isn't on the board.");
		} else if (row < 0 || row >= model.boardSize ||
		           column < 0 || column >= model.boardSize) {
			alert("Oops, that's off the board!");
		} else {
			return row + column;
		}
	}
	return null;
}

// Реализация контроллера

let controller = {
    guesses: 0,

    processGuess: function(guess) {

        let location = parseGuess(guess);
        if (location) {
            this.guesses++;
            let hit = model.fire(location);
            if (hit && model.shipsSunk === model.numShips) {
                view.displayMessage('You sank all my battleShips, in ' + this.guesses +' guesses');
            }
        }
    }
}

// кнопка открыть огонь

function handleFireButton () {

    let guessInput = document.getElementById('guessInput');
    let guess = guessInput.value;
    controller.processGuess(guess);

    guessInput.value = '';

};

function handleKeyPress (e) {
    let fireButton = document.getElementById('fireButton');
    if (e.keyCode === 13) {
        fireButton.click();
        return false;
    }
}

function init () {
    let fireButton = document.getElementById('fireButton');
    fireButton.onclick = handleFireButton;

    let guessInput = document.getElementById('guessInput');
    guessInput.onkeydown = handleKeyPress;

    model.generateShipLocations();
};

window.onload = init;

//test contoller
/*
controller.processGuess('A0');

controller.processGuess('A6');
controller.processGuess('B6');
controller.processGuess('C6');

controller.processGuess('C4');
controller.processGuess('D4');
controller.processGuess('E4');

controller.processGuess('B0');
controller.processGuess('B1');
controller.processGuess('B2');
*/