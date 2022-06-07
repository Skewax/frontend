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

    useEffect(() => {
        async function handleUsbConnect(event) {
            try{
                const reader = await port.readable.getReader()
                await reader.releaseLock()
            }
            catch(error) {
                try {
                    if(port) {
                        port.close()
                    }
                    const ports = await navigator.serial.getPorts()
                    if(ports === 0) {
                        setPort(ports[0])
                    }
                    else {
                        setPort(0)
                    }
            }
                catch(error) {
                    console.log(error)
                }
            }
            if(!port) {
                const ports = await navigator.serial.getPorts()
            }
        }
        async function handleUsbDisconnect(event) {
            await port.close()
            setPort(false)
        }
        if(navigator.serial) {
            navigator.serial.addEventListener('connect', handleUsbConnect)
            navigator.serial.addEventListener('disconnect', handleUsbDisconnect)
            return () => {
                navigator.serial.removeEventListener('connect', handleUsbConnect)
                navigator.serial.removeEventListener('disconnect', handleUsbDisconnect)
            }
        }
    })



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
            setPort(false)
        }
    }

    useEffect(() => {
        async function awaitOpen() {
            if (port !== 0 && port !== false && !port.readable && !port.writable) {
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

    async function tryAutoConnect() {
        try {
            if(port !== false) {
                const ports = await navigator.serial.getPorts()
                setPort(ports[0])
                console.log("auto connected")
            }
        }
        catch(error) {
            console.log(error)
        }
    }

    function setText(e) {
        e.target.textContent = "Disconnect"
    }
    function unsetText(e) {
        e.target.textContent = "Connected..."
    }

    if(serial) {
        if(port){
            return (
                <div className="p-2 w-80 border-l border-slate-100 dark:border-slate-700 flex items-start flex-col dark:bg-slate-800 h-full">
                    
                    <div className="w-full flex justify-center">
                        <span className="font-bold text-slate-400 cursor-pointer select-none" onMouseOver={setText} onMouseLeave={unsetText} onClick={disconnect}>
                            Connected...
                        </span>
                    </div>
                    <Compiler 
                        port={port}
                        accessControl={accessControl}
                        setAccessControl={setAccessControl}    
                        code={props.code}
                    />
                   <br />
                    <Debugger 
                        port={port}
                        accessControl={accessControl}
                        setAccessControl={setAccessControl}
                    />
                </div>
            )
        }
        else {
            tryAutoConnect()
            return (
                <div className="w-80 border-l border-slate-100 flex justify-center items-center dark:bg-slate-800 dark:border-slate-900">
                    <button
                        className="w-24 h-24 rounded-lg border-1 shadow-lg transition-all hover:shadow-md border border-slate-100 text-slate-500  dark:text-slate-200 dark:border-0 dark:shadow-xl transform transition-all dark:hover:scale-105 dark:bg-slate-700 font-bold"
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
            className="w-80 border-l border-slate-100 flex dark:bg-slate-800 dark:border-slate-900"
        >
            <span className="text-slate-600 m-2 dark:text-slate-200">
                This browser does not support the Web Serial API, so you won't be able to compile and flash it <br /><br /> You can still write code, however
            </span>
        </div>
    )
    }
}