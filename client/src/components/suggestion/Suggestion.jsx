import './suggestion.scss'
import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { makeRequest } from "../../axios.js";
// import { AuthContext } from '../../context/authContext';

export default function Suggestion() {
    const [userToFollow, setUserToFollow] = useState(null)
    const { isLoading: relationshipIsLoading, data: relationshipData } = useQuery(
        {
            queryKey: ["relationship", userToFollow, "story"],
            queryFn: () => makeRequest.get(`/relationships?followedUserId=${userToFollow}`).then(res => { return res.data })
        })

    const queryClient = useQueryClient()

    const mutation = useMutation({
        mutationFn: (following) => {
            if (following) return makeRequest.delete(`/relationships?userId=${userToFollow}`)
            return makeRequest.post('/relationships', { userId: userToFollow })
        },
        onSuccess: () => {
            // Invalidate and refetch
            queryClient.invalidateQueries({ queryKey: ['suggestions', 'relationship', 'story'] })
        },
    })

    const { isLoading, error, data } = useQuery(
        ['suggestions', 'relationship', 'story'],
        () => makeRequest.get(`/users/suggestions`).then(res => { return res.data })
    )

    const suggestionElements = data?.map(user =>
    (
        <div className="user" key={user.id}>
            <div className="userInfo">
                <img src={`../public/upload/${user.profilePic}`} alt="" />
                <span>{user.name}</span>
            </div>
            <div className="buttons">
                <button onClick={() => {
                    setUserToFollow(user.id)
                    mutation.mutate(relationshipData.includes(user.id))
                }}>follow</button>
            </div>
        </div>
    )
    ).slice(0, 3)

    return (
        <div className="suggestion">
            {isLoading ? "Loading..." : suggestionElements.length > 0 ? suggestionElements : "No users available for you :("}
        </div>
    )
}
