import { useEffect, useState } from 'react'

import { BsFileEarmarkText } from 'react-icons/bs'

const Files = (props) => {

    if(props.files) {
        return (
            <div className="pt-20">
                {
                    props.files.map(file => {
                        return (
                                <ul 
                                    onClick={async () => await props.selectFile(file)} 
                                    className={`pl-3 py-1 cursor-pointer hover:select flex items-center text ${file.selected ? "select" : "text-slate-600"}`}
                                    key={file.id}
                                >
                                    <BsFileEarmarkText 
                                        size={15}
                                        className="mt-[1px]"
                                    />
                                    <span className='pl-2'>{file.name}</span>
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