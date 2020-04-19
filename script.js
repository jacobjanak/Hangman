let word, guessed, guessesLeft, hidden;
const words = ["jullyo", "ugly", "stupid"];

endRound()

document.onkeyup = function(e) {
    if (e.keyCode >= 65 && e.keyCode <= 90 && !guessed.includes(e.key)) {
        let index = word.indexOf(e.key);
        if (index >= 0) {
            hidden[index] = e.key;
            while (true) {
                index = word.indexOf(e.key, index + 1);
                if (index >= 0) hidden[index] = e.key;
                else break;
            }
        } else {
            guessesLeft--
            guessed.push(e.key)
        }
        endRound()
    }
}

function endRound() {
    if (hidden && guessed) {
        $('#hidden').text(hidden.join(' '))
        $('#guessed').text(guessed.join(' '))
        $('#left').text(guessesLeft)
    }

    if (!hidden || guessesLeft === 0 || !hidden.includes('_')) {
        if (guessesLeft === 0) {
            alert("You lose. The word was " + word)
        } else if (hidden && !hidden.includes('_')) {
            alert("You win! The word was " + word)
        }

        word = words[Math.floor(Math.random() * words.length)];
        hidden = [];
        guessed = [];
        guessesLeft = 10;

        for (let i = 0; i < word.length; i++) hidden.push("_");

        endRound()
    }
}