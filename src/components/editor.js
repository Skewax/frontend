
import React, { useEffect } from "react";
import AceEditor from "react-ace";
import { BsCloudCheck } from "react-icons/bs"
import { AiOutlineReload } from "react-icons/ai"

import "ace-builds/src-noconflict/theme-xcode"
import "ace-builds/src-noconflict/theme-dracula"

export default function Editor(props) {

    useEffect(() => {

    }, [props.theme])

    if(props.code === false){
        return (
            <div className="flex-grow flex-col h-full relative">
                <div className="w-full flex items-center justify-center h-full">
                    <span>Sign In and Select a File</span>
                </div>
            </div>
        )
    }
    return (
        <div className="flex-grow flex-col h-full relative">
            <div className="absolute z-50 w-full flex justify-center h-14 items-center ">
                <span className=" font-bold text-2xl text-gray-600 dark:text-gray-200">{props.fileName}</span>
                {props.loading ?
                    <AiOutlineReload
                        size={20}
                        className="ml-3 animate-spin dark:text-gray-200"
                    /> :
                    <BsCloudCheck
                        size={20}
                        className="ml-3 mt-[3px] dark:text-gray-200"
    
                    />
                }
            </div>
            <AceEditor
                value={props.code}
                onChange={props.onChange}
                theme={props.theme ? "dracula" : "xcode"}
                name="mainEditor"
                editorProps={{
                    $blockScrolling: true
                }}
                fontSize={16}
                showPrintMargin={false}
                width="100%"
                onLoad={function(editor){ editor.renderer.setPadding(56); editor.renderer.setScrollMargin(56); }}
                height='100%'
                showGutter={true}
                highlightActiveLine={false}
                focus={true}
                className="flex-grow"
            />
        </div>
    )
};