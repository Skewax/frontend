import {
    useState,
    useEffect
} from "react"
import { gapi } from 'gapi-script'
import LoginButton from './auth/login'
import LogoutButton from './auth/logout'
import Files from './auth/files'
import useDebounce from './useDebounce'

const CLIENT_ID = process.env.REACT_APP_GOOGLE_DRIVE_CLIENT_ID
const API_KEY = process.env.REACT_APP_GOOGLE_DRIVE_API_KEY
const SCOPES = 'https://www.googleapis.com/auth/drive.appdata https://www.googleapis.com/auth/drive.file'


export default function FileManager(props) {

    const [user, setUser] = useState(false)
    const [files, setFiles] = useState(false)
    const [activeFile, setActiveFile] = useState(false)

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

    return (
        <div className="w-56 h-full">
            {(user ? 
                <>
                    <button onClick={() => createFile("test", "appDataFolder")}>Create</button>
                    <Files 
                        files={files}
                        selectFile={selectFile}
                    />
                    <LogoutButton setUser={setUser} />
                </> 
                :
                <div className="flex justify-center items-center h-full">
                    <LoginButton setUser={setUser} />
                </div>
            )}
        </div>
    )
};