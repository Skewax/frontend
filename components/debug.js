import { useState, useEffect} from 'react'


export default function Debug(props) {
    const [debugText, setDebugText] = useState("")
    const [reader, setReader] = useState(null)
    let textDecoder = null
    let readableStreamClosed = null;
    let rr = null;

    useEffect(async() => {
        if(props.port.readable && !reader && props.running) {
            try {
                // textDecoder = new TextDecoderStream()
                // readableStreamClosed = props.port.readable.pipeTo(textDecoder.writable)
                rr = props.port.readable.getReader();
                setReader(rr)
            } catch (error) {
                console.log(props.port)
                console.log(error)
            }

        }
        else if(!props.running & props.port.readable ) {
            await props.readable.releaseLock()
        }
    }, [props.port, props.running])

    async function readFromStream() {
        if(props.running && reader) {
            const {value, done} = await reader.read()
            if(done) {
                await reader.releaseLock()
                return;
            }
            const t = debugText.concat(new TextDecoder().decode(value))
            setDebugText(t)
        }
    }

    useEffect(async() => {
        await readFromStream()
    }, [reader, props.running, debugText])

    return (
        <div className=" w-96 m-4 rounded-2xl overflow-scroll shadow-lg bg-[#2B2F41] flex flex-col">
            <div className="w-full h-1/4 p-3 flex flex-col items-center">
                    <span className="font-bold text-white">STATUS: {(props.port ? "Connected" : "Disconnected")}</span>
                    {(props.port?
                        <span className="font-bold text-white">Name:</span>
                    :
                        "connect"
                    )}
            </div>
            <div className="w-full h-3/4 p-3 justify-center flex-1">
                <div className="flex justify-center">
                    <span className="font-bold text-white">DEBUG TERMINAL</span>
                </div>
                <span className="flex-1 p-2 text-white flex-wrap">{debugText}</span>
            </div>
            
        </div>
    )
}