import './stories.scss'
import { useContext, useState } from 'react';
import { AuthContext } from '../../context/authContext';
import { makeRequest } from "../../axios";
import { useQuery } from '@tanstack/react-query'
import Addstory from '../addstory/Addstory'
import Storygroup from '../storygroup/Storygroup'

function Stories() {
    const [openStoryModal, setOpenStoryModal] = useState(false)
    const { isLoading, error, data } = useQuery(
        ['story'],
        () => makeRequest.get(`/stories`).then(res => { return res.data })
    )

    const { currentUser } = useContext(AuthContext)

    return (
        <div className='stories'>
            <div className="story">
                <img src={`../public/upload/${currentUser.profilePic}`} alt="" />
                <span>{currentUser.name}</span>
                <button onClick={() => setOpenStoryModal(prev => !prev)}>+</button>
            </div>
            {openStoryModal && <Addstory setOpenStoryModal={setOpenStoryModal} />}
            {isLoading ? "Loading stories..." : (
                <div className="story-group">
                    {Array.from(new Set(data.map(story => story.userId))).slice(0, 3).map(authorId => {
                        const authorStories = data.filter(story => story.userId === authorId);
                        return <Storygroup key={authorId} stories={authorStories} />;
                    })}
                </div>
            )}
        </div>
    )
}

export default Stories