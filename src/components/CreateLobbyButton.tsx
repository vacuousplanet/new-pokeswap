import { createEffect, createSignal } from "solid-js";
import { useNavigate } from "@solidjs/router";
import { useSetupForm } from "../contexts/setupForm";
import runBizhawkCommand from "../utils/RunBizhawk";


// TODO: change mdoe to enum probably
//       add more advanced validity checking/tooltip messages
function CreateLobbyButton() {

    const [formData, _] = useSetupForm() as [any, any];

    const [active, setActive] = createSignal(false);

    const navigate = useNavigate();

    createEffect(() => {
        setActive(
            formData.bizhawkPath() != ""
            && formData.romPath().name != ""
            && formData.username() != ""
        );
    });

    function toolTip() {
        return (
            <span
                class="pointer-events-none absolute -top-7 left-0 w-max opacity-0 transition-opacity group-hover:opacity-100 bg-slate-900 p-2 rounded shadow-lg"
                hidden={active()}
            >
                <p class="text-rose-500">{formData.bizhawkPath() != "" ? "" : "* Missing Bizhawk Path"}</p>
                <p class="text-rose-500">{formData.romPath().name != "" ? "" : "* No ROM Selected"}</p>
                <p class="text-rose-500">{formData.username() != "" ? "" : "* Missing Player Name"}</p>
            </span>
        );
    }

    //TODO: onclick should request that the server create a lobby w/ the provided settings!
    //      the server will respond w/ a Yes(lobby code) or a No(idk, somethin else i guress)
    //      then we boogie over to the lobby route i suppose...
    return (
        <div class="group relative w-max basis-1/6">
        <button
            class="btn-large"
            onclick={() => {
                runBizhawkCommand({
                    bizPath: formData.bizhawkPath(),
                    luaPath: "",
                    gamePath: formData.romPath().path,
                });
                navigate('/test');
            }}
            disabled={!active()}
        >Test</button>
        {toolTip()}
        </div>
    );
}

export default CreateLobbyButton;