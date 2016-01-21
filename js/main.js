(function () {
  'use strict';

  let roundPerMatch,
      roundTime;

  function readSettings() {
    let roundsCount = document.getElementById('roundsCount'),
        roundSize = document.getElementById('roundSize');

    roundsCount.value = roundPerMatch = parseInt(roundsCount.value || 5, 10);
    roundSize.value = roundTime = parseInt(roundSize.value || 7, 10);

    stage.classList.add('show');
  }

  function pad(value) {
    return ('0' + value).slice(-2);
  }

  function display() {
    let display = clock.querySelector('.display'),
      status = clock.querySelector('.status');

    display.textContent = pad(time.minutes) + ':' + pad(time.seconds);
    status.innerHTML = 'Rounds: ' + ((roundsCounter % roundPerMatch) || roundPerMatch) + ' de ' + roundPerMatch + ' <br>Set: ' + (Math.floor(roundsCounter / roundPerMatch) + 1);
  }

  let clock = document.querySelector('.clock'),
    stage = document.body,
    roundAlarm = clock.querySelector('audio#round'),
    matchAlarm = clock.querySelector('audio#match'),
    roundsCounter = 1,
    time,
    tick,
    timeout;

  let action = {
    reset: function () {
      readSettings();
      action.pause();
      stage.classList.remove('timeout');
      timeout = false;
      if (roundAlarm.currentTime) {
        roundAlarm.currentTime = 0;
      }
      time = {minutes: roundTime, seconds: 0};
      display();
    },
    pause: function (audio) {
      stage.classList.remove('on');
      if (!audio) {
        ((roundsCounter % roundPerMatch === 0)? matchAlarm : roundAlarm).pause();
      }
      clearTimeout(tick);
    },
    start: function () {
      if (timeout) {
        action.reset();
      }
      clearTimeout(tick);
      stage.classList.add('on');
      tick = setInterval(ticker, 1000);
    }
  };

  function ticker() {
    time.seconds--;
    if (time.seconds < 0) {
      time.seconds = 59;
      time.minutes--;
    }
    if (!time.minutes) {
      if (roundsCounter % roundPerMatch === 0) {
        if (parseInt(matchAlarm.duration, 10) >= time.seconds) {
          matchAlarm.play();
        }
      } else {
        if (parseInt(roundAlarm.duration, 10) >= time.seconds) {
          roundAlarm.play();
        }
      }
      if (!time.seconds) {
        stage.classList.add('timeout');
        timeout = true;
        action.pause(true);
        action.reset();
        action.start();
        roundsCounter++;
      }
    }
    display();
  }

  clock.querySelector('.toggle-settings').addEventListener('click', function () {
    let settings = clock.querySelector('.settings');
    settings.style.display = (settings.style.display === 'block')? 'none' : 'block';
  }, false);
  clock.querySelector('.apply-settings').addEventListener('click', function () {
    action.reset();
    clock.querySelector('.settings').style.display = 'none';
  }, false);
  clock.querySelector('button.start').addEventListener('click', action.start, false);
  clock.querySelector('button.pause').addEventListener('click', action.pause, false);

  document.body.onload = action.reset;
})();
