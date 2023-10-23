import './storygroup.scss';
import React, { useState } from 'react';
import Story from '../story/Story';

const Storygroup = ({ stories }) => {
    const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
    const [controlsDisplay, setControlsDisplay] = useState(false);

    const nextStory = () => {
        setCurrentStoryIndex(prev => (prev + 1) % stories.length);
    }

    const prevStory = () => {
        setCurrentStoryIndex(prev => (prev - 1 + stories.length) % stories.length);
    }

    return (
        <div className="story-groups" onMouseEnter={() => setControlsDisplay(true)} onMouseLeave={() => setControlsDisplay(false)} >
            {stories.length > 0 && (
                <Story story={stories[currentStoryIndex]} />
            )}
            {stories.length > 1 && (
                <div className="controls" style={{ display: controlsDisplay ? "" : "none" }}>
                    <button onClick={prevStory}>&#60;</button>
                    <button onClick={nextStory}>&#62;</button>
                </div>
            )}
        </div>
    );
}

export default Storygroup;