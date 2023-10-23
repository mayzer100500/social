import { useRef, useState, useContext } from 'react'
import { makeRequest } from "../../axios";
import { useMutation, useQueryClient } from '@tanstack/react-query'
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import './update.scss'
import { AuthContext } from '../../context/authContext';

function Update({ setOpenUpdate, user }) {
    const [coverPic, setCoverPic] = useState(null)
    const [profilePic, setProfilePic] = useState(null)
    const nameRef = useRef(null)
    const cityRef = useRef(null)
    const websiteRef = useRef(null)
    const queryClient = useQueryClient()
    const { setCurrentUser } = useContext(AuthContext)

    const upload = async (img) => {
        try {
            console.log("STARTING UPLOAD!!!")
            const formData = new FormData()
            formData.append("file", img)
            const response = await makeRequest.post("/upload", formData)
            return response.data
        } catch (error) {
            console.log(error.message)
        }
    }

    const mutation = useMutation({
        mutationFn: (userInfo) => makeRequest.put('/users', userInfo),
        onSuccess: () => {
            // Invalidate and refetch
            queryClient.invalidateQueries({ queryKey: ['user'] })
        },
    })
    const handleClick = async (e) => {
        e.preventDefault()
        console.log("Updating start....")
        console.log(`COVER: ${coverPic}`)
        console.log(`PROFILE: ${profilePic}`)
        const dataForm = {
            coverPic: coverPic || user.coverPic,
            profilePic: profilePic || user.profilePic,
            name: nameRef.current.value || user.name,
            city: cityRef.current.value || user.city,
            website: websiteRef.current.value || user.website,
        }
        if (coverPic) dataForm.coverPic = await upload(coverPic)
        if (profilePic) dataForm.profilePic = await upload(profilePic)
        mutation.mutate(dataForm)
        setCurrentUser(prevData => ({ ...prevData, ...dataForm }))
        setOpenUpdate(false)
    }

    return (
        <div className='update'>
            <div className="wrapper">
                <h1>Update Your Profile</h1>
                <form>
                    <div className="files">
                        <label htmlFor="coverPic">
                            <span>Cover Picture</span>
                            <div className="imgContainer">
                                <img
                                    src={
                                        coverPic
                                            ? URL.createObjectURL(coverPic)
                                            : "../public/upload/" + user.coverPic
                                    }
                                    alt=""
                                />
                                <CloudUploadIcon className="icon" />
                            </div>
                        </label>
                        <input
                            type="file"
                            id="coverPic"
                            style={{ display: "none" }}
                            onChange={(e) => setCoverPic(e.target.files[0])}
                        />
                        <label htmlFor="profilePic">
                            <span>Profile Picture</span>
                            <div className="imgContainer">
                                <img
                                    src={
                                        profilePic
                                            ? URL.createObjectURL(profilePic)
                                            : "../public/upload/" + user.profilePic
                                    }
                                    alt=""
                                />
                                <CloudUploadIcon className="icon" />
                            </div>
                        </label>
                        <input
                            type="file"
                            id="profilePic"
                            style={{ display: "none" }}
                            onChange={(e) => setProfilePic(e.target.files[0])}
                        />
                    </div>
                    <label>Name</label>
                    <input type="text" ref={nameRef} placeholder={user.name} />
                    <label>Country / City</label>
                    <input type="text" ref={cityRef} placeholder={user.city} />
                    <label>Website</label>
                    <input type="text" ref={websiteRef} placeholder={user.website} />
                    <button onClick={(e) => handleClick(e)}>Update</button>
                </form>
                <button className="close" onClick={() => setOpenUpdate(false)}>close</button>
            </div>
        </div>
    )
}

export default Update