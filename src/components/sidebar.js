import {
    useState,
    useEffect,
    useMemo
} from "react"
import Compiler from "./compiler"
import { Debugger, DebugController } from "./debugger"

export default function Sidebar(props) {

    const serial = useMemo(() => hasSerial(), [])
    function hasSerial() {
        if("serial" in navigator){
            return navigator.serial
        }
        return false
    }


    //access state controller key
    //0: currently not in use, open to anyone
    //1: compiler awaiting and requesting reader access
    //2: debugger awaiting and requesting reader access
    //3: locked to compiler and not being awaited
    //4: locked to debugger and not being awaited
    //5: awaiting debugger to be disabled but not awaited by compiler
    //reader and writer permissions are both attached to the same state
    //this means debug technically has writer permissions in state, 
        //although it does not utilize them
    const [ accessControl, setAccessControl] = useState(0)

    const [ port, setPort ]  = useState(0)

    async function connect() {
        setPort(await navigator.serial.requestPort({
            //add usb filters here
        }))
    }

    async function disconnect() {
        if( accessControl !== 0) {
            alert("Skewax is currently using the port. Make sure to turn off the debug terminal and finish compiling before disconnecting from the device")
        }
        else {
            console.log("port closed")
            await port.close()
            setPort(0)
        }
    }

    useEffect(() => {
        async function awaitOpen() {
            if (port !== 0 && !port.readable && !port.writable) {
                await port.open({baudRate: 9600})
                console.log(port)
                if(port.readable === null) {
                    alert("could not open port")
                    setPort(0)
                }
            }
        }   
        awaitOpen()
    }, [port])

    //log all accessControl changes
    // useEffect(() => {
    //     console.log(accessControl)
    // }, [accessControl])


    if(serial) {
        if(port){
            return (
                <div className="p-2 w-80 border-l border-slate-100 flex items-start flex-col">
                    <div className="w-full flex justify-center">
                        <button
                            onClick={disconnect}
                            className="text-slate-500 underline"
                        >
                            Disconnect...
                        </button>
                    </div>
                    <DebugController 
                        setAccessControl={setAccessControl}
                        accessControl={accessControl}
                    />
                    <Compiler 
                        port={port}
                        accessControl={accessControl}
                        setAccessControl={setAccessControl}    
                        code={props.code}
                    />
                    <Debugger 
                        port={port}
                        accessControl={accessControl}
                        setAccessControl={setAccessControl}
                    />
                </div>
            )
        }
        else {
            return (
                <div className="w-80 border-l border-slate-100 flex justify-center items-center">
                    <button
                        className="w-24 h-24 rounded-lg border-1 shadow-lg transition-all hover:shadow-md border border-slate-100 text-slate-500 font-bold"
                        onClick={connect}
                    >
                        Connect <br /> to <br /> Device
                    </button>
                </div>
            )
        }
    }
    else {
    return (
        <div
            className="w-80 border-l border-slate-100 flex"
        >
            <span className="text-slate-600 m-2">
                This browser does not support the Web Serial API, so you won't be able to compile and flash it <br /><br /> You can still write code, however
            </span>
        </div>
    )
    }
}