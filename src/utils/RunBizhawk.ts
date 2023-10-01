import { invoke } from "@tauri-apps/api/tauri";

interface bizhawkCommandData {
    bizPath: string,
    gamePath: string,
    savestatePath?: string,
}

async function runBizhawkCommand(pathData: bizhawkCommandData) {
    await invoke('run_bizhawk', {
        "bizPath": pathData.bizPath,
        "gamePath": pathData.gamePath,
        "savestatePath": pathData.savestatePath
    });
}

export default runBizhawkCommand;