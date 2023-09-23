import { createEffect, createSignal } from "solid-js";
import { useSetupForm } from "../contexts/setupForm";


// TODO: change mdoe to enum probably
//       add more advanced validity checking/tooltip messages
function JoinLobbyButton() {

    const [formData, _] = useSetupForm() as [any, any];

    const [active, setActive] = createSignal(false);

    createEffect(() => {
        setActive(
            formData.bizhawkPath() != ""
            && formData.romPath() != ""
            && formData.username() != ""
            && formData.lobbyCode() != ""
        );
    });

    function toolTip() {
        return (
            <span
                class="pointer-events-none absolute -top-7 left-0 w-max opacity-0 transition-opacity group-hover:opacity-100 bg-slate-900 p-2 rounded shadow-lg"
                hidden={active()}
            >
                <p class="text-rose-500">{formData.bizhawkPath() != "" ? "" : "* Missing Bizhawk Path"}</p>
                <p class="text-rose-500">{formData.romPath() != "" ? "" : "* No ROM Selected"}</p>
                <p class="text-rose-500">{formData.username() != "" ? "" : "* Missing Player Name"}</p>
                <p class="text-rose-500">{formData.lobbyCode() != "" ? "" : "* Missing Lobby Code"}</p>
            </span>
        );
    }

    return (
        <div class="group relative w-max basis-1/6">
        <button
            class="btn-large"
            onclick={() => {

            }}
            disabled={!active()}
        >Join</button>
        {toolTip()}
        </div>
    );
}

export default JoinLobbyButton;