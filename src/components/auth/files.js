import { useEffect, useState, useCallback } from 'react'
import { BsFileEarmarkText } from 'react-icons/bs'
import {
    Menu,
    Item,
    Separator,
    Submenu,
    useContextMenu
  } from "react-contexify";
import "react-contexify/dist/ReactContexify.css";

const File = (props) => {

    const { show } = useContextMenu({id: props.id})

    function displayMenu(e) {
        show(e)
    }

    return (
        <>
            <div 
                className={`pl-3 py-1 cursor-pointer hover:select flex items-center text ${props.selected ? "select" : "text-slate-600"}`}
                onClick={props.onClick}
                onContextMenu={displayMenu}
                id={props.id}
            >
                <BsFileEarmarkText
                    size={15}
                    className="mt-[1px]"
                />
                <span className='pl-2'>{props.text}</span>
            </div>
            <Menu id={props.id}>
                <Item onClick={props.newFilePopup}>
                    Create New File
                </Item>
                <Item>
                    Rename "{props.text}"
                </Item>
                <Item>
                    Delete "{props.text}"
                </Item>
            </Menu>
        </>
    )
}

const Files = (props) => {

    const { show } = useContextMenu({id: "FileManagerMenu"})
    
    function displayMenu(e) {
        if(e.target.id === "FileManager"){
            show(e)
        }
    }

    const [newFile, setNewFile] = useState(false)
    function newFilePopup(e) {
        if(newFile === false){
            setNewFile("")
        }
    }
    function newFileKeyDown(e) {
        if(e.keyCode === 27) {
            e.preventDefault()
            setNewFile(false)
        }
        if(e.keyCode === 13) {
            e.preventDefault()
            submitNewFile()
        }
    }
    async function submitNewFile() {
        await props.createFile(newFile, 'appDataFolder')
        await props.getFiles()
        setNewFile(false)
    }

    if(props.files) {
        return (
            <>
                <div 
                    className="mt-14 pt-6 grow"
                    onContextMenu={displayMenu}
                    id={"FileManager"}
                >
                    {
                        props.files.map(file => {
                            return (
                                    <File 
                                        onClick={async () => await props.selectFile(file)} 
                                        selected={file.selected}
                                        text={file.name}
                                        key={file.id}
                                        id={file.id}
                                        createFile={props.createFile}
                                    />
                            )
                        })
                    }{
                        (newFile === false ? 
                            <>
                            </>
                        :
                            <div className='select py-1 pl-3 flex items-center'>
                                <BsFileEarmarkText
                                    size={15}
                                    className="mt-[1px]"
                                />
                                <input 
                                    className={`ml-2 w-full  mr-2 border border-orange-300 pl-2`} 
                                    value={newFile} 
                                    placeholder="untitled"
                                    onChange={evt => setNewFile(evt.target.value)}
                                    onBlur={() => setNewFile(false)}
                                    autoFocus
                                    onKeyDown={newFileKeyDown}
                                />
                            </div>
                        )
                    }
                </div>
                <Menu id="FileManagerMenu">
                    <Item onClick={newFilePopup}>
                        Create New File
                    </Item>
                </Menu>
            </>
        )
    }
    return (
        <div className='flex justify-center items-center'>
            <span>Loading</span>
        </div>
    )
}

export default Files