


export default function InfoBar(props) {
    

    return (
        <div className="ml-4 h-10 w-11/12 flex items-center text-white font-bold border-b-2 border-slate-500">
            <span className="pl-4">
                {(props.activeFile ? props.activeFile.name : "untitled")}
            </span>
        </div>
    )
}