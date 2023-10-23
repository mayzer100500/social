// import './story.scss'
// import { useRef, useState } from "react";

// function Story({ story, isExpanded, onAuthorClick }) {
//     const videoRef = useRef()
//     const [play, setPlay] = useState(false)
//     console.log(play)
//     const handleLoadedData = () => {
//         const video = videoRef.current;
//         if (play) {
//             video.play();
//         } else {
//             video.pause(); // Пауза при покидании
//         }
//     };

//     const fileType = () => {
//         const extension = story.img.split('.').pop(); // Получаем расширение файла
//         if (extension === 'jpg' || extension === 'png' || extension === 'avif' || extension === 'jpeg') {
//             return 'image';
//         } else if (extension === 'mp4' || extension === 'avi') {
//             return 'video';
//         } else {
//             return 'other';
//         }
//     }

//     return (
//         <div className="story"
//             onMouseEnter={() => {
//                 setPlay(false)
//             }}
//             onMouseLeave={() => {
//                 setPlay(true)
//             }}>
//             {fileType() === 'image' ? (
//                 <img src={`../../public/upload/${story.img}`} alt="" />
//             ) : (
//                 <video
//                     ref={videoRef}
//                     src={`../../public/upload/${story.img}`}
//                     muted="muted"
//                     onLoadedData={handleLoadedData}
//                     controls
//                 >
//                     Your browser does not support the video tag.
//                 </video>
//             )}
//             <span>{story.name}</span>
//         </div>
//     );
// }

// export default Story

import { useRef } from "react";

function Story({ story }) {
    const videoRef = useRef();

    const handleMouseEnter = (e) => {
        e.stopPropagation()
        const video = videoRef.current;
        video.play();
    };

    const handleMouseLeave = (e) => {
        const video = videoRef.current;
        video.pause();
        video.currentTime = 0;
    };

    const fileType = () => {
        const extension = story.img.split('.').pop(); // Получаем расширение файла
        if (extension === 'jpg' || extension === 'png' || extension === 'avif' || extension === 'jpeg') {
            return 'image';
        } else if (extension === 'mp4' || extension === 'avi') {
            return 'video';
        } else {
            return 'other';
        }
    }

    return (
        <div className="story" >
            {fileType() === 'image' ? (
                <img src={`../../public/upload/${story.img}`} alt="" />
            ) : (
                <video
                    ref={videoRef}
                    src={`../../public/upload/${story.img}`}
                    muted="muted"
                    preload="metadata"
                    poster={`../../public/upload/${story.thumbnail}`}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                >
                    Your browser does not support the video tag.
                </video>
            )}
            <span>{story.name}</span>
        </div>
    );
}

export default Story;