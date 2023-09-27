import { invoke } from "@tauri-apps/api/tauri";

interface bizhawkCommandData {
    bizPath: string,
    gamePath: string,
    luaPath: string,
    savestatePath?: string,
}

async function generateBizhawkCommand(pathData: bizhawkCommandData) {
    await invoke('run_bizhawk', {
        "bizPath": pathData.bizPath,
        "gamePath": pathData.gamePath,
        "luaPath": pathData.luaPath,
        "savestatePath": pathData.savestatePath
    });
}

export default generateBizhawkCommand;