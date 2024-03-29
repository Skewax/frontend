import {
    useState,
    useEffect,
    useRef
} from "react"
import { gapi } from 'gapi-script'
import LoginButton from './auth/login'
import Files from './auth/files'
import useDebounce from './useDebounce'
import { useCookies } from "react-cookie";
import { Link } from "react-router-dom";

const CLIENT_ID = process.env.REACT_APP_GOOGLE_DRIVE_CLIENT_ID
const API_KEY = process.env.REACT_APP_GOOGLE_DRIVE_API_KEY
const SCOPES = 'https://www.googleapis.com/auth/drive.appdata https://www.googleapis.com/auth/drive.file'


export default function FileManager(props) {
    const [fileCache, setFileCache] = useState(false)
    const [cookies, setCookie] = useCookies(['selectedFile', 'pageState'])
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
        setCookie('pageState', 'true')
    })



    const getFiles = async (searchTerm = null) => {
        await gapi.client.load('drive', 'v3', () => {
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
                for(const [, val] of Object.entries(tempFiles)) {
                    getContentCache(val)
                    listedFiles.push(val)
                }
                listedFiles.sort(function compareFn(a, b) { 
                    if(a.name.toUpperCase() > b.name.toUpperCase()) {
                        return 1
                    } 
                    if(a.name.toUpperCase() < b.name.toUpperCase()) {
                        return -1
                    }
                    return 0
                })
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
        xhr.onload = (event) => {
            setFileCache(event.target.response.id)
            getFiles(null)
        }
        xhr.send(form)
    }   

    const deleteFile = (file) => {
        gapi.client.drive.files.delete({
            fileId: file.id
        }).then(function (res) {
            if(res.status >= 200 && res.status <= 300) {
                let tempFiles = [ ...files]
                let pos = 0
                for( var i = 0; i < tempFiles.length; i++){ 
                                   
                    if ( tempFiles[i].id === file.id) { 
                        tempFiles.splice(i, 1); 
                        pos = i
                        i--; 
                    }
                }
                setFiles(tempFiles)
                selectFile(tempFiles[Math.min(pos, tempFiles.length - 1)])
            }
        })
    }

    const renameFile = (file, newName) => {
        file.name = newName
        gapi.client.drive.files.update({
            fileId: file.id,
            resource: {
                name: newName
            }
        }).then((res) => {
            if(res.status >= 200 && res.status <= 300) {
            }
        })
        setFiles([ ...files])
    }

    const requestScope = (profileObj) => {
        const options = new gapi.auth2.SigninOptionsBuilder({
            'scope': SCOPES
        })
        let googleUser = gapi.auth2.getAuthInstance().currentUser.get()
        
        googleUser.grant(options).then(
            function(success){
                console.log(success)
                if(success.error) {
                    alert("error: " + toString(success.error))
                }
                setUser(profileObj)
            },
            function(fail){
                alert("Please grant all scopes")
                requestScope(profileObj)
            }
        )
    }

    useEffect(() => {
        setAccountContext(false)
        if(user) {
            if(props.code === -1) props.setCode(false)
            getFiles()
        }
        else {
            props.setCode(-1)
        }
    }, [user])


    useEffect(() => {
        if(files) {
            if(fileCache) {
                const temp = files.find(obj => obj.id === fileCache)
                if(temp) {
                    selectFile(temp)
                }
                setFileCache(false)
            }
            else if(activeFile === false) {
                if(cookies.selectedFile) {
                    const temp = files.find(obj => obj.id === cookies.selectedFile)
                    if(temp) {
                        selectFile(temp)
                    } else {
                        selectFile(files[0])
                    }
                } else {
                    selectFile(files[0])
                }
            }
        }   
    }, [files])


    // clicking on files

    const selectFile = async (file) => {
        if(activeFile) {
            files.forEach((file) => {
                file.selected = false
            })
            updateActiveFile(props.code)
        }
        file.selected = true
        setActiveFile(file)
    }

    

    useEffect(() => {
        if(activeFile) {
            setCookie('selectedFile', activeFile.id)
            if(activeFile.cache){
                props.setCode(activeFile.cache)
                props.setFileName(activeFile.name)
            }
            gapi.client.drive.files.get({
                fileId: activeFile.id,
                alt: 'media'
            }).then((response) => {
                activeFile.cache = response.body
                props.setCode(activeFile.cache)
                props.setAwaitingUpload(false)
                props.setFileName(activeFile.name)
            })
        }
    }, [activeFile])



    //uploading

    useEffect(() => {
        props.setAwaitingUpload(true)
    }, [props.code])

    const debouncedCode = useDebounce(props.code, 1000)

    const updateActiveFile = async (body) => {
        props.setAwaitingUpload(true)
        const constBody = body
        let fileRef = activeFile
        if(activeFile) {
            await gapi.client.request({
                path: '/upload/drive/v3/files/' + activeFile.id,
                method: 'PATCH',
                params: {
                    uploadType: 'media'
                },
                body: constBody
            }).then((response) => {
                if (response.status === 200) {
                    fileRef.cache = body
                    props.setAwaitingUpload(false)
                }
            })
        }
    }

    useEffect(() => {
        async function update() {
            await updateActiveFile(debouncedCode)
        }
        update()
    }, [debouncedCode])

    const signOut = () => {
        const auth2 = gapi.auth2.getAuthInstance() 
        if(auth2 != null) {
            auth2.signOut().then(auth2.disconnect().then(setUser(false))).then(props.setFileName("NOT SIGNED IN"))
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
        <div className="w-56 h-full bg-primary flex flex-col bg-slate-50 dark:bg-gray-900 ">
            <Link to='/about'>
                <img src={props.theme ? "./full-light.svg" : "./full-dark.svg"} alt={"logo"} className="m-3 ml-4 flex-grow cursor-pointer"/>
            </Link>
            {(user ? 
                <div className="flex flex-col flex-grow overflow-y-hidden h-max">
                    {user.imageUrl ? 
                    <div className="relative pt-3 flex-grow" onClick={() => setAccountContext(true)} ref={ref}>
                        <div className="px-5 absolute  flex items-center cursor-pointer bg-slate-50 dark:bg-gray-900">
                            <img src={user.imageUrl} referrerPolicy="no-referrer" alt={"icon"} 
                                className="rounded-full"
                                width={40}
                            /> 
                            <span className="ml-4 text-l select-none dark:text-slate-100">
                                Signed in as: <br />  {user.name}
                            </span>
                        </div>
                        <div 
                            className={`absolute top-12 w-full p-5 flex justify-center transform transition-all ${accountContext ? "scale-100" : "scale-0"}`}
                        >
                            <button 
                                className="bg-white dark:bg-slate-700 w-40 rounded-md flex justify-center items-center h-10 shadow-[0_10px_30px_-5px_rgba(0,0,0,0.3)]"
                                onClick={signOut}
                            >
                                <span className="text-slate-600 dark:text-slate-200">Sign Out</span>
                            </button>
                        </div>
                    </div>
                        : <></>
                    }
                    <div className="flex flex-col flex-grow overflow-y-scroll scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-700">
                    <Files 
                        files={files}
                        selectFile={selectFile}
                        createFile={createFile}
                        getFiles={getFiles}
                        deleteFile={deleteFile}
                        renameFile={renameFile}
                        theme={props.theme}
                    />
                    </div>
                </div> 
                :
                <div className="flex justify-center items-center h-full">
                    <LoginButton setUser={setUser} theme={props.theme} requestScope={requestScope} />
                </div>
            )}
        </div>
    )
};