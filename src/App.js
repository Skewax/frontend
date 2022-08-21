import Editor from "./components/editor";
import FileManager from "./components/fileManager";
import Sidebar from "./components/sidebar";
import {
  useState
} from "react"
import { useMediaQuery } from 'react-responsive';
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate
} from "react-router-dom";
import { useCookies } from "react-cookie";
import { AiOutlineBorderOuter } from "react-icons/ai";
import About from "./components/about"

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
  const [cookies, setCookie] = useCookies(['pageState'])

  return (
    <Router>
    <Routes>
      <Route path="/editor" element={
        <div className={`flex h-screen ${theme}`}>
          <ToastContainer
                            position="bottom-center"
                            autoClose={5000}
                            hideProgressBar={false}
                            newestOnTop={false}
                            closeOnClick
                            rtl={false}
                            pauseOnFocusLoss
                            draggable
                            pauseOnHover
                            theme={(theme) ? "dark" : "light"}
          />
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
      } />
      <Route path="/about" element={
        <About setCookie={setCookie} theme={theme} />
      } />
      <Route path="/*" element={
        <>
          {(cookies.pageState === true) ? <Navigate to="/editor" /> : <Navigate to="/about" />}
        </>
      } />
    </Routes>
    </Router>
  );
}

export default App;
