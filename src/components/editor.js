
import React from "react";
import AceEditor from "react-ace";

export default function Editor(props) {

    return (
        <div className="flex-grow flex-col h-full relative">
            <div className="absolute z-50 w-full flex justify-center h-14 items-center">
                <span className=" font-bold text-2xl text-gray-600">{"hello"}</span>
            </div>
            <AceEditor
                value={props.code}
                onChange={props.onChange}
                name="mainEditor"
                editorProps={{
                    $blockScrolling: true
                }}
                fontSize={16}
                showPrintMargin={false}
                width="100%"
                style={{
                    position: 'relvative',
                    
                }}
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