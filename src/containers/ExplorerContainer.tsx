import { ExplorerGui } from "../components/ExplorerGui";
import { ExplorerProps } from "../types";

export function ExplorerContainer(props: ExplorerProps) {
    return <ExplorerGui {...props} />
}