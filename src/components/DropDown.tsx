import { Show, createSignal, onCleanup, For, Component, createEffect} from "solid-js";
import DropDownOption from "./DropDownOption";

// For some reason, these don't cleanly import into here...
declare module "solid-js" {
    namespace JSX {
      interface Directives {
        clickOutside: () => any;
      }
    }
  }

function clickOutside(el: Element, accessor: () => any) {
    const onClick = (e: MouseEvent) => !el.contains(e.target as Node) && accessor()?.();
    document.body.addEventListener("click", onClick);

    onCleanup(() => document.body.removeEventListener("click", onClick));
}


interface DropDownProps<T> {
    subComponent: Component<T & any> | string,
    items: any[],
    selectionSignal?: [get: any, set: any],
    class?: string,
}

const dropDownClassAttrs = [
    "flex",
    "flex-row",
    "mt-1",
    "bg-slate-800",
    "ring-slate-200",
    "px-2",
    "py-1",
    "text-sm",
    "h-8",
    "rounded",
    "drop-shadow-mg",
    "hover:drop-shadow-lg",
    "hover:bg-slate-700",
    "transition"
].join(' ');

//TODO: generalize to accept either a list store OR a map
function DropDown<T>(props: DropDownProps<T>) {

    const [hidden, setHidden] = createSignal(true);

    const [selected, setSelected] = props.selectionSignal || createSignal(props.items.length > 0 ? props.items[0].name : "");

    createEffect(() => {
        setSelected(props.items.length > 0 ? props.items[0].name : "");
    });

    return (
        <div class={props.class + " " + dropDownClassAttrs} use:clickOutside={() => setHidden(true)}>
            <button 
                onclick={() => setHidden(false)}
                class="flex flex-row text-sm grow"
            >
                <p class="basis-4/5 text-left px-1">{selected()}</p>
                <p class="basis-1/5 text-right px-1">▾</p>
            </button>
            <div class={"fixed overflow-y-auto rounded transition-all ease-in duration-150 " + (hidden() ? "opacity-0 max-h-0" : "opacity-100 max-h-32 drop-shadow-xl")}>
                <Show when={!hidden()}>
                    <For each={props.items}>
                        {(item) => <DropDownOption setSelected={setSelected} onclickBehavior={() => setHidden(true)} item={item} subComponent={props.subComponent}/>}
                    </For>
                </Show>
            </div>
        </div>
    );
}

export default DropDown;