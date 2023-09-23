import { Signal, createSignal } from "solid-js";

import { open } from "@tauri-apps/api/dialog";

const filePathClassAttrs = [
    "basis-4/5",
    "truncate",
    "mt-1",
    "bg-slate-800",
    "ring-slate-200",
    "px-2",
    "py-1",
    "text-sm",
    "h-8",
    "w-80",
    "rounded",
    "drop-shadow-md",
    "hover:drop-shadow-lg",
    "hover:bg-slate-700",
    "transition"
].join(' ')

interface FileDialogProps {
    filepathSignal?: Signal<string>
}

function FileDialog(props: FileDialogProps) {
    
    const [filepath, setFilepath] = props.filepathSignal || createSignal("");
    
    async function clicked() {
        const selected = await open({
            multiple: false,
            filters : [{
                name: 'Executable',
                extensions: ['exe'],
            }]
        });

        if (selected == null) return;

        // as string here is fine; multiple = false
        setFilepath(selected as string);
    }

    return (
        <div class="flex flex-row">
            <button class={filePathClassAttrs} onclick={() => clicked()}>{filepath()}</button>
            <button class="basis-1/5 mx-2" onclick={() => clicked()}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" height="1.8em" class="my-1">
                    <path d="M64 480H448c35.3 0 64-28.7 64-64V160c0-35.3-28.7-64-64-64H288c-10.1 0-19.6-4.7-25.6-12.8L243.2 57.6C231.1 41.5 212.1 32 192 32H64C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64z" fill="#334155" stroke="#334155"/>
                </svg>
            </button>
        </div>
    );
}

export default FileDialog;