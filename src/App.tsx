import { useSetupForm } from "./contexts/setupForm";

import DropDown from "./components/DropDown";
import Label from "./components/Label";
import TextField from "./components/TextField";

import FileDialog from "./components/FileDialog";
import RomList from "./components/RomList";
import CreateLobbyButton from "./components/CreateLobbyButton";

import "./App.css";
import JoinLobbyButton from "./components/JoinLobbyButton";
import CustomServerToggle from "./components/CustomServerToggle";

function App() {

  const [formData, updateFormData] = useSetupForm() as [any, any];

  // TODO: use contexts for reactive 'forms'
  return (
    <div class="flex flex-row justify-start h-screen bg-slate-950 text-slate-200">
      <div class="basis-1/2 m-8">
        <h1 class="text-3xl">Pokeswap v1.0.0</h1>
        <div class="flex flex-col mx-4 pt-4 pb-2 h-5/6">
          <div class="basis-1/2"></div>
          <CreateLobbyButton/>
          <JoinLobbyButton/>
          <button class="btn-large">Resume</button> 
        </div>
      </div>
      <div class="basis-1/2 m-4">
        <div class="flex flex-col justify-start h-5/6 m-8">
          <Label class="basis-1/5 flex flex-col" labelContents="Bizhawk Path">
            <FileDialog filepathSignal={[formData.bizhawkPath, updateFormData.setBizhawkPath]}/>
          </Label>
          <Label class="basis-1/5 flex flex-col" labelContents="Game Version">
            <RomList/>
          </Label>
          <TextField textSignal={[formData.username, updateFormData.setUsername]}>Player Name</TextField>
          <TextField textSignal={[formData.lobbyCode, updateFormData.setLobbyCode]}>Lobby Code</TextField>
          <div class="basis-1/5 flex flex-row">
            <Label class="basis-2/3 flex flex-col" labelContents="Mode">
              <DropDown subComponent="div" items={formData.listModes} selectionSignal={[formData.mode, updateFormData.setMode]}/>
            </Label>
            <Label class="basis-1/3 flex flex-col px-2" labelContents="Player Cap">
              <DropDown subComponent="div" items={formData.listPlayerCounts} selectionSignal={[formData.maxPlayers, updateFormData.setMaxPlayers]}/>
            </Label>
          </div>
          <Label class="basis-1/5 flex flex-col" labelContents="Use Custom Server?">
            <CustomServerToggle textSignal={[formData.customServer, updateFormData.setCustomServer]} checkedSignal={[formData.useCustomServer, updateFormData.setUseCustomServer]}/>
          </Label>
        </div>
      </div>
    </div>
  );
}

export default App;
