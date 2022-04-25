
import React from "react";
import AceEditor from "react-ace";

export default function Editor(props) {

    return (
        <div className="flex-grow flex-col h-full">
            <div className="w-full flex justify-center h-14 items-center">
                <span className=" font-bold text-2xl text-gray-600">File</span>
            </div>
            <div className="h-full bg-slate-200">
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
                height="inherit"
                showGutter={true}
                highlightActiveLine={false}
                focus={true}
            />
            </div>
        </div>
    )
};