function PrintToLogExample(props: {addLogLine: (msg: string) => void}) {

    function toolTip() {
        return (
            <span
                class="pointer-events-none absolute -top-7 left-0 w-max opacity-0 transition-opacity group-hover:opacity-100 bg-slate-900 p-2 rounded shadow-lg"
            >
                <p class="text-rose-500">Sends a test message to the log. Remove this for more space, lol</p>
            </span>
        );
    }

    return (
        <div class="group relative w-max basis-1/6">
            <button class="btn-large" onclick={() => {
                props.addLogLine('yo waddup, i never visited bizhawk...')
            }}>Print message to log</button>
            {toolTip()}
        </div>
    );
}

export default PrintToLogExample;