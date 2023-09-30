/* @refresh reload */
import { render } from "solid-js/web";

import "./styles.css";
import Config from "./Config";
import Test from "./Test";
import { SetupFormProvider } from "./contexts/setupForm";
import { Router, Route, Routes } from "@solidjs/router";

render(() => {
    return (
    <SetupFormProvider>
        <Router>
            <Routes>
                <Route path="/" component={Config}/>
                <Route path="/test" component={Test}/>
            </Routes>
        </Router>
    </SetupFormProvider>
    );}, document.getElementById("root") as HTMLElement);
