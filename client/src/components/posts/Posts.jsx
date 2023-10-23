import Post from "../post/Post.jsx";
import './posts.scss'
import { useState } from "react";
import { useQuery } from '@tanstack/react-query'
import { makeRequest } from "../../axios.js";

function Posts({ userId }) {
    const { isLoading, error, data } = useQuery(
        ['posts', userId],
        () => makeRequest.get(`/posts?userId=${userId}`).then(res => { return res.data })
    )
    return (
        <div className='posts'>
            {error ? `Error ${error.message} happend!!!` : isLoading ? "Loading..." :
                data?.map(post => (
                    <Post
                        post={post}
                        key={post.id}
                    />
                ))}
        </div>
    )
}

export default Posts