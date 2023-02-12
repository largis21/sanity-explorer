import type { SanityClient } from "sanity";
import type { ComponentType } from "react";

export interface ExplorerProps {
    client: SanityClient
    config: ExplorerConfig
}

export interface ExplorerConfig{
    defaultApiVersion: string
    defaultDataset?: string
}

export interface ExplorerToolConfig extends Partial<ExplorerConfig> {
    name?: string
    title?: string
    icon?: ComponentType
}