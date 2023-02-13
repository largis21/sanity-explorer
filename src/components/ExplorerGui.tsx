import { Box, Button, Card, Flex, Grid, Inline, Label, Select, Spinner, Stack } from "@sanity/ui";
import React, { useMemo } from "react";
import { useEffect, useState } from "react";
import { SanityClient } from "sanity";
import { ExplorerProps } from "../types";
import { Column, TableInstance, useTable } from "react-table"
import { generateTableColumns } from "../../lib/generateTableColumns";
import { generateTableData } from "../../lib/generateTableData";

export function ExplorerGui(props: ExplorerProps) {
    const { client } = props
    const defaultDataset = props.config.defaultDataset || "production"

    const [datasets, setDatasets] = useState<Array<string> | null>(null)
    const [activeDataset, setActiveDataset] = useState<string>(defaultDataset)

    const [documentTypes, setDocumentTypes] = useState<Array<string> | null>(null)
    const [activeDocType, setActiveDocType] = useState<string | null>(null)

    const [documents, setDocuments] = useState<Array<any>>([])
    const [isLoading, setLoading] = useState(true)

    useEffect(() => {
        getDatasets()
        getDocumentTypes()
    }, [])

    async function getDatasets() {
        const fetchedDatasets = (await client.datasets.list()).map((ds => ds.name))

        const foundDefault = fetchedDatasets.some((ds) => ds === defaultDataset)
        if (foundDefault) {
            const filteredDatasets = fetchedDatasets.filter((ds) => ds !== defaultDataset)
            setDatasets([defaultDataset, ...filteredDatasets])
        } else {
            setDatasets(fetchedDatasets)
        }
    }

    async function getDocumentTypes(dataset: string = defaultDataset) {
        const fetchedDocumentTypes = 
            await client.withConfig({ dataset, apiVersion: "vX" }).fetch(`array::unique(*{_type}._type)`)
        
        setDocumentTypes(fetchedDocumentTypes)
        setActiveDocType(fetchedDocumentTypes[0])
    }

    function handleDocumentTypeClick(e: any) {
        const buttonClicked = e.target.innerText
        setActiveDocType(buttonClicked)
    }

    function handleActiveDSchanged(e: any) {
        setActiveDataset(e.target.value)
        getDocumentTypes(e.target.value)    
    }

    useEffect(() => {
        getDocuments()
    }, [activeDocType])

    async function getDocuments() {
        setLoading(true)

        const fetchedDocuments = 
            await client.withConfig({ dataset: activeDataset }).fetch(`
            *[_type == "${activeDocType}"] 
            `)

        if (!fetchedDocuments) {
            throw new Error("Could not fetch documents")
        }

        setLoading(false)
        setDocuments(fetchedDocuments)
    }

    const documentsData = useMemo(
        () => [
            {
                col1: "col1",
                col2: "col2"
            },
            {
                col1: "col1-2",
                col2: "col2-2"
            }
        ], []
    )
    
    //const [tableInstance, setTableInstace] = useState<TableInstance | null>(null)
    const [tableColumns, setTableColumns] = useState<Array<any>>([])
    const [tableData, setTableData] = useState<Array<any>>(generateTableData(documents))


    useEffect(() => {
        setTableColumns(generateTableColumns(documents))
        setTableData(generateTableData(documents))
    }, [documents])

    const tableInstance = useTable({ columns: tableColumns, data: tableData })
    //const tableInstance = null
    
    //const tableInstance = useTable({ columns: documentFields, data: documentsData})

    return (
        <>
            <Header>
                <Grid columns={[2, 12]}>
                    <Box padding={1} column={2}>
                        <Stack>
                            <Card paddingY={2}>
                                <Label>Dataset</Label>
                            </Card>
                            <Card>
                                <Select
                                    value={activeDataset}
                                    onChange={handleActiveDSchanged}>
                                    { datasets && datasets.map((ds) => <option key={ds}>{ds}</option>)}
                                </Select>
                            </Card>
                        </Stack>
                    </Box>
                    <Box padding={1} column={10}>
                        <Card paddingY={2} marginX={2}>
                            <Label>Document types</Label>
                        </Card>
                        <Inline>
                            {documentTypes &&
                                documentTypes.map((dt) => (
                                    <Card marginX={2} key={dt}>
                                        <Button
                                            onClick={handleDocumentTypeClick} 
                                            text={dt}
                                            value={dt}
                                            mode={ activeDocType === dt ? "default" : "ghost"}
                                            tone={ activeDocType === dt ? "primary" : "default"}
                                            paddingY={3}
                                        />
                                    </Card>
                                ))
                            }
                        </Inline>
                    </Box>
                </Grid>
            </Header>
            {
                !isLoading ? (
                    <Card height="fill" overflow="auto">
                        { tableInstance && <DocumentsTable tableInstance={tableInstance} /> }
                    </Card>
                )
                : (
                    <Flex justify="center" align="center" height="fill">
                        <Spinner muted/>
                    </Flex>
                )

            }
        </>
    )
}

function Header({ children }: any) {
    return (
        <Card paddingX={3} paddingY={2} style={{borderBottom: "1px solid var(--card-border-color"}}>
            {children}
        </Card>
    )
}

function DocumentsTable({ tableInstance }: { tableInstance: TableInstance }) {
    const {headerGroups, rows, prepareRow } = tableInstance
    return (
        <table cellSpacing={0} style={{borderCollapse: "collapse"}}>
            <thead 
                style={{
                    borderBottom: 'solid 1px gray', 
                    background: 'var(--selected)'
                }}
            >
                {headerGroups.map(headerGroup => (
                    <tr 
                        {...headerGroup.getHeaderGroupProps()}>
                        {headerGroup.headers.map(column => (
                            <th
                                {...column.getHeaderProps()}
                                style={{
                                    fontWeight: 'bold',
                                    padding: '4px',
                                    borderRight: 'var(--border-gray)',
                                    textAlign: "left",
                                }}
                            >
                                {column.render('Header')}
                            </th>
                        ))}
                    </tr>
                ))}
       </thead>
       <tbody>
         {rows.map(row => {
           prepareRow(row)
           return (
             <tr {...row.getRowProps()}>
               {row.cells.map(cell => {
                 return (
                   <td
                     {...cell.getCellProps()}
                     style={{
                       padding: '4px',
                       border: 'solid 1px gray',
                       whiteSpace: "nowrap"
                     }}
                   >
                     {cell.render('Cell')}
                   </td>
                 )
               })}
             </tr>
           )
         })}
       </tbody>
     </table>
    )
}