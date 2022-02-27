import { useRef, useEffect, useState } from "react"

function useOutsideAlerter(ref, stater) {
    useEffect(() => {
        /**
         * Alert if clicked on outside of element
         */
        function handleClickOutside(event) {
            if (ref.current && !ref.current.contains(event.target)) {
                stater(false)
            }
        }

        // Bind the event listener
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            // Unbind the event listener on clean up
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [ref]);
}


export default function ConnectionModal(props) {

    const [id, setId] = useState("")

    async function connectNew() {
        await disconnect()
        await props.requestPort()
    }
    async function disconnect() {
        await props.port.close()
        setId("")
        props.setShowModal(false)
        props.setPort(0)
    }

    const wrapperRef = useRef(null)
    useOutsideAlerter(wrapperRef, props.setShowModal)

    if(props.port){
        const { usbProductId, usbVendorId } = props.port.getInfo()
        setId(usbProductId)
    }

    return (
        <div ref={wrapperRef} className="rounded-3xl shadow-lg w-56 h-44 z-40 absolute top-16 mt-2 p-3 bg-gradient-to-r from-white to-slate-50 flex flex-col justify-center" onBlur={() => props.setShowModal(false)}>
            <span className=" text-center font-bold text-blue-500">Device: {id}</span>
            <button className="main-button rounded-lg m-1" onClick={connectNew}>Connect To New Device</button>
            <button className="main-button rounded-lg mx-1 h-10" onClick={disconnect}>Disconnect</button>
        </div>
    )
}