import {
    useEffect,
    useRef,
    type FocusEvent,
    type ChangeEvent,
    type FormEvent,
    type HTMLInputTypeAttribute
} from "react"
import styles from './App.module.css'
import clsx from 'clsx'

interface InputWithLabelProps {
    value: string;
    id: string;
    type?: HTMLInputTypeAttribute | undefined;
    autofocus?: boolean;
    onValueChanged: (term: string) => void
    children?: React.ReactNode;
}
const InputWithLabel = ({ id, value, type, onValueChanged, children, autofocus }: InputWithLabelProps) => {

    const inputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        if (autofocus && inputRef.current) {
            inputRef.current.focus()
        }
    }, [inputRef, autofocus])

    const onChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        onValueChanged(event.target.value)
    }

    const onBlurHandler = (event: FocusEvent<HTMLInputElement>) => {
        console.log(event)
    }

    return (
        <>
            <label htmlFor={id} className={styles.label}>{children} </label>
            <input
                type={type || 'text'}
                id={id} value={value}
                onChange={onChangeHandler}
                onBlur={onBlurHandler}
                ref={inputRef}
                className={styles.input}
            // autoFocus={autofocus}   . Property commented out to show how to use useRef hook instead
            />
            <p>Entered value: {value}</p>
        </>
    )
}

interface SimpleFormProps {
    handleTriggerSearch: (event: FormEvent) => void;
    handleSearchTermChanged: (newTerm: string) => void;
    searchTerm: string;
}
export const SimpleForm = ({ handleTriggerSearch, handleSearchTermChanged, searchTerm }: SimpleFormProps) => {

    return (
        <form onSubmit={handleTriggerSearch} className={styles.searchForm}>
            <InputWithLabel
                id="search-term"
                value={searchTerm}
                type='text'
                onValueChanged={handleSearchTermChanged}
                autofocus
            >
                <strong>Search Term:</strong>
            </InputWithLabel>
            <div style={{
                display: 'flex',
                gap: 3
            }}>
                <button type='submit' disabled={!searchTerm} 
                className={clsx(styles.button, styles.buttonLarge)}>Search</button>
            </div>
        </form>
    )
}
