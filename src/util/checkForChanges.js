const checkForChanges = async (entries, fetchFunction, rowId) => {
    const fetchResult = await fetchFunction()
    const row = fetchResult.data.find(row => row.id === rowId)
    
    if (!row) {
        return { valid: false, message: 'Entry not found' }
    }

    let changeHappened = false

    for (let i = 0; i < Object.keys(entries).length; i++) {
        const columnNameCamel = Object.keys(entries)[i]
        const columnNameSnake =
            columnNameCamel.replace(/([A-Z])/g, '_$1').toLowerCase()
        const newValue = entries[columnNameCamel]
        const oldValue = row[columnNameSnake]

        if (newValue !== oldValue) {
            changeHappened = true
            break
        }
    }
    
    return {
        valid: changeHappened,
        message: changeHappened ? '' : 'No changes detected'
    }
}

export default checkForChanges
