import { definePlugin } from "sanity";
import { route } from "sanity/router";
import { CiViewTable } from "react-icons/ci";
import { ExplorerToolConfig } from "./types"
import { lazy } from "react";

export const explorerTool = definePlugin<ExplorerToolConfig | void>((options) => {
    const {name, title, icon, ...config} = options || {}
    return {
        name: 'explorer',
        tools: [
            {
                name: name || "explorer",
                title: title || "Explorer",
                icon: icon || CiViewTable,
                component: lazy(() => import('./SanityExplorer')),
                options: config,
                router: route.create('/*')
            }
        ],
    }
})