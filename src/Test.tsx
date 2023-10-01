import GoToConfig from "./test_components/GoToConfig";
import TestMessage from "./test_components/TestMessage";


function Test() {
    return (
        <div class="flex flex-col h-screen bg-slate-950 text-slate-200">
            <div class="basis-1/6 m-8">
                <h1 class="text-3xl">Pokeswap v1.0.0</h1>
            </div>
            <div class="grid-rows-5 basis-5/6 m-8">
                <GoToConfig/>
                <TestMessage/>
            </div>
        </div>
    );
}

export default Test;