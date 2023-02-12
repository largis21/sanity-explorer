import { Box, Button, Card, Flex, Grid, Inline, Label, Select, Spinner, Stack } from "@sanity/ui";
import { useEffect, useState } from "react";
import { SanityClient } from "sanity";
import { ExplorerProps } from "../types";

export function ExplorerGui(props: ExplorerProps) {
    const { client } = props
    const defaultDataset = props.config.defaultDataset || "production"

    const [datasets, setDatasets] = useState<Array<string> | null>(null)
    const [activeDataset, setActiveDataset] = useState<string>(defaultDataset)

    const [documentTypes, setDocumentTypes] = useState<Array<string> | null>(null)
    const [activeDocType, setActiveDocType] = useState<string | null>(null)

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
        const fetchedDocuments = 
            await client.withConfig({ dataset: activeDataset }).fetch(`
            *[_type == "${activeDocType}"] 
            `)

        console.log(fetchedDocuments)
    }

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
            <Flex justify="center" align="center" height="fill">
                <Spinner muted/>
            </Flex>
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