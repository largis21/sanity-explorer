export function generateTableData(documents: Array<any>) {
    const tableData = documents.map((document) => cleanDocument(document))

    console.log(tableData)

    return tableData  
}

function cleanDocument(document: any ){
    let cleanedObject: any = {}

    Object.keys(document).forEach((key) => { 
        if (typeof document[key] === "string") {
            cleanedObject[key] = document[key]
        } else if (document[key]._type === "reference") {
            cleanedObject[key] = "Reference"
        }
    })

    return cleanedObject
}