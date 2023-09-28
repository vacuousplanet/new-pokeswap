import { fs } from "@tauri-apps/api";
import { createSignal, createContext, useContext } from "solid-js";
import { createStore } from "solid-js/store";
import { Store } from "tauri-plugin-store-api";
import RomData from "../utils/RomData";

const SetupFormContext = createContext();

// init store
const setupStore = new Store(".setup.dat");

// validate bizhawkPath is still valid
const bizhawkPathStored = await (async () => {
  let path = await setupStore.get<string>('bizhawkPath');
  return (path && (await fs.exists(path))) ? path : '';
})();

// validate that rom paths are valid AND still have same game version lol
const listItemsStored = await (async () => {
  let li = await setupStore.get<{name: string, path: string}[]>('listItems');
  if (!li) return [];
  return await Promise.all(li.filter(async v => await fs.exists(v.path) && await RomData(v.path) === v));
})();

// no validation needed for username lol
const usernameStored = await setupStore.get<string>('username');

export function SetupFormProvider(props: any) {
    // init signals and load from store
    const [bizhawkPath, setBizhawkPath] = createSignal(bizhawkPathStored || '');

    const [listItems, setListItems] = createStore(listItemsStored || []);

    const [romPath, setRomPath] = createSignal(listItems.length > 0 ? listItems[0] : {name: '', path: ''});
    
    const [username, setUsername] = createSignal(usernameStored || '');

    const [lobbyCode, setLobbyCode] = createSignal('');

    const [listModes, {}] = createStore([
      {name: "Swap"},
      {name: "Barrel"}
    ]);

    const [mode, setMode] = createSignal(listModes[0]);

    const [listPlayerCounts, {}] = createStore(
      Array.from(Array(9).keys()).map(i => {return {name: (i + 2).toString()}})
    );

    const [maxPlayers, setMaxPlayers] = createSignal(listPlayerCounts[0]);

    const [customServer, setCustomServer] = createSignal('');

    const [useCustomServer, setUseCustomServer] = createSignal(false);

    // define setup form api
    const setupFormData = [
        {
            bizhawkPath: bizhawkPath,
            romPath: romPath,
            roms: listItems,
            username: username,
            lobbyCode: lobbyCode,
            mode: mode,
            listModes: listModes,
            listPlayerCounts: listPlayerCounts,
            maxPlayers: maxPlayers,
            customServer: customServer,
            useCustomServer: useCustomServer
        },
        {
            setBizhawkPath: (s: string) => {setBizhawkPath(s); setupStore.set('bizhawkPath', s);},
            setRomPath: setRomPath,
            addRoms(roms: any) {
                setListItems([...listItems, ...Array().concat(roms).filter((v) => !listItems.map(r => r.path).includes(v.path))]);
                setupStore.set('listItems', listItems);
            },
            setUsername: (s: string) => {setUsername(s); setupStore.set('username', s);},
            setLobbyCode: setLobbyCode,
            setMode: setMode,
            setMaxPlayers: setMaxPlayers,
            removeRom(data: {name: string}) {
                setListItems(listItems.filter((v) => v !== data));
            },
            setCustomServer: setCustomServer,
            setUseCustomServer: setUseCustomServer
        }
    ]

  return (
    <SetupFormContext.Provider value={setupFormData}>
      {props.children}
    </SetupFormContext.Provider>
  );
}

export function useSetupForm() { return useContext(SetupFormContext); }