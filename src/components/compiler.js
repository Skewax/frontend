import { useEffect, useState} from "react"
import Flasher from "./writeData"
import pbasic from "pbasic-tokenizer"
import { toast } from "react-toastify"

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
        console.log(compiled)
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
        <div>
            <button onClick={beginCompile}>compile</button>
        </div>
    )
}