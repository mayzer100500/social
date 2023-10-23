import './profile.scss'
import { useContext, useState } from 'react';
import { useParams } from 'react-router-dom'
import { AuthContext } from '../../context/authContext';
import FacebookTwoToneIcon from "@mui/icons-material/FacebookTwoTone";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import InstagramIcon from "@mui/icons-material/Instagram";
import PinterestIcon from "@mui/icons-material/Pinterest";
import TwitterIcon from "@mui/icons-material/Twitter";
import PlaceIcon from "@mui/icons-material/Place";
import LanguageIcon from "@mui/icons-material/Language";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import Posts from '../../components/posts/Posts'
import Update from "../../components/update/Update"
import { makeRequest } from "../../axios";

const Profile = () => {
    const [openUpdate, setOpenUpdate] = useState(false)
    const params = useParams()
    const { currentUser } = useContext(AuthContext)
    const { isLoading, error, data } = useQuery({ queryKey: ["user", params.id], queryFn: () => makeRequest.get(`/users/find/${params.id}`).then(res => { return res.data }) })
    const { isLoading: relationshipIsLoading, data: relationshipData } = useQuery({ queryKey: ["relationship", 'suggestions', params.id], queryFn: () => makeRequest.get(`/relationships?followedUserId=${params.id}`).then(res => { return res.data }) })

    const queryClient = useQueryClient()

    const mutation = useMutation({
        mutationFn: (following) => {
            if (following) return makeRequest.delete(`/relationships?userId=${params.id}`)
            return makeRequest.post('/relationships', { userId: params.id })
        },
        onSuccess: () => {
            // Invalidate and refetch
            queryClient.invalidateQueries({ queryKey: ['relationship', 'suggestions'] })
        },
    })

    const handleFollow = () => {
        mutation.mutate(relationshipData.includes(currentUser.id))
    }


    return (
        <div className='profile'>
            {isLoading ? "Loading..." : <div className="profile">
                <div className="images">
                    <img src={`${import.meta.env.VITE_BASE_URL_FRONT}/public/upload/${data.coverPic}`} alt="" className='cover' />
                    <img src={`${import.meta.env.VITE_BASE_URL_FRONT}/public/upload/${data.profilePic}`} alt="" className='profilePic' />
                </div>
                <div className="profileContainer">
                    <div className="uInfo">
                        <span>{data.name}</span>
                        <div className="info">
                            <div className="item">
                                <PlaceIcon />
                                <span>{data.city}</span>
                            </div>
                            <div className="item">
                                <LanguageIcon />
                                <span>{data.website}</span>
                            </div>
                            <div className="item">
                                <EmailOutlinedIcon />
                                <MoreVertIcon />
                            </div>
                        </div>
                        <div className="social">
                            <a href="http://facebook.com">
                                <FacebookTwoToneIcon fontSize="large" />
                            </a>
                            <a href="http://facebook.com">
                                <InstagramIcon fontSize="large" />
                            </a>
                            <a href="http://facebook.com">
                                <TwitterIcon fontSize="large" />
                            </a>
                            <a href="http://facebook.com">
                                <LinkedInIcon fontSize="large" />
                            </a>
                            <a href="http://facebook.com">
                                <PinterestIcon fontSize="large" />
                            </a>
                        </div>

                        {relationshipIsLoading ? "Loading.." : currentUser.id === parseInt(params.id) ? (
                            <button onClick={() => setOpenUpdate(true)}>Update</button>
                        ) : (
                            <button onClick={handleFollow}>{relationshipData.includes(currentUser.id) ? "Following" : "Follow"}</button>
                        )}
                    </div>
                    <Posts userId={params.id} />
                </div>
            </div>}
            {openUpdate && <Update setOpenUpdate={setOpenUpdate} user={data} />}
        </div>
    )
}

export default Profile