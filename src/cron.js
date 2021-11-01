const api = require('./api'),
    timeZone = process.env.time_zone*60*60*1000

const scheduleKeys = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресение']


function createLessonString(lesson) {
    const common = `Пара через 10 минут\n\n${lesson.begins}-${lesson.ends} - ${lesson.name}.`
    if (lesson.type === 'zoom') {
        return `${common} ID-конференции: ${lesson.zoomId}. Пароль: ${lesson.zoomPassword}. ${lesson.lecturer}`
    }
    return `${common} Аудитория: ${lesson.aud}. ${lesson.lecturer}`
}

async function makeLessonQueue() {
    let weekDay = new Date(Date.now()+timeZone).getDay()

    weekDay = weekDay>4 ? 0 : weekDay
    const schedule = (await api.getSchedule()).get(scheduleKeys[weekDay])
    schedule.map( (lesson) => {
        const [hours, minutes] = lesson.begins.split(':')

        const now = new Date(Date.now())
        const date = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes-10, 0, 0)
        setTimeout(async () => {
            await api.sendMessage(createLessonString(lesson), 231237066)
            console.log(now)
            console.log(date)
        }, date-now)
    })
}


module.exports = {
    start: async () => {
        await makeLessonQueue()
            const now = new Date()

        const start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0)
        let wait = start - Date.now()
        console.log('Time now: ' + new Date().toString())
        console.log('Time left ' + new Date(wait).toString())
        setTimeout( () => {
            console.log('Cron started: ' + new Date().toString())
            setInterval(async () => {
                await makeLessonQueue()
            }, 86400000)
        }, wait)
    }
}