import { JSXElement, Signal, createSignal } from "solid-js";

interface TextFieldProps {
    children: JSXElement | string,
    textSignal?: Signal<string>
}

const textFieldClassAttrs = [
    "basis-11/12",
    "mt-1",
    "bg-slate-800",
    "ring-slate-200",
    "px-2",
    "py-1",
    "text-sm",
    "rounded",
    "drop-shadow-md",
    "hover:drop-shadow-lg",
    "hover:bg-slate-700",
    "transition",
].join(' ')

function TextField(props: TextFieldProps) {

    const [value, setValue] = props.textSignal || createSignal("");

    return (
        <div class="basis-1/5 flex flex-col">
            <label class="text-xs">{props.children}</label>
            <div class="flex flex-row">
                <input type="text" class={textFieldClassAttrs}
                    oninput={(e) => {
                        setValue(e.currentTarget.value)
                    }}
                    value={value()}
                />
            </div>
        </div>
    );
}

export default TextField;