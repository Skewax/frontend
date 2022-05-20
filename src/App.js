import Editor from "./components/editor";
import FileManager from "./components/fileManager";
import Sidebar from "./components/sidebar";
import {
  useState,
  useEffect
} from "react"
import { useMediaQuery } from 'react-responsive';

function App() {

  const [code, setCode] = useState(false)
  const [awaitingUpload, setAwaitingUpload] = useState(false)
  const [theme, setTheme] = useState(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches)

  const [fileName, setFileName] = useState('Untitled')
  const systemPrefersDark = useMediaQuery(
    {
      query: '(prefers-color-scheme: dark)',
    },
    undefined,
    (isSystemDark) => setTheme(isSystemDark)
  );

  return (
    <div className={`flex h-screen ${theme}`}>
      <FileManager
        code={code}
        setCode={setCode}
        setAwaitingUpload={setAwaitingUpload}
        theme={theme}
        setFileName={setFileName}
      />
      <Editor 
        code={code}
        onChange={setCode}
        fileName={fileName}
        loading={awaitingUpload}
        theme={theme}
      />
      <Sidebar 
        code={code}
      />
    </div>
  );
}

export default App;
