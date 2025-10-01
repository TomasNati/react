import { type CSSProperties } from "react";
import { useForm, type SubmitHandler } from "react-hook-form"
import type { Stories } from "./api";

function getRandomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

interface StoryFormProps {
    initStory?: Stories;
    onStorySubmit: (story: Stories, isAdd: boolean) => void;
    onCancel: () => void;
}

export const StoryForm = ({ initStory, onStorySubmit, onCancel }: StoryFormProps) => {

    const { register, handleSubmit } = useForm<Stories>({
        defaultValues: initStory ?? ({
            objectID: getRandomInt(1, 1000000),
            author: '',
            url: '',
            num_comments: 0,
            points: 0,
            title: ''
        })
    })

    const stringStyles: CSSProperties = {
        width: '300px'
    }

    const numberStyles: CSSProperties = {
        width: '40px'
    }

    const onSubmit: SubmitHandler<Stories> = (data) => {
        onStorySubmit(data, !initStory)
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div style={{ display: "flex", flexDirection: 'column', gap: 4 }}>
                <label htmlFor="title">Title:
                    <input {...register('title')} style={stringStyles} id="title" />
                </label>
                <label htmlFor="url">URL:
                    <input id="url" {...register('url')} style={stringStyles} />
                </label>
                <label htmlFor="author">Author(s):
                    <input id="author" {...register('author')} style={stringStyles} />
                </label>
                <label htmlFor="num_comments">Num Comments:
                    <input type="number" id='num_comments' {...register('num_comments')} style={numberStyles} />
                </label>
                <label htmlFor="points">Poits:
                    <input type="number" id="points" {...register('points')} style={numberStyles} />
                </label>
                <footer style={{ display: "flex", gap: 4 }}>
                    <button type="submit" style={{ width: 'fit-content' }}>
                        Submit
                    </button>
                    <button onClick={() => onCancel()} style={{ width: 'fit-content' }}>
                        Cancel
                    </button>
                </footer>
            </div>
        </form>
    )

}