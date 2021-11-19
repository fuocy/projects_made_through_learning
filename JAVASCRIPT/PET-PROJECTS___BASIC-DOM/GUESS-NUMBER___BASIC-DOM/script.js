'use strict';

// console.log(document.querySelector('.message').textContent);

// document.querySelector('.message').textContent = ' correct number!';

// // console.log(document.querySelector('.message').textContent);

// document.querySelector('.number').textContent = 13;
// document.querySelector('.score').textContent = 10;
// document.querySelector('.guess').value = 23;
// console.log(document.querySelector('.guess').value);

// VARIABLE
let secretNumber = Math.trunc(Math.random() * 20) + 1;
let score = 20;
let highscore = 0;
// FUNCTION

// FUNCTION 1
const displayMessage = function (message) {
  document.querySelector('.message').textContent = message;
};

// FUNCTION 2
document.querySelector('.check').addEventListener('click', function () {
  const guess = Number(document.querySelector('.guess').value);
  console.log(guess, typeof guess);

  // When there is no input
  if (!guess) {
    displayMessage('⛔ No number');

    // When players win
  } else if (guess === secretNumber) {
    displayMessage('🥇 Correct number');
    document.querySelector('body').style.backgroundColor = '#60b347';
    document.querySelector('.number').style.width = '30rem';
    document.querySelector('.number').textContent = secretNumber;

    if (score > highscore) {
      highscore = score;
      document.querySelector('.highscore').textContent = highscore;
    }

    // When the guess is different
  } else if (guess !== secretNumber) {
    if (score > 1) {
      displayMessage(
        guess > secretNumber ? '📈 Too high :)) ' : '📉 Too low :(( '
      );

      score--;
      document.querySelector('.score').textContent = score;
    } else {
      displayMessage('😢 You lost he he');
      document.querySelector('.score').textContent = 0;
    }
  }
});
// FUNCTION 3
document.querySelector('.again').addEventListener('click', function () {
  score = 20;
  secretNumber = Math.trunc(Math.random() * 20) + 1;

  document.querySelector('.number').textContent = '?';
  document.querySelector('.guess').value = '';
  document.querySelector('body').style.backgroundColor = '#222';
  document.querySelector('.number').style.width = '15rem';
  displayMessage('Start guessing...');
  document.querySelector('.score').textContent = score;
});

// PROGRAM STRUCTURE
/*
- 'use strict';
- 3 variable declaration
- 3 function definition
*/
