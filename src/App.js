import Editor from "./components/editor";
import FileManager from "./components/fileManager";
import Sidebar from "./components/sidebar";
import {
  useState,
  useEffect
} from "react"


function App() {

  const [code, setCode] = useState('')
  const [awaitingUpload, setAwaitingUpload] = useState(false)

  return (
    <div className="App flex h-screen">
      <FileManager
        code={code}
        setCode={setCode}
        setAwaitingUpload={setAwaitingUpload}
      />
      <Editor 
        code={code}
        onChange={setCode}
      />
      <Sidebar 
      
      />
    </div>
  );
}

export default App;
