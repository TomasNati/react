import { useState, type CSSProperties } from "react";
import type { Stories } from "./api";

function getRandomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

interface StoryFormProps {
    initStory?: Stories;
    onStorySubmit: (story: Stories) => void;
    onCancel: () => void;
}

export const StoryForm = ({ initStory, onStorySubmit, onCancel }: StoryFormProps) => {
    const [story, setStory] = useState<Stories>(initStory ?? ({
        objectID: getRandomInt(1, 1000000),
        author: '',
        url: '',
        num_comments: 0,
        points: 0,
        title: ''
    }))

    const handleTitleChange = (title: string) => setStory({ ...story, title })
    const handleUrlChange = (url: string) => setStory({ ...story, url })
    const handleAuthorChange = (author: string) => setStory({ ...story, author })
    const handleNumCommentsChange = (num_comments_string: string) => {
        const num_comments = Number.parseInt(num_comments_string)
        if (isNaN(num_comments)) return;
        setStory({ ...story, num_comments })
    }
    const handlePointsChange = (points_string: string) => {
        const points = Number.parseInt(points_string)
        if (isNaN(points)) return;
        setStory({ ...story, points })
    }

    const stringStyles: CSSProperties = {
        width: '300px'
    }

    const numberStyles: CSSProperties = {
        width: '30px'
    }

    return (
        <div style={{ display: "flex", flexDirection: 'column', gap: 4 }}>
            <label htmlFor="title">Title:
                <input
                    id="title"
                    type="text"
                    value={story.title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    style={stringStyles}
                />
            </label>
            <label htmlFor="url">URL:
                <input
                    id="url"
                    value={story.url}
                    onChange={(e) => handleUrlChange(e.target.value)}
                    style={stringStyles}
                />
            </label>
            <label htmlFor="author">Author(s):
                <input
                    id="author"
                    value={story.author}
                    onChange={(e) => handleAuthorChange(e.target.value)}
                    style={stringStyles}
                />
            </label>
            <label htmlFor="num_comments">Num Comments:
                <input
                    type="number"
                    value={story.num_comments}
                    onChange={(e) => handleNumCommentsChange(e.target.value)}
                    style={numberStyles}
                />
            </label>
            <label htmlFor="points">Poits:
                <input
                    type="number"
                    value={story.points}
                    onChange={(e) => handlePointsChange(e.target.value)}
                    style={numberStyles}
                />
            </label>
            <footer style={{ display: "flex", gap: 4 }}>
                <button onClick={() => onStorySubmit(story)} style={{ width: 'fit-content' }}>
                    Submit
                </button>
                <button onClick={() => onCancel()} style={{ width: 'fit-content' }}>
                    Cancel
                </button>
            </footer>
        </div>
    )

}