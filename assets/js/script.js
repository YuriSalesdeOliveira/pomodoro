function init()
{
    function Timer(hours, minutes, seconds) {

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

    const timer = new Timer('00', '25', '00')
    
    insertTime(timer)

    const button_start = document.querySelector('.start')
    const button_pause = document.querySelector('.pause')
    const button_stop = document.querySelector('.stop')

    button_start.addEventListener('click', () => { start(timer) })
    button_pause.addEventListener('click', () => { pause(timer) })
    button_stop.addEventListener('click', () => { stop(timer) })

    return timer
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
    insertTime(timer)
}

function createButton(button_content)
{
    let button = document.createElement('button')
    button.innerHTML = button_content

    return button
}

function finish(timer, container_timer_class = 'pomodoro_timer',
    where_insert_button_for_stop_alert = 'pomodoro_actions')
{   
    function alertEndTimer(where_insert_button_class,
        src = 'https://toqueparacelular.com/download/?id=1006&post=1005')
    {
        let audio = new Audio(src)
        audio.play()

        button_audio_stop = createButton('stop alert')

        let where_insert_button = document.querySelector(`.${where_insert_button_class}`)
        where_insert_button.appendChild(button_audio_stop)

        button_audio_stop.addEventListener('click', () => {

            audio.pause()

            where_insert_button.removeChild(button_audio_stop)
        })
    }

    function handleMutationObserver( mutations ) {

        mutations.forEach(function(mutation) {
            
            if (mutation.target.innerHTML === '00:00:00') {

                alertEndTimer(where_insert_button_for_stop_alert)

                stop(timer)
            }
        })
    }

    let observer = new MutationObserver( handleMutationObserver )

    let target = document.querySelector(`.${container_timer_class}`)
    let config = { childList: true }
  
    observer.observe( target, config )

}

function insertTime({ hours, minutes, seconds }, container_timer_class = 'pomodoro_timer')
{
    let container_timer = document.querySelector(`.${container_timer_class}`)
    container_timer.innerHTML = `${hours}:${minutes}:${seconds}`
}

let timer = init()
finish(timer)