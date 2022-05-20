import { useEffect, useState} from "react"
import Flasher from "./writeData"
import pbasic from "pbasic-tokenizer"

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
        console.log("compiling...")
        const compiled = pbasic.compile(props.code, false)
        console.log(compiled)
        if(compiled.error) {
            //toast error 
            console.log(compiled.error)
            endCompile()
        }
        else {

            const flasher = new Flasher(props.port) 
            console.log("toFlash")
            await new Promise(resolve => {
                flasher.flash(compiled)
                setTimeout(async() => {
                    await flasher.cancel()
                }, 3000)
            })
            console.log("compiled")
            endCompile()
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