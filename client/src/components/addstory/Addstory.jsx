import './addstory.scss'
import { useState, useRef } from 'react'
import { makeRequest } from "../../axios";
import { useMutation, useQueryClient } from '@tanstack/react-query'
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

export default function Addstory({ setOpenStoryModal }) {
    const [selectedFile, setSelectedFile] = useState(null)
    const [mediaType, setMediaType] = useState(null);;
    const mediaRef = useRef(null);
    const queryClient = useQueryClient()

    const upload = async (file) => {
        try {
            const formData = new FormData()
            formData.append("file", file)
            const response = await makeRequest.post("/upload", formData)
            return response.data
        } catch (error) {
            console.log(error.message)
        }
    }

    const mutation = useMutation({
        mutationFn: (story) => makeRequest.post('/stories', story),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['story'] })
        },
    })


    const handleClick = async (e) => {
        e.preventDefault()
        const img = await upload(selectedFile)
        mutation.mutate({ img })
        setMediaType(null)
        setSelectedFile(null)
        setOpenStoryModal(false)
    }

    const handleVideoLoadedData = () => {
        mediaRef.current.currentTime = 0; // Перемотаем в начало
        mediaRef.current.play();
    };

    return (
        <div className="addstory">
            <div className="story-wrapper">
                <h1>Add your story</h1>
                <form>
                    <label htmlFor="selectedFile">
                        <div className="imgContainer">
                            {mediaType && (
                                mediaType.includes('image') ? (
                                    <img
                                        src={URL.createObjectURL(selectedFile)}
                                        alt="preview"
                                    />
                                ) : (
                                    <video
                                        ref={mediaRef}
                                        src={URL.createObjectURL(selectedFile)}
                                        controls
                                        width="250"
                                        height="150"
                                        onLoadedData={handleVideoLoadedData}
                                    >
                                        Your browser does not support the video tag.
                                    </video>
                                )
                            )}
                            {!selectedFile && <CloudUploadIcon className="icon" />}
                        </div>
                    </label>
                    <input
                        type="file"
                        id="selectedFile"
                        accept="video/*,image/*"
                        style={{ display: "none" }}
                        onChange={(e) => {
                            setSelectedFile(e.target.files[0])
                            setMediaType(e.target.files[0].type);
                        }}
                    />
                    <button onClick={(e) => handleClick(e)}>Send</button>
                </form>
                <button className="close" onClick={() => setOpenStoryModal(false)}>close</button>
            </div>
        </div>
    )
}