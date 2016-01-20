(function () {
    'use strict'

    function pad(value) {
        return ('0' + value).slice(-2)
    }

    function display() {
        var el = clock.querySelector('.display');

        (display = function () {
            el.textContent = pad(time.minutes) + ':' + pad(time.seconds);
        })()
    }

    var clock = document.querySelector('.clock'),
        stage = document.body,
        beep = clock.querySelector('audio'),
        time,
        tick,
        timeout;

    var action = {
        reset: function () {
            action.pause()
            stage.classList.remove('timeout')
            timeout = false
            beep.currentTime && (beep.currentTime = 0)
            time = {minutes: 7, seconds: 0}
            display()
        }
      , pause: function (audio) {
            stage.classList.remove('on')
            !audio && beep.pause()
            clearTimeout(tick)
        }
      , start: function () {
            timeout && action.reset()
            clearTimeout(tick)
            stage.classList.add('on')
            tick = setInterval(ticker, 1000)
        }
    }

    function ticker() {
        time.seconds--;
        if (time.seconds < 0) {
            time.seconds = 59;
            time.minutes--;
        }
        if (!time.minutes) {
            if (parseInt(beep.duration, 10) >= time.seconds) {
                beep.play()
            }
            if (!time.seconds) {
                stage.classList.add('timeout')
                timeout = true;
                action.pause(true);
            }
        }
        display()
    }

    clock.addEventListener('click', function (event) {
        var bt = event.target.classList
        for (var name in action) {
            bt.contains(name) && action[name]()
        }
    }, false)

    stage.classList.add('show')
    action.reset()
})()
