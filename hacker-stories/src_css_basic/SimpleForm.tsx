import {
    useEffect,
    useRef,
    type FocusEvent,
    type ChangeEvent,
    type FormEvent,
    type HTMLInputTypeAttribute,
    memo
} from "react"

interface InputWithLabelProps {
    value: string;
    id: string;
    type?: HTMLInputTypeAttribute | undefined;
    autofocus?: boolean;
    onValueChanged: (term: string) => void
    children?: React.ReactNode;
}
export const InputWithLabel = ({ id, value, type, onValueChanged, children, autofocus }: InputWithLabelProps) => {

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
            <label htmlFor={id} className="label">{children} </label>
            <input
                type={type || 'text'}
                id={id} value={value}
                onChange={onChangeHandler}
                onBlur={onBlurHandler}
                ref={inputRef}
                className="input"
            // autoFocus={autofocus}   . Property commented out to show how to use useRef hook instead
            />
            <p className="entered-value">Entered value: {value}</p>
        </>
    )
}

interface SimpleFormProps {
    handleTriggerSearch: (event: FormEvent) => void;
    handleSearchTermChanged: (newTerm: string) => void;
    searchTerm: string;
}
export const SimpleForm = memo(({ handleTriggerSearch, handleSearchTermChanged, searchTerm }: SimpleFormProps) => {
    console.log('D: SimpleForm')
    return (
        <form onSubmit={handleTriggerSearch} className="search-form">
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
                <button type='submit' disabled={!searchTerm} className="button button_large">Search</button>
            </div>
        </form>
    )
});
