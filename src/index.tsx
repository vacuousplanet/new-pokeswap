/* @refresh reload */
import { render } from "solid-js/web";

import "./styles.css";
import App from "./App";
import { SetupFormProvider } from "./contexts/setupForm";

render(() => {
    return (
        <SetupFormProvider>
            <App />
        </SetupFormProvider>
    );}, document.getElementById("root") as HTMLElement);
