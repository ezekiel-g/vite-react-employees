const checkForDuplicate = async (
    entryObject,
    fetchFunction,
    excludeIdForUpdate = null
) => {
    const fetchResult = await fetchFunction()
    const rows = fetchResult.data

    if (rows.length === 0 || !Array.isArray(rows)) return 'pass'

    const [columnNameCamel] = Object.keys(entryObject)
    const columnNameSnake =
        columnNameCamel.replace(/([A-Z])/g, '_$1').toLowerCase()
    const rowValue = entryObject[columnNameCamel] 
        ? entryObject[columnNameCamel].toLowerCase() 
        : ''

    const hasDuplicate = rows.some(row => {
        return row[columnNameSnake]?.toLowerCase() === rowValue && 
		       row.id !== excludeIdForUpdate
    })
    
    return hasDuplicate ? 'fail' : 'pass'
}

export default checkForDuplicate
