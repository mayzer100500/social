import "./comments.scss"
import { useContext, useRef } from 'react'
import { Link } from 'react-router-dom'
import { AuthContext } from '../../context/authContext';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { makeRequest } from "../../axios.js";
import moment from 'moment'

function Comments({ postId }) {
    const commentRef = useRef()
    const { currentUser } = useContext(AuthContext)
    const queryClient = useQueryClient()

    const { isLoading, error, data } = useQuery(
        ['comments', postId],
        () => makeRequest.get(`/comments?postId=${postId}`)
            .then(res => {
                return res.data
            })
    )

    const mutation = useMutation({
        mutationFn: (newComment) => makeRequest.post('/comments', newComment),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['comments'] })
        },
    })

    const handleClick = async (e) => {
        e.preventDefault()
        const dataForm = {
            desc: commentRef.current.value,
            postId
        }
        mutation.mutate(dataForm)
        commentRef.current.value = ""
    }

    return (
        <div className="comments">
            <div className="write">
                <img src={`../public/upload/${currentUser.profilePic}`} alt="" />
                <input type="text" ref={commentRef} placeholder="Write a comment..." />
                <button onClick={(e) => handleClick(e)}>Send</button>
            </div>
            {isLoading
                ?
                "Loading..."
                :
                data
                    ?
                    data.map(comment => (
                        <div className="comment" key={comment.id}>
                            <img src={`../public/upload/${comment.profilePic}`} alt="" />
                            <div className="info">
                                <Link to={`/profile/${comment.userId}`}>{comment.name}</Link>
                                <p>{comment.desc}</p>
                            </div>
                            <span className="date">{moment(comment.createdAt).fromNow()}</span>
                        </div>
                    ))
                    :
                    "No comments yet!!"}
        </div>
    )
}

export default Comments