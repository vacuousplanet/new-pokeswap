import { Component, Setter } from "solid-js";
import { Dynamic } from "solid-js/web";

interface DropDownOptionProps<T> {
    setSelected: Setter<string>,
    onclickBehavior: (() => void) | undefined,
    item: {name: string} & T,
    subComponent: Component<T> | string,
}

const dropDownOptionClassAtrs: string = [
    "basis-4/5",
    "flex",
    "flex-row",
    "grow",
    "relative",
    "bg-slate-800",
    "px-2",
    "py-1",
    "text-sm",
    "z-50",
    "hover:bg-slate-700",
    "transition",
].join(' ');

function DropDownOption<T>(props: DropDownOptionProps<T>) {

    return (
        <div class={dropDownOptionClassAtrs}>
            <button
                onclick={() => {props.setSelected(props.item.name); props.onclickBehavior ? props.onclickBehavior() : null;}}
                class="px-1 basis-5/6"
            >{props.item.name}</button>
            <Dynamic component={props.subComponent} data={props.item} class="px-1 basis-1/6"></Dynamic>
        </div>
    );
}

export default DropDownOption;