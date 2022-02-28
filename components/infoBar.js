


export default function InfoBar(props) {
    

    return (
        <div className=" h-8 w-full bg-slate-100 flex items-center">
            <span className="pl-2">
                {(props.activeFile ? props.activeFile.name : "untitled")}
            </span>
        </div>
    )
}