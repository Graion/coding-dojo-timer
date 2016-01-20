!function () {
    'use strict'

    function getInput() {
        var time = [5, 0]
          , count = 0
        if (!window.confirm('Five minutes?')) while (!count) {
            window.prompt('Enter time').replace(/(\d+)/g, function (val) {
                time[count++] = parseInt(val, 10)
            })
        }
        return time
    }

    function pad(value) {
        return ('0' + value).slice(-2)
    }

    function display() {
        var el = clock.querySelector('.display')
        ;(display = function () {
            el.textContent = pad(time[0]) + ':' + pad(time[1])
        })()
    }

    var clock = document.querySelector('.clock')
      , stage = document.body
      , beep = clock.querySelector('audio')
      , base = getInput()
      , time, tick, timeout

    var action = {
        reset: function () {
            action.pause()
            stage.classList.remove('timeout')
            timeout = false
            beep.currentTime && (beep.currentTime = 0)
            time = [].concat(base)
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
        time[1]--
        if (time[1] < 0) {
            time[1] = 59
            time[0]--
        }
        if (!time[0]) {
            if (parseInt(beep.duration, 10) >= time[1]) {
                beep.play()
            }
            if (!time[1]) {
                stage.classList.add('timeout')
                timeout = true
                action.pause(true)
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
}()