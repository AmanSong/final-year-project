import { React } from "react"
import { CContainer, CHeader } from '@coreui/react';
import './App.css';
import '@coreui/coreui/dist/css/coreui.min.css'
import SidePanel from "./components/SidePanel";


function App() {
  return (
    <div className="App">
      <CHeader>
        <h2>Final Year Project</h2>
      </CHeader>

      <SidePanel></SidePanel>
    </div>
  );
}

export default App;
