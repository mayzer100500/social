import "./share.scss";
import Image from "../../assets/img.png";
import Map from "../../assets/map.png";
import Friend from "../../assets/friend.png";
import { useContext, useRef, useState } from "react";
import { AuthContext } from "../../context/authContext";
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { makeRequest } from "../../axios";

const Share = () => {
    const [file, setFile] = useState(null)
    const descRef = useRef(null)
    const { currentUser } = useContext(AuthContext)
    const queryClient = useQueryClient()

    const upload = async () => {
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
        mutationFn: (newPost) => makeRequest.post('/posts/', newPost),
        onSuccess: () => {
            // Invalidate and refetch
            queryClient.invalidateQueries({ queryKey: ['posts'] })
        },
    })

    const handleClick = async (e) => {
        e.preventDefault()
        const dataForm = {
            desc: descRef.current.value,
            img: file,
        }
        if (dataForm.img) dataForm.img = await upload()
        mutation.mutate(dataForm)
        descRef.current.value = ""
        setFile(null)
    }

    return (
        <div className="share">
            <div className="container">
                <div className="top">
                    <div className="left">
                        <img
                            src={`../public/upload/${currentUser.profilePic}`}
                            alt=""
                        />
                        <input type="text" ref={descRef} placeholder={`What's on your mind ${currentUser.name}?`} />
                    </div>
                    <div className="right">
                        {file && <img className="file" src={URL.createObjectURL(file)} alt="" />}
                    </div>
                </div>
                <hr />
                <div className="bottom">
                    <div className="left">
                        <input type="file" id="file" onChange={(e) => setFile(e.target.files[0])} style={{ display: "none" }} />
                        <label htmlFor="file">
                            <div className="item">
                                <img src={Image} alt="" />
                                <span>Add Image</span>
                            </div>
                        </label>
                        <div className="item">
                            <img src={Map} alt="" />
                            <span>Add Place</span>
                        </div>
                        <div className="item">
                            <img src={Friend} alt="" />
                            <span>Tag Friends</span>
                        </div>
                    </div>
                    <div className="right">
                        <button onClick={(e) => handleClick(e)}>Share</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Share;