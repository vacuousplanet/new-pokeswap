
import { emit } from "@tauri-apps/api/event"; 

function TestMessage() {

    function toolTip() {
        return (
            <span
                class="pointer-events-none absolute -top-7 left-0 w-max opacity-0 transition-opacity group-hover:opacity-100 bg-slate-900 p-2 rounded shadow-lg"
            >
                <p class="text-rose-500">Sends a test message to bizhawk. It should appear on the console...</p>
            </span>
        );
    }

    return (
        <div class="group relative w-max basis-1/6">
            <button class="btn-large" onclick={() => {
                emit('FRONTEND_MSG', "yo waddup");
            }}>Send Test Message</button>
            {toolTip()}
        </div>
    );
}

export default TestMessage;