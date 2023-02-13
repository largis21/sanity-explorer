export function generateTableColumns(documents: Array<any>) {
    let allFields: Array<string> = []

    documents.forEach((document) => {
        Object.keys(document).forEach((docKey) => {
            if (!allFields.includes(docKey)) {
                allFields.push(docKey)
            }
        })
    })

    const formatedAllFields = allFields.map((header) => (
            {
                Header: header,
                accessor: header
            }
        ))

    return formatedAllFields
}