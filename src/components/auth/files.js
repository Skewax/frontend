import { useState } from 'react'
import { BsFileEarmarkText } from 'react-icons/bs'
import {
    Menu,
    Item,
    useContextMenu,
    theme
  } from "react-contexify";
import "react-contexify/dist/ReactContexify.css";

const File = (props) => {
    const { show } = useContextMenu({id: props.id})

    function displayMenu(e) {
        show(e)
    }

    const [ editing, setEditing ] = useState(false)
    const editFile = () => {
        setEditing(props.text)
    }
    

    function keydown(e) {
        if(e.keyCode === 27) {
            e.preventDefault()
            setEditing(false)
        }
        if(e.keyCode === 13) {
            props.renameFile(editing)
            setEditing(false)
        }
    }

    if(editing !== false) {
        return (
            <>
                <div 
                    className={"pl-3 py-1 flex  items-center text text-slate-600 dark:text-slate-500"}
                    id={props.id}
                >
                    <BsFileEarmarkText 
                        size={15}
                        className="mt-[1px]"
                    />
                    <input 
                        value={editing}
                        onChange={(e) => setEditing(e.target.value)}
                        autoFocus
                        onBlur={() => setEditing(false)}
                        onKeyDown={keydown}
                        className="pl-2"
                    />
                </div>
            </>
        )
    }
    else return (
        <>
            <div 
                className={`pl-3 py-1 cursor-pointer hover:select flex items-center text ${props.selected ? "select" : "text-slate-500"}`}
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
            <Menu id={props.id} theme={(props.theme) ? "dark":"light"}>
                <Item onClick={props.newFilePopup}>
                    Create New File
                </Item>
                <Item onClick={editFile}>
                    Rename "{props.text}"
                </Item>
                <Item onClick={props.deleteFile}>
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
                        (props.files.length > 0 ? props.files.map(file => {
                            return (
                                    <File 
                                        onClick={async () => await props.selectFile(file)} 
                                        selected={file.selected}
                                        text={file.name}
                                        key={file.id}
                                        id={file.id}
                                        createFile={props.createFile}
                                        deleteFile={() => {props.deleteFile(file)}}
                                        renameFile={(name) => {props.renameFile(file, name)}}
                                        theme={props.theme}
                                    />
                            )
                        }) : <div className="text-center text-slate-500">Right Click To Create a File</div>)
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
                <Menu id="FileManagerMenu" theme={(props.theme) ? "dark":"light"}>
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