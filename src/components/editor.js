
import React, { useEffect, useState, useRef } from "react"
import AceEditor from "react-ace"
import { BsCloudCheck, BsMicFill } from "react-icons/bs"
import { AiOutlineReload, AiOutlineQuestionCircle } from "react-icons/ai"
import { ImCross } from "react-icons/im"
import 'ace-builds/webpack-resolver'
import "ace-builds/src-noconflict/theme-xcode"
import "ace-builds/src-noconflict/theme-dracula"
import 'ace-builds/src-min-noconflict/ext-searchbox'
import PbasicMode from "./pbasicrules"




function Editor(props) {

    const aceEditorRef = useRef(null);

    useEffect(() => {
        const pbasicMode = new PbasicMode();
        if(aceEditorRef.current != null){
            aceEditorRef.current.editor.session.setMode(pbasicMode);
        }
    }, [aceEditorRef])

    useEffect(() => {

    }, [props.theme])

    const [showModal, setShowModal] = useState(false)

    if(props.code === false){
        return (
            <div className="flex-grow flex-col h-full relative dark:bg-slate-800">
                <div className="w-full flex items-center justify-center h-full">
                    <span className="dark:text-slate-200">Loading...</span>
                </div>
            </div>
        )
    }
    if(props.code === -1){
        return (
            <div className="flex-grow flex-col h-full relative dark:bg-slate-800">
                <div className="w-full flex items-center justify-center h-full">
                    <span className="dark:text-slate-200">Sign In and Select a File</span>
                </div>
            </div>
        )
    }
    return (
        <div className="flex-grow flex-col h-full relative z-40">
            {showModal ? <HelpModal showModal={showModal} setShowModal={setShowModal}/> : <></>}
            <div 
                className="absolute z-50 bottom-5 right-5 text-slate-400 dark:text-slate-500 cursor-pointer"
                onClick={() => setShowModal(true)}
            >
                <AiOutlineQuestionCircle size={30}/>
            </div>
            <div className="absolute z-50 w-full flex justify-center h-14 items-center ">
                <span className=" font-bold text-2xl text-gray-600 dark:text-gray-200 select-none">{props.fileName}</span>
                {props.fileName === "NOT SIGNED IN" ?
                    <ImCross
                        size={20}
                        className="ml-3 mt-[0.5px] text-slate-600 dark:text-gray-500"
                    /> 
                    : props.loading ?
                    <AiOutlineReload
                        size={20}
                        className="ml-3 animate-spin dark:text-gray-200"
                    />
                    :
                    <BsCloudCheck
                        size={20}
                        className="ml-3 mt-[3px] dark:text-gray-200"
    
                    />
                }
            </div>
            <AceEditor
                ref={aceEditorRef}
                value={props.code}
                onChange={props.onChange}
                theme={props.theme ? "dracula" : "xcode"}
                mode=""
                name="mainEditor"
                editorProps={{
                    $blockScrolling: true
                }}
                fontSize={16}
                showPrintMargin={false}
                width="100%"
                className="flex-grow"
                onLoad={function(editor){
                    editor.renderer.setPadding(56); 
                    editor.renderer.setScrollMargin(56); 
                    editor.keyBinding.removeKeyboardHandler('ctrl+r');
                    editor.session.setMode(new PbasicMode());
                }}
                height='100%'
                showGutter={true}
                highlightActiveLine={false}
                focus={true}
            />
        </div>
    )
};


const HelpModal = ({showModal, setShowModal}) => {

    useEffect(() => {
        const handleEsc = (event) => {
           if (event.keyCode === 27) {
            setShowModal(false)
          }
        };
        window.addEventListener('keydown', handleEsc);
    
        return () => {
          window.removeEventListener('keydown', handleEsc);
        };
      }, []);

    return(
    <div>
        <div 
            className="justify-center items-center flex fixed inset-0 bg-slate-400 dark:bg-slate-900 opacity-30 z-50"
            onClick={() => setShowModal(false)}
        >
            <div className="w-1/3 h-1/2 bg-white dark:bg-slate-800 rounded-3xl p-5 flex justify-center">
                <ul className="h-max">
                    <li className="py-2">
                        ctrl+alt+n: New File
                    </li>
                    <li className="py-2">
                        ctrl+r: Compile and Flash to STAMP
                    </li>
                    <li className="py-2">
                        ctrl+alt+d: Toggle Debug Terminal
                    </li>
                    <li className="py-2">
                        ctrl/cmd+/: Toggle Comment
                    </li>
                    <li className="py-2">
                        ctrl/cmd+f: Find and Replace
                    </li>
                </ul>
            </div>
        </div>
    </div>
    )
}

export default Editor