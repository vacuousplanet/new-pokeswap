import DropDown from "./DropDown";
import { open } from "@tauri-apps/api/dialog";
import { useSetupForm } from "../contexts/setupForm";
import RomData from "../utils/RomData";

interface RomListSubComponentProps {
    data: any,
}

function RomListSubComponent(props: RomListSubComponentProps) { 

    const [_, updateFormData] = useSetupForm() as [any, any];

    return (
        <button 
            onclick={() => {
                updateFormData.removeRom(props.data)
            }}
            class="border border-slate-800 p-1 hover:bg-slate-900 rounded transition"
        >
            <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 384 512">
                <path d="M376.6 84.5c11.3-13.6 9.5-33.8-4.1-45.1s-33.8-9.5-45.1 4.1L192 206 56.6 43.5C45.3 29.9 25.1 28.1 11.5 39.4S-3.9 70.9 7.4 84.5L150.3 256 7.4 427.5c-11.3 13.6-9.5 33.8 4.1 45.1s33.8 9.5 45.1-4.1L192 306 327.4 468.5c11.3 13.6 31.5 15.4 45.1 4.1s15.4-31.5 4.1-45.1L233.7 256 376.6 84.5z" fill="#e11d48" stroke="#e11d48"/>
            </svg>
        </button>
    );
}


function RomList() {
   
    const [formData, updateFormData] = useSetupForm() as [any, any];

    const [itemList, addRoms] = [formData.roms, updateFormData.addRoms];

    async function iconClicked() {
        const selected = await open({
            multiple: true,
            filters: [{
                name: 'Roms',
                extensions: ['gba', 'nds']
            }]
        });

        if (selected == null) return;

        //TODO: generate more data about the rom (need rom files for this!)
        //      small db for known rom hashes
        Promise.all(Array().concat(selected).map(async v => await RomData(v))).then(
            v => addRoms(v),
            (err) => {console.log(err);}
        );
    }

    return (
        <div class="flex flex-row">
            <DropDown subComponent={RomListSubComponent} items={itemList} selectionSignal={[formData.romPath, updateFormData.setRomPath]} class="basis-4/5"/>
            <button class="basis-1/5 mx-2" onclick={() => iconClicked()}>
                <svg xmlns="http://www.w3.org/2000/svg" height="1.8em" viewBox="0 0 576 512" class="my-1">
                    <path d="M0 64C0 28.7 28.7 0 64 0H224V128c0 17.7 14.3 32 32 32H384v38.6C310.1 219.5 256 287.4 256 368c0 59.1 29.1 111.3 73.7 143.3c-3.2 .5-6.4 .7-9.7 .7H64c-35.3 0-64-28.7-64-64V64zm384 64H256V0L384 128zm48 96a144 144 0 1 1 0 288 144 144 0 1 1 0-288zm16 80c0-8.8-7.2-16-16-16s-16 7.2-16 16v48H368c-8.8 0-16 7.2-16 16s7.2 16 16 16h48v48c0 8.8 7.2 16 16 16s16-7.2 16-16V384h48c8.8 0 16-7.2 16-16s-7.2-16-16-16H448V304z" fill="#334155" stroke="34155"/>
                </svg>
            </button>
        </div>
    );
}

export default RomList;