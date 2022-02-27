import { useState, useEffect} from 'react'
import { BiCaretRightSquare, BiStopCircle} from 'react-icons/bi'
import { IoHammer } from 'react-icons/io5'
import ConnectionModal from './connectModal'

export default function TopBar(props) {
    async function requestPort() {
        props.setPort(await navigator.serial.requestPort())
    }
    useEffect(async () => {
        if (props.port != 0 && !props.port.readable) {
            await props.port.open({ baudRate: 9600 })
        }
    }, [props.port])



    return (
        <div className="bg-white absolute top-0 w-full z-20 border-b-2">
            <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
                <div className="relative flex items-center justify-between h-16">
                    <div className="flex-1 flex items-center justify-center sm:items-stretch sm:justify-start">
                        <div className="flex-shrink-0 flex items-center">
                            <img className="block lg:hidden h-8 w-auto" src="https://tailwindui.com/img/logos/workflow-mark-indigo-500.svg" alt="Workflow" />
                                <img className="hidden lg:block h-8 w-auto" src="https://tailwindui.com/img/logos/workflow-logo-indigo-500-mark-white-text.svg" alt="Workflow" />
                                </div>
                                <div className="sm:block sm:ml-6">
                                    <div className="flex space-x-4 justify-center">
                                        <button onClick={(!props.port? requestPort : () => props.setShowModal(true))} className="main-button">{(props.port? "Connected..." :"Connect to Device")}</button>
                                        {props.showModal ? 
                                            <ConnectionModal setShowModal={props.setShowModal} port={props.port} setPort={props.setPort} requestPort={requestPort}/> 
                                        : "" }
                                    </div>
                                </div>
                        </div>
                        <div className="absolute inset-y-0 right-0 flex items-left pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                                { (props.port?
                                    <div className="flex">
                                        <button onClick={props.compileAndLoad} className="absolute right-10 top-2">
                                            <IoHammer
                                                size={40}
                                                className="text-green-500 hover:scale-110 transition-all mt-1 mr-10"
                                                title="Compile and Run"
                                            />
                                        </button>
                                        {
                                        (props.running ? 
                                            <button onClick={() => props.setRunning(false)}>
                                                <BiStopCircle
                                                    size={45}
                                                    className="text-red-400 hover:scale-110 transition-all ml-1"
                                                />
                                            </button> :
                                            <button onClick={() => props.setRunning(true)}>
                                                <BiCaretRightSquare
                                                    size={50}
                                                    className="text-green-500 hover:scale-110 transition-all"
                                                    title="Listen to Debug"
                                                />
                                            </button>
                                    )} </div> : "")
                                }
                        </div>
                    </div>
                </div>
        </div>
    )

}