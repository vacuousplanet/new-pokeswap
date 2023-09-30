import { useNavigate } from "@solidjs/router";

function GoToConfig() {

    const navigate = useNavigate();

    function toolTip() {
        return (
            <span
                class="pointer-events-none absolute -top-7 left-0 w-max opacity-0 transition-opacity group-hover:opacity-100 bg-slate-900 p-2 rounded shadow-lg"
            >
                <p class="text-rose-500">Close Bizhawk before returning to Config Screen...</p>
            </span>
        );
    }

    return (
        <div class="group relative w-max basis-1/6">
            <button class="btn-large" onclick={() => navigate('/')}>Return To Config Screen</button>
            {toolTip()}
        </div>
    );
}

export default GoToConfig;