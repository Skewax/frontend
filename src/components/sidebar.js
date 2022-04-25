


export default function Sidebar(props) {
    return (
        <div className="w-80 border-l-2 border-slate-100 flex items-center transition-all">
            <div className=" bg-indigo-400 w-[330px] absolute right-0 rounded-l-3xl h-56 drop-shadow-xl">
            {
                (props.port ?
                    <div>
                        <span>hello</span>
                    </div>
                :
                    <div className="flex justify-center items-center h-full flex-col">
                        <span className="text-white font-bold text-2xl mb-6">Disconnected...</span>
                        <span className="text-white font-bold text-2xl underline cursor-pointer">Connect</span>
                    </div>
                )
            }
            </div>
        </div>
    )
}