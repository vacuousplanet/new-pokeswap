import { Signal, createSignal } from "solid-js";

interface CustomServerToggleProps {
    textSignal?: Signal<string>,
    checkedSignal?: Signal<boolean>,
}

const textFieldClassAttrs = [
    "basis-4/5",
    "mt-1",
    "enabled:bg-slate-800",
    "ring-slate-200",
    "px-2",
    "py-1",
    "text-sm",
    "rounded",
    "drop-shadow-md",
    "enabled:hover:drop-shadow-lg",
    "enabled:hover:bg-slate-700",
    "transition",
    "disabled:opacity-75",
    "disabled:bg-slate-900",
    "z-0"
].join(' ');

const checkButtonClassAttrs = [
    "bg-slate-800", 
    "h-7",
    "w-7",
    "mt-1",
    "cursor-pointer",
    "pl-2",
    "ml-2",
    "hover:bg-slate-700",
    "transition",
    "select-none",
].join(' ');

function CustomServerToggle(props: CustomServerToggleProps) {

    const [checked, setChecked] = props.checkedSignal || createSignal(false);

    const [value, setValue] = props.textSignal || createSignal('');

    return (
        <div class="basis-1/5 flex flex-row z-0">
            <input type="text" class={textFieldClassAttrs} disabled={!checked()} value={value()}
                oninput={(e) => {
                    setValue(e.currentTarget.value);
                }}
            ></input> 
            <span class={checkButtonClassAttrs} onclick={() => setChecked(!checked())}>
                <p class={"transition " + (checked() ? "opacity-100" : "opacity-0")}>{
                "✓"
            }</p></span>
        </div>
    );
}

export default CustomServerToggle;