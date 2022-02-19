import { useState, useEffect} from 'react'


export default function Debug(props) {
    const [debugText, setDebugText] = useState("")
    const [reader, setReader] = useState(null)
    let textDecoder = null
    let readableStreamClosed = null;
    let rr = null;

    useEffect(async() => {
        if(props.port.readable && !reader ) {
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
    }, [props.port, props.running])

    async function readFromStream() {
        if(props.running && reader) {
            const {value, done} = await reader.read()
            if(done) {
                reader.releaseLock()
                return;
            }
            const t = debugText.concat(new TextDecoder().decode(value))
            console.log(t)
            setDebugText(t)
        }
    }

    useEffect(async() => {
        await readFromStream()
    }, [reader, props.running, debugText])

    return (
        <div className="w-full h-56 border-t-2 border-slate-100 overflow-scroll">
            <div className="w-full p-3 flex">
                <button className="main-button">Debug Terminal</button>
            </div>
            <span className="whitespace-pre-wrap">{debugText}</span>
        </div>
    )
}