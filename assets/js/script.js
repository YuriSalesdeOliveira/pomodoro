function Timer(timer_option = 'work_time') {

    this.timer_options = {
        work_time: {hours: '00', minutes: '25', seconds: '00'},
        break_time: {hours: '00', minutes: '00', seconds: '02'},
        long_break_time: {hours: '00', minutes: '10', seconds: '00'}
    }

    let time = this.timer_options[timer_option]

    this.hours = time.hours
    this.minutes = time.minutes
    this.seconds = time.seconds

    this.interval = false

    this.reset = function (timer_option = null) {
        if (timer_option) time = this.timer_options[timer_option]
        this.hours = time.hours
        this.minutes = time.minutes
        this.seconds = time.seconds
        this.interval = false
    }
}

const timer = new Timer()

insertTime(timer)

const button_start = document.querySelector('.start')
const button_pause = document.querySelector('.pause')
const button_stop = document.querySelector('.stop')

button_start.addEventListener('click', () => { start() })
button_pause.addEventListener('click', () => { pause() })
button_stop.addEventListener('click', () => { stop() })

const alertAudio = {
    audio: new Audio(),
    enabled: false,
    play: function(src) {
        this.audio.src = src
        this.audio.play()
        this.enabled = true
    },
    pause: function() {
        this.audio.pause()
        this.enabled = false
    }
}

function start()
{
    if (timer.interval || alertAudio.enabled) return

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

function pause()
{
    clearInterval(timer.interval)
    timer.interval = false
}

function stop()
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

function insertTime({ hours, minutes, seconds }, container_timer_class = 'pomodoro_timer')
{
    let container_timer = document.querySelector(`.${container_timer_class}`)
    container_timer.innerHTML = `${hours}:${minutes}:${seconds}`
}

let timer_options = document.querySelectorAll('.timer_option')

timer_options.forEach((option) => {

    option.addEventListener('click', () => {

        let timer_option = option.getAttribute('data-timer_option')
        timer.reset(timer_option)
        insertTime(timer)

    })
})

function alertEndTime(where_insert_button_class,
    src = 'https://toqueparacelular.com/download/?id=1006&post=1005')
{
    alertAudio.play(src)

    button_audio_stop = createButton('stop alert')
    button_audio_stop.style.color = '#721c24'
    button_audio_stop.style.backgroundColor = '#f8d7da'

    let where_insert_button = document.querySelector(`.${where_insert_button_class}`)
    where_insert_button.appendChild(button_audio_stop)

    button_audio_stop.addEventListener('click', () => {

        alertAudio.pause()

        where_insert_button.removeChild(button_audio_stop)
    })
}

function handleMutationObserver( mutations ) {

    mutations.forEach(function(mutation) {
        
        if (mutation.target.innerHTML === '00:00:00') {

            stop(timer)

            alertEndTime('pomodoro_actions')
            
        }
    })
}

let observer = new MutationObserver( handleMutationObserver )

let target = document.querySelector('.pomodoro_timer')
let config = { childList: true }

observer.observe( target, config )
