
import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import Editor from './editor'
import Debug from './debug'
import TopBar from './topBar'
import FileManager from './fileManager'
import pbasic from './compile_pbasic.pack'

export default function Main(props) {
    // state management
    const [serial, setSerial] = useState(0)
    const [port, setPort] = useState(0)
    const [running, setRunning] = useState(0)
    const [code, setCode] = useState("")

    useEffect(async() => {
      if ("serial" in navigator) {
        setSerial(navigator.serial)
      }
      else {
        setSerial(1)
      }
    }, [])
  
    function compileAndLoad() {
      console.log(pbasic.compile(code, false))
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
          <TopBar port={port} setPort={setPort} running={running} setRunning={setRunning} compileAndLoad={compileAndLoad} serial={serial} />
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
  