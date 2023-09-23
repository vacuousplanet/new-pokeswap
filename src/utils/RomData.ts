import { invoke } from "@tauri-apps/api/tauri";

const RomTable = new Map([
    ["POKEMON EMER", "Pokemon Emerald"],
    ["POKEMON RUBY", "Pokemon Ruby"],
    ["POKEMON SAPP", "Pokemon Sapphire"]
]);

async function RomData(path: string) {
    // open path, read game version
    const game_version = await invoke<string>('read_file', {path: path, offset: 0x0A0, length: 12}); 

    return {
        name: RomTable.get(game_version) || "! UNKNOWN GAME VERSION !",
        path: path,
    }
}

export default RomData;