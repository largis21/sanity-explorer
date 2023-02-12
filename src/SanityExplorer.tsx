import React from "react";
import { type Tool, useClient } from "sanity";
import { ExplorerProps, type ExplorerConfig } from "./types";
import { DEFAULT_API_VERSION } from "./apiVersions"
import { ExplorerContainer } from "./containers/ExplorerContainer"

interface SanityExplorerProps{
    tool: Tool<ExplorerConfig>
}

function SanityExplorer(props: SanityExplorerProps) {
    const client = useClient({apiVersion: '1'})
    const config: ExplorerConfig = {
        defaultApiVersion: DEFAULT_API_VERSION,
        ...props.tool.options
    }

    return <ExplorerContainer client={client} config={config} />
}

export default SanityExplorer