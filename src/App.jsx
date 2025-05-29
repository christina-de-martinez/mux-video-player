import { Routes, Route } from "react-router-dom";
import "./App.css";
import Player from "./Player";
import Permissions from "./Permissions";

function App() {
    return (
        <>
            <Routes>
                <Route path="/" element={<Permissions />} />
                <Route path="/player" element={<Player />} />
            </Routes>
        </>
    );
}

export default App;
