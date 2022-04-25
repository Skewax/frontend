import { useEffect, useState } from 'react'

const Files = (props) => {

    if(props.files) {
        return (
            <div>
                {
                    props.files.map(file => {
                        return (
                                <ul 
                                    onClick={() => props.selectFile(file)} 
                                    className={file.selected ? "bg-slate-100" : "bg-white"}
                                    key={file.id}
                                >
                                    {file.name}
                                </ul>
                        )
                    })
                }
            </div>
        )
    }
    return (
        <div>
            loading
        </div>
    )
}

export default Files