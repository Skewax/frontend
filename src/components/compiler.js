import { useEffect, useState} from "react"
import Flasher from "./writeData"
import pbasic from "pbasic-tokenizer"
import { toast } from "react-toastify"
import { FaHammer } from "react-icons/fa"
import { ImSpinner2 } from "react-icons/im"
export default function Compiler(props) {

    const [running, setRunning] = useState(false)

    function beginCompile() {
        if(props.accessControl === 0) {
            props.setAccessControl(3)
        }
        else {
            props.setAccessControl(1)
        }
    }

    function endCompile() {
            props.setAccessControl(2)
    }


    async function doCompile() {
        const compiled = pbasic.compile(props.code, false)
        if(compiled.Succeeded === true) {
            const flasher = new Flasher(props.port) 
            let flashPromise = new Promise((resolve, reject) => {
                flasher.flash(compiled).then(() => {
                    resolve()
                })
            })
            let timeout = new Promise((resolve, reject) => {
                let id = setTimeout(async() => {
                    clearTimeout(id)
                        reject()
                }, 3000)
            })
            let race = Promise.race([flashPromise, timeout])
            race.then(() => {
                endCompile()
            })
            race.catch(async error => {
                toast.error(`Compiler Timed Out. Make sure the stamp is on and plugged in.`, {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
                await flasher.cancel()
                props.setAccessControl(0)
            })
            
        }
        else {
            toast.error(`Error, ${compiled.Error.message}`, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            props.setAccessControl(0)
            
        }
    }

    useEffect(() => {
        if(props.accessControl === 3) {
            setRunning(true)
        }
        else {
            setRunning(false)
        }
    }, [props.accessControl])

    useEffect(() => {
        if(running === false) {
            if(props.accessControl === 2) {
                props.setAccessControl(4)
            }
            else {
                props.setAccessControl(0)
            }
        }
        else {
            doCompile()
        }
    }, [running])

    return ( 
        <div className="w-full flex justify-center">
            
            <div
                onClick={beginCompile} 
                className="bg-sky-600 rounded-lg w-44 text-white font-bold h-10 text-xl flex items-center cursor-pointer select-none shadow-lg"
            >
                {props.accessControl === 3 ? <ImSpinner2 className="text-white pl-4 origin-[70%_50%] animate-spin "  size={40}/>: <FaHammer className="text-white pl-4" size={38}/>}
                
                <div className="flex-grow"></div>
                <span className={props.accessControl === 3 ? 'pr-2': 'pr-8'}>{props.accessControl === 3 ? 'Compiling...' : 'Compile'}</span>
            </div>
        </div>
    )
}