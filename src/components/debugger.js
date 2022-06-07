import { useEffect, useState } from "react"
import { FaPlay, FaStopCircle } from "react-icons/fa"
import { BsDot } from "react-icons/bs"
import { toast } from 'react-toastify'
export function Debugger(props) {
    const [running, setRunning] = useState(false)
    const [debugText, setDebugText] = useState("")
    const [reader, setReader] = useState(false)

    useEffect(() => {
        if(props.accessControl === 4 && running === false) {
            beginListening()
        }
        if((props.accessControl === 1 || props.accessControl === 5) && running === true) {
            stopListening(props.accessControl)
        }

        async function beginListening() {
            setDebugText("")
            try {
                const treader = props.port.readable.getReader()
                
                await treader.cancel()
                await treader.releaseLock()
                setReader(props.port.readable.getReader())
                setRunning(true)
            }
            catch (error) {
                toast.error('Error: Cannot read from device', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
                setReader(false)
                setRunning(false)
                props.setAccessControl(0)
            }
        }

        
    }, [props.accessControl, running, props.setAccessControl])

    async function stopListening(a) {
        await reader.cancel()
        await reader.releaseLock()
        setReader(false)
        if(a === 1) props.setAccessControl(3)
        if(a === 5) props.setAccessControl(0)
        setRunning(false)
    }



    useEffect(() => {
        async function readFromStream() {
            const {done, value} = await reader.read()
            if(done) {
                await stopListening()
                return 
            }
            const t = debugText.concat(new TextDecoder().decode(value))
            setDebugText(t)
            // need to get debug to actually get set and rerun 
        }
        if(props.accessControl === 4 && reader && running) {
            readFromStream()
        }
    }, [reader, debugText, running, props.accessControl])
   
    function handleDebugClick() {
        setDebugText("hello\rhi\rhello\rhi\rhello\rhi\rhello\rhi\rhello\rhi\rhello\rhi\rhello\rhi\rhello\rhi\rhello\rhi\rhello\rhi\rhello\rhi\rhello\rhi\rhello\rhi\rhello\rhi\rhello\rhi\rhello\rhi\rhello\rhi\rhello\rhi\rhello\rhi\rhello\rhi\rhello\rhi\rhello\rhi\rhello\rhi\rhello\rhi\rhello\rhi\rhello\rhi\rhello\rhi\rhello\rhi\rhello\rhi\rhello\rhi\rhello\rhi\rhello\rhi\r")
        switch(props.accessControl) {
            case 0:
                props.setAccessControl(4)
                break
            case 4:
                props.setAccessControl(5)
                break
            default:
                break
        }
    }

    function getStatusColor() {
        switch(props.accessControl) {
            case 0:
            case 3:
                return "text-red-500"
            case 4:
            case 5:
                return "text-green-500"
            default:
                return "text-yellow-500"
        }
    }

    return (
        <div className="flex justify-center w-full flex-col overflow-hidden">
            <div className="flex w-full justify-center">
                <div className="flex cursor-pointer select-none" onClick={handleDebugClick}>
                    <span className="text-slate-500 w-full text-center">Debug Terminal</span>
                    <span className={` whitespace-pre ${getStatusColor()}`}size={80}>  ●</span>
                </div>
            </div>
            <div className="flex-col flex text-slate-500 pl-2 overflow-y-scroll scrollbar scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-700">
            {debugText.split('\r').map((line, index) => {
                return <span key={index+"debugTerminalLine"}>{'> '}{line}</span>
            })}
            </div>
        </div>
    )
}

