import {
    useState,
    useEffect,
    useRef
} from "react"
import { gapi } from 'gapi-script'
import LoginButton from './auth/login'
import Files from './auth/files'
import useDebounce from './useDebounce'

const CLIENT_ID = process.env.REACT_APP_GOOGLE_DRIVE_CLIENT_ID
const API_KEY = process.env.REACT_APP_GOOGLE_DRIVE_API_KEY
const SCOPES = 'https://www.googleapis.com/auth/drive.appdata https://www.googleapis.com/auth/drive.file'


export default function FileManager(props) {

    const [user, setUser] = useState(false)
    const [files, setFiles] = useState(false)
    const [activeFile, setActiveFile] = useState(false)
    const [accountContext, setAccountContext] = useState(false)

    useEffect(() => {
        function start() {
            gapi.client.init({
                apiKey: API_KEY,
                clientId: CLIENT_ID,
                scope: SCOPES
            })
        }
        gapi.load('client:auth2', start)
    })



    const getFiles = (searchTerm = null) => {
        gapi.client.load('drive', 'v3', () => {
            gapi.client.drive.files.list({
                spaces: 'appDataFolder',
                pageSize: 100,
                fields: 'nextPageToken, files(id, name, mimeType, modifiedTime)',
                q: searchTerm
            }).then(function (response) {
                const parsed = JSON.parse(response.body)
                //going through the response to selectively add files
                //this way the cache of data and ids of docs are saved on search and update
                //converting to hashmap by id because its O(a+b) not O(ab)
                let tempFiles = {}
                if (files) {
                    files.forEach((f) => {
                        const fObj = { ...f }
                        fObj.shown = false
                        tempFiles[f.id] = fObj
                    }) 
                }
                parsed.files.forEach((entry) => {
                   if(!tempFiles[entry.id]){
                       tempFiles[entry.id] = entry
                   }
                   tempFiles[entry.id].shown = true
                })
                let listedFiles = []
                for(const [key, val] of Object.entries(tempFiles)) {
                    getContentCache(val)
                    listedFiles.push(val)
                }
                setFiles(listedFiles)
            })
        })
    }

    const getContentCache = async(f) => {
        gapi.client.drive.files.get({
            fileId: f.id,
            alt: 'media'
        }).then((response) => {
            f.cache = response.body
        })
    }

    const createFile = (name, currentFolder) => {
        const content = "'{$STAMP BS2}\n'{$PBASIC 2.5}\n\n\n\n\n\n"
        const file = new Blob([content], {type: 'text/plain'})
        const metadata = {
            'name': name,
            'mimeType': 'text/plain',
            'parents': [currentFolder],
        }
        const accessToken = gapi.auth.getToken().access_token
        let form = new FormData()
        form.append('metadata', new Blob([JSON.stringify(metadata)], {type: 'application/json'}))
        form.append('file', file)

        let xhr = new XMLHttpRequest()
        xhr.open('post', 'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id')
        xhr.setRequestHeader('Authorization', 'Bearer ' + accessToken)
        xhr.responseType = 'json'
        xhr.onload = () => {
            getFiles()
        }
        xhr.send(form)
    }   

    useEffect(() => {
        setAccountContext(false)
        if(user) {
            getFiles()
        }
    }, [user])

    // clicking on files

    const selectFile = async (file) => {
        if(activeFile) {
            activeFile.selected = false
            updateActiveFile(props.code)
        }
        file.selected = true
        setActiveFile(file)
    }

    

    useEffect(() => {
        if(activeFile) {
            if(activeFile.cache){
                props.setCode(activeFile.cache)
            }
            gapi.client.drive.files.get({
                fileId: activeFile.id,
                alt: 'media'
            }).then((response) => {
                activeFile.cache = response.body
                props.setCode(activeFile.cache)
            })
        }
    }, [activeFile])



    //uploading

    useEffect(() => {
        props.setAwaitingUpload(true)
    }, [props.code])

    const debouncedCode = useDebounce(props.code, 1000)

    const updateActiveFile = async (body) => {
        const constBody = body
        if(activeFile) {
            await gapi.client.request({
                path: '/upload/drive/v3/files/' + activeFile.id,
                method: 'PATCH',
                params: {
                    uploadType: 'media'
                },
                body: constBody
            })
        }
    }

    useEffect(() => {
        async function update() {
            await updateActiveFile(debouncedCode)
            props.setAwaitingUpload(false)
        }
    }, [debouncedCode])

    const signOut = () => {
        const auth2 = gapi.auth2.getAuthInstance() 
        if(auth2 != null) {
            auth2.signOut().then(auth2.disconnect().then(setUser(false)))
        }
    }

    const ref = useRef(null)

    const handleClickOutsideAccount = (event) => {
        if(ref.current && !ref.current.contains(event.target)) {
            setAccountContext(false)
        }
    }

    useEffect(() => {
        document.addEventListener('click', handleClickOutsideAccount, true)
        return () => {
            document.removeEventListener('click', handleClickOutsideAccount, true)
        }
    }, [])

    return (
        <div className="w-56 h-full bg-primary">
            <img src={props.theme ? "./full-light.svg" : "./full-dark.svg"} alt={"logo"} className="m-3 ml-4"/>
            {(user ? 
                <div className="">
                    {user.imageUrl ? 
                    <div className="relative pt-3" onClick={() => setAccountContext(true)} ref={ref}>
                        <div className="px-5 absolute  flex items-center cursor-pointer">
                            <img src={user.imageUrl} alt={"icon"} 
                                className="rounded-full"
                                width={40}
                            /> 
                            <span className="ml-4 text-l select-none">
                                Signed in as: <br />  {user.name}
                            </span>
                        </div>
                        <div 
                            className={`absolute top-12 w-full p-5 flex justify-center ${accountContext ? "" : "hidden"}`}
                        >
                            <button 
                                className="bg-slate-50 w-40 rounded-xl flex justify-center items-center h-10 shadow-md"
                                onClick={signOut}
                            >
                                <span className="font-bold text-slate-600">Sign Out</span>
                            </button>
                        </div>
                    </div>
                        : <></>
                    }
                    {/* <button onClick={() => createFile("test", "appDataFolder")}>Create</button> */}
                    <Files 
                        files={files}
                        selectFile={selectFile}
                    />
                </div> 
                :
                <div className="flex justify-center items-center h-full">
                    <LoginButton setUser={setUser} />
                </div>
            )}
        </div>
    )
};