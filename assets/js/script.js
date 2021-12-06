
function init()
{
    class Timer {
        constructor(hours, minutes, seconds) {

            this.hours = hours
            this.minutes = minutes
            this.seconds = seconds

            this.interval = null

            this.reset = function () {
                this.hours = hours
                this.minutes = minutes
                this.seconds = seconds
            }
        }
    }

    const timer = new Timer('00', '25', '00')
    
    insertTime(timer)

    const button_start = document.querySelector('.start');
    const button_pause = document.querySelector('.pause');
    const button_stop = document.querySelector('.stop');

    button_start.addEventListener('click', () => { start(timer) })
    button_pause.addEventListener('click', () => { pause(timer) })
    button_stop.addEventListener('click', () => { stop(timer) })

}

function start(timer)
{
    function subtractOneSecond(timer)
    {
        const data = new Date()
        data.setHours(parseInt(timer.hours))
        data.setMinutes(parseInt(timer.minutes))
        data.setSeconds(parseInt(timer.seconds) - 1)

        timer.hours = `${data.getHours()}`.padStart(2, 0)
        timer.minutes = `${data.getMinutes()}`.padStart(2, 0)
        timer.seconds = `${data.getSeconds()}`.padStart(2, 0)

        return timer
    }

    timer.interval = setInterval(() => {
        insertTime(subtractOneSecond(timer))
    }, 1000)

}

function pause(timer)
{
    clearInterval(timer.interval)
}

function stop(timer)
{
    clearInterval(timer.interval)
    timer.reset()
    insertTime(timer);
}

function insertTime({ hours, minutes, seconds })
{
    let pomodoro_timer = document.querySelector('.pomodoro_timer')
    pomodoro_timer.innerHTML = `${hours}:${minutes}:${seconds}`
}

init()