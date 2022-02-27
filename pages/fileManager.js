import React, { useEffect, useState } from 'react'
import { MdPerson } from 'react-icons/md'
import { auth, snapshotFiles } from '../components/firebase'
import { onAuthStateChanged, GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import { updateDoc } from 'firebase/firestore'
import { FaSearch } from 'react-icons/fa'
import { GoPlus } from 'react-icons/go'
import { HiDotsCircleHorizontal } from 'react-icons/hi'

export default function FileManager(props) {
    
    const [files, setFiles] = useState(null)
    

    function signInWithGoogle() {
        signInWithPopup(auth, new GoogleAuthProvider()).then((result) => {
        }).catch((error) => {
            console.log(error)
        })
    }

    useEffect(async () => {
        onAuthStateChanged(auth, user => {
            if(user) {
                snapshotFiles(setFiles)
            }
        })
    }, [])

    useEffect(async () => {
        
    }, [files])

    useEffect(async () => {
        console.log('hi')
        if(props.activeFile && props.code != props.activeFile.text) {
            await updateDoc(props.activeFile.ref, {
                text: props.code
            })
        }
    }, [props.code])

    function openFile(file) {
        props.setCode(file.text)
        props.setActiveFile(file)
    }

    if(!auth.currentUser) {
        return(
            <div className="w-48 bg-gray-100 flex justify-center items-center">
                <button 
                    onClick={signInWithGoogle}
                    className="h-16 w-16 rounded-2xl flex justify-center items-center  flex-col shadow-md bg-white text-blue-500 transform hover:scale-105 transition-all"
                >
                    <MdPerson size={30}/>
                </button>
                
            </div>
        )
    }
    else {
        return (
            <div className="w-56 border-r-2">
                <div className="pl-4 pr-2 py-2 flex justify-between align-center">
                    <span className="font-bold justify-start">Files</span>
                    <div className="flex">
                        <button className="file-button">
                            <FaSearch />
                        </button>
                        <button className="file-button">
                            <GoPlus size={22}/>
                        </button>
                        <button className="file-button" onClick={() => console.log(props.code)}>
                            <HiDotsCircleHorizontal size={22} />
                        </button>
                    </div>
                </div>
                <div className="pt-7">
                    {
                        (files ? 
                            files.map((file) => 
                                (
                                    <button className={"w-full flex justify-start py-2 ".concat((props.activeFile && props.activeFile.name == file.name ? "bg-slate-100 pl-4" : "pl-2"))} onClick={() => openFile(file)} key={file.name}>
                                        <span className="overflow-ellipsis">{file.name}</span>
                                    </button>
                                )
                            )
                        : <p>loading</p>)
                    }
                </div>
            </div>
        )
    }
}