import './post.scss'
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import TextsmsOutlinedIcon from "@mui/icons-material/TextsmsOutlined";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { Link } from 'react-router-dom';
import Comments from '../comments/Comments'
import { useState, useContext } from 'react'
import moment from 'moment'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { makeRequest } from "../../axios.js";
import { AuthContext } from '../../context/authContext';

function Post({ post }) {
    const [isCommentsOpen, setIsCommentsOpen] = useState(false)
    const [menuOpen, setMenuOpen] = useState(false)
    const { currentUser } = useContext(AuthContext)

    const { isLoading, error, data } = useQuery(
        ['likes', post.id],
        () => makeRequest.get(`/likes?postId=${post.id}`).then(res => { return res.data })
    )

    const queryClient = useQueryClient()
    // const commentsData = queryClient.getQueryData(['comments', post.id]);

    const { data: commentsData } = useQuery(
        ['comments', post.id],
        () => makeRequest.get(`/comments?postId=${post.id}`)
            .then(res => {
                return res.data
            })
    )

    const mutation = useMutation({
        mutationFn: (liked) => {
            if (liked) return makeRequest.delete(`/likes?postId=${post.id}`)
            return makeRequest.post('/likes', { postId: post.id })
        },
        onSuccess: () => {
            // Invalidate and refetch
            queryClient.invalidateQueries({ queryKey: ['likes'] })
        },
    })

    const deleteMutation = useMutation({
        mutationFn: (postId) => {
            return makeRequest.delete(`/posts/${postId}`)
        },
        onSuccess: () => {
            // Invalidate and refetch
            queryClient.invalidateQueries({ queryKey: ['posts'] })
        },
    })


    const handleLike = () => {
        mutation.mutate(data.includes(currentUser.id))
    }

    const handleDelete = () => {
        deleteMutation.mutate(post.id)
    }

    return (
        <div className='post'>
            <div className="container">
                <div className="user">
                    <div className="userInfo">
                        <img src={`/public/upload/${post.profilePic}`} alt="" />
                        <div className="details">
                            <Link to={`/profile/${post.userId}`} style={{ textDecoration: "none", color: "inherit" }}>
                                <span>{post.name}</span>
                            </Link>
                            <div className="date">{moment(post.createdAt).fromNow()}</div>
                        </div>
                    </div>
                    <MoreHorizIcon style={{ cursor: "pointer" }} onClick={() => setMenuOpen(menu => !menu)} />
                    {menuOpen && post.userId === currentUser.id && <button onClick={handleDelete}>Delete</button>}
                </div>
                <div className="content">
                    <p>{post.desc}</p>
                    <img src={`/public/upload/${post.img}`} alt="" />
                </div>
                <div className="info">
                    <div className="item">
                        {isLoading ? "Loading.." : data.includes(currentUser.id) ? <FavoriteOutlinedIcon style={{ color: "red" }} onClick={handleLike} /> : <FavoriteBorderOutlinedIcon onClick={handleLike} />}
                        {data?.length} Likes
                    </div>
                    <div className="item" onClick={() => setIsCommentsOpen(prev => !prev)}>
                        <TextsmsOutlinedIcon />
                        {commentsData?.length} Comments
                    </div>
                    <div className="item">
                        <ShareOutlinedIcon />
                        Share
                    </div>
                </div>
                {isCommentsOpen && <Comments postId={post.id} />}
            </div>
        </div>
    )
}

export default Post