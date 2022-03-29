"use strict";

const startDate = new Date(2022, 2, 18);
let currentDate = new Date();
let fullDay = 1000 * 60 * 60 * 24;
let word = "слово".toUpperCase();

let letterBoxes = document.getElementsByClassName("gameLetter");
let keyBoxes = document.getElementsByClassName("gameKey")

let letters = [];
let currentWord = [];
let index = 0;

let paused = false;

window.addEventListener("keydown", passKeyPress);
window.onload = assignKeys;

function assignKeys()
{
    for (let i = 0; i < keyBoxes.length; i++)
    {
        keyBoxes[i].addEventListener("click", passButtonPress);
    }
}

function removeKeys()
{
    for (let i = 0; i < keyBoxes.length; i++)
    {
        keyBoxes[i].removeEventListener("click", passButtonPress);
    }
}

function passKeyPress(e)
{
    handleKeyPress(e.key);
}

function passButtonPress(e)
{
    handleKeyPress(e.target.innerHTML);
}

function handleKeyPress(e) 
{
    switch(e) {
        case "Backspace": {
            if (index % 5 > 0 || paused) {
                letterBoxes[--index].innerHTML = "";
                letters.pop();
                letterBoxes[index].classList.toggle("active");
                if (paused) paused = false;
            }
            break;
        }
        case "Enter": {
            document.activeElement.blur();
            if (paused && index % 5 == 0) {
                let checkword = word;
                for (let i = 0; i < 5; i++) {
                    if (letters[i] == word[i]) {
                        letterBoxes[i + index - 5].classList.toggle("correctPlace");
                        let k = checkword.indexOf(letters[i]);
                        checkword = checkword.slice(0, k).concat(checkword.slice(k + 1, 5));
                    }
                }
                for (let i = 0; i < 5; i++) {
                    let j = word.indexOf(letters[i]);
                    let k = checkword.indexOf(letters[i]);
                    if (j >= 0 && k >= 0) {
                        letterBoxes[i + index - 5].classList.toggle("incorrectPlace");
                    }
                    else if (!letterBoxes[i + index - 5].classList.contains("correctPlace")) {
                        letterBoxes[i + index - 5].classList.toggle("incorrectLetter");
                    }
                    if (k >= 0) checkword = checkword.slice(0, k).concat(checkword.slice(k + 1, 5));
                }
                if (word.localeCompare(letters.join("")) == 0) gameOver(true);
                else if (index >= letterBoxes.length)
                    gameOver();
                letters = [];
                paused = false;
            }
            else {
                message("Введите слово полностью!");
            }
            return;
        }
        default: {
            let key = e.toUpperCase();
            if(!paused && key >= 'А' && key <= 'Я' || key == 'Ё') {
                letterBoxes[index].innerHTML = key;
                letters.push(key);
                letterBoxes[index].classList.toggle("active");
                if (++index % 5 == 0)
                    paused = true;
            }
            break;
        }
    }
}

function message(message) {
    document.getElementById("message").style.display = "inline";
    document.getElementById("message").innerHTML = message;
    setTimeout(function() { 
        document.getElementById("message").style.display = "none";
    }, 2000);
}

function gameOver(win = false)
{
    window.removeEventListener("keydown", passKeyPress);
    removeKeys();
    if (win) message("Вы  выиграли!");
    else message("Вы проиграли.");
}