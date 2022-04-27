import Editor from "./components/editor";
import FileManager from "./components/fileManager";
import Sidebar from "./components/sidebar";
import {
  useState,
  useEffect
} from "react"
import { useMediaQuery } from 'react-responsive';

function App() {

  const [code, setCode] = useState('')
  const [awaitingUpload, setAwaitingUpload] = useState(false)
  const [theme, setTheme] = useState(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches)

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
