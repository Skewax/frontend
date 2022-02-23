import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import Editor from './editor'
import Debug from './debug'
import TopBar from './topBar'
import FileManager from './fileManager'
import pbasic from './pbasic/compile_pbasic.pack'
import { ToastContainer, toast, Flip } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export default function Main(props) {
    // state management
    const [serial, setSerial] = useState(0)
    const [port, setPort] = useState(0)
    const [running, setRunning] = useState(0)
    const [code, setCode] = useState("")
    const [showConnectionModal, setShowConnectionModal] = useState(false)

    useEffect(async() => {
      if ("serial" in navigator) {
        setSerial(navigator.serial)
      }
      else {
        setSerial(1)
      }
    }, [])
  
    async function compileAndLoad() {
      let compiled = pbasic.compile(code, false)
      if(compiled.Error) {
        toast.error(compiled.Error.message, {
          position: "bottom-right",
          autoClose: 4000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          });
      }
      else if(compiled.Succeeded) {
        const writer = port.writable.getWriter()
        await writer.write(compiled.PacketBuffer)
        setRunning(true)
      }
    }  
  
    if(serial == 0) {
      return (
        <div className="">
          <p>loading</p>
        </div>
      )
    }
  
    else if(serial == 1) {
      return (
        <div className="">
          <p>This browser does not support serial</p>
        </div>
      )
    }


    return (
        <main className="flex overflow:hidden">
          <ToastContainer
          position="bottom-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          transition={Flip}
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          />
          <TopBar port={port} setPort={setPort} running={running} setRunning={setRunning} compileAndLoad={compileAndLoad} serial={serial} setShowModal={setShowConnectionModal} showModal={showConnectionModal}/>
          <div className="flex h-full absolute pt-16 w-full">
            <FileManager />
            <div className="flex flex-col w-full">
              <Editor setCode={setCode}/>
              <Debug port={port} running={running} setRunning={setRunning}/>
            </div>
          </div>
        </main>
    )
  }
  