import { JSXElement } from "solid-js";

interface LabelProps {
    class: string,
    labelContents: string,
    children: JSXElement | string,
}

function Label(props: LabelProps) {

    return (
        <div class={props.class}>
            <label class="text-xs">{props.labelContents}</label>
            {props.children}
        </div>
    );
}

export default Label;