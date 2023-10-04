import { createSignal } from "solid-js";
import GoToConfig from "./test_components/GoToConfig";
import TestMessage from "./test_components/TestMessage";
import PrintToLogExample from "./test_components/PrintToLogExample";


function Test() {

    const [log, setLogDirect] = createSignal('');

    const addLogLine = (msg: string) => {
        let today = new Date();
        setLogDirect(
            log() 
            + today.getHours() + ":" 
            + today.getMinutes() + ":" 
            + today.getSeconds() + " -- " 
            + msg + '\n'
        );
    }

    return (
        <div class="flex flex-col h-screen bg-slate-950 text-slate-200">
            <div class="basis-3/6 m-8">
                <h1 class="text-3xl">Pokeswap v1.0.0</h1>
                <textarea class="bg-slate-900 my-4" name="log" id="log" cols="80" rows="10" readonly style="resize:none">{log()}</textarea>
            </div>
            <div class="grid-rows-5 basis-3/6 m-8">
                <GoToConfig/>
                <TestMessage/>
                <PrintToLogExample addLogLine={addLogLine}/>
            </div>
        </div>
    );
}

export default Test;