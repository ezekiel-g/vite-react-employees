const formatDateAndTime = utcString => {
    if (!utcString) return 'Invalid date'

    const utcDate = new Date(utcString)
    const dateOptions = {
	    year: 'numeric',
	    month: '2-digit',
	    day: '2-digit',
	    hour: '2-digit',
	    minute: '2-digit',
	    hour12: true
    }
    const localDate = utcDate.toLocaleString('en-US', dateOptions)
    const timeIndex = localDate.indexOf(', ') + 2
    const time = localDate.slice(timeIndex)
    const [hour, minute] = time.split(':')
    const newHour = parseInt(hour, 10)
    const formattedTime = `${newHour}:${minute}`
    const datePart = utcDate.toISOString().split('T')[0]
    const formattedDateAndTime = `${datePart} at ${formattedTime}`
    
    return formattedDateAndTime
}

export default formatDateAndTime
