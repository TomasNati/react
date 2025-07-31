import {
  useState,
  type ChangeEvent,
  type FocusEvent,
  useEffect,
  type Dispatch,
  type SetStateAction,
  type HTMLInputTypeAttribute,
  useRef,
  useReducer
} from 'react'
import './App.css'
import { addAsyncStory, deleteAsyncStories, editAsyncStory, getAsyncStories, type Stories } from './api';
import { StoryForm } from './Form'
import { storiesReducer } from './reducer';

const searchKey = 'search';

type StorageValueType = string;

interface ItemListProps {
  url: string;
  title: string;
  author: string;
  num_comments: number;
  points: number;
  onRemoveClicked: () => void;
  onEditClicked: () => void;
}

const useStorageState = (key: string, initialValue: StorageValueType):
  [StorageValueType, Dispatch<SetStateAction<StorageValueType>>] => {
  const [value, setValue] = useState<StorageValueType>(localStorage.getItem(key) || initialValue)

  useEffect(() => {
    localStorage.setItem(key, value)
    console.log(`%cuseStorageState changed to: ${value}`, 'font-weight: bold; color: green;')
  }, [value, key])

  return [value, setValue]
}

const ItemList = ({ url, title, author, num_comments, points, onRemoveClicked, onEditClicked }: ItemListProps) => {
  console.log(`Item with url ${url} renders`)
  return (
    <li>
      <a href={url} target="_blank">{title}</a>
      <p>Authors: {author}</p>
      <p>Number of comments: {num_comments}</p>
      <p>Points: {points}</p>
      <div>
        <button onClick={onRemoveClicked}>Remove</button>
        <button onClick={onEditClicked}>Edit</button>
      </div>
      <br />
      <br />
    </li>
  )
}

interface ListProps {
  list: Stories[];
  onRemoveClicked: (objectID: number) => void
  onEditClicked: (objectID: number) => void;
}
const List = ({ list, onRemoveClicked, onEditClicked }: ListProps) => {
  console.log('List renders')
  // rest operator on the left, {objectID,...item}, destructure objectID current element in the list, 
  //   assigning the rest of the properties to a new object, 'item'.
  // spread operator on the right, ...item, creates key=value pairs for each operator in item object
  return list.map(({ objectID, ...item }) => (
    <ItemList
      key={objectID}
      onRemoveClicked={() => onRemoveClicked(objectID)}
      onEditClicked={() => onEditClicked(objectID)}
      {...item}
    />
  ))
}

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

  console.log('InputWithLabel renders')
  console.log('Autofocus is:', autofocus)

  return (
    <>
      <label htmlFor={id}>{children} </label>
      <input
        type={type || 'text'}
        id={id} value={value}
        onChange={onChangeHandler}
        onBlur={onBlurHandler}
        ref={inputRef}
      // autoFocus={autofocus}   . Property commented out to show how to use useRef hook instead
      />
      <p>Entered value: {value}</p>
    </>
  )
}

const App = () => {
  const [searchTerm, setSearchTerm] = useStorageState(searchKey, "React")
  const [storiesState, dispatchStories] = useReducer(storiesReducer, { stories: [], asyncMessage: '' })
  const [asyncMessage, setAsyncMessage] = useState<string>('')
  const [storyToEdit, setStoryToEdit] = useState<Stories | undefined>()
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
        try{
            setAsyncMessage('Loading data...')
            const result = await getAsyncStories()
            dispatchStories({ type: 'SET_STORIES', payload: result.data.stories })
            setAsyncMessage('')
        } catch (error: unknown) {
            console.error('Error fetching stories:', error)
            setAsyncMessage('There was an error fetching the stories')
            setTimeout(() => {
                setAsyncMessage('')
            }, 2000)
        }
    }
    fetchData()
  }, [])

  const { stories } = storiesState

  const filteredStories = stories.filter(({ title }) => title.toLowerCase().includes(searchTerm.toLowerCase()))

  const handleSearchTermChanged = (newTerm: string) => {
    setSearchTerm(newTerm)
  }

  const handleRemoveStory = async (objectID: number) => {
    try {
      setAsyncMessage('Deleting Story and refreshing')
      const { data: { stories: newStories } } = await deleteAsyncStories(objectID, stories)
      setAsyncMessage('')
      dispatchStories({ type: 'SET_STORIES', payload: newStories })
    } catch {
      setAsyncMessage('There was an error deleting the Story')
      setTimeout(() => {
        setAsyncMessage('')
      }, 2000)
    }
  }

  const handleEditClicked = (objectIDToEdit: number) => {
    const story = stories.find(({ objectID }) => objectID == objectIDToEdit)
    if (!story) return;
    setStoryToEdit(story)
    setShowForm(true)
  }

  const handleAddClicked = () => {
    setStoryToEdit(undefined)
    setShowForm(true)
  }

  const handleSubmitForm = async (story: Stories, isAdd = false) => {
    try {
      setAsyncMessage(`${isAdd ? 'Adding' : 'Updating'} Story and refreshing`)
      const { data: { stories: newStories } } = isAdd
        ? await addAsyncStory(story, stories)
        : await editAsyncStory(story, stories)
      setAsyncMessage('')
      dispatchStories({ type: 'SET_STORIES', payload: newStories })
    } catch {
      setAsyncMessage(`There was an error ${isAdd ? 'adding' : 'updating'} the Story`)
      setTimeout(() => {
        setAsyncMessage('')
      }, 2000)
    } finally {
      setStoryToEdit(undefined)
      setShowForm(false)
    }
  }

  const handleCancelForm = () => {
    setStoryToEdit(undefined)
    setShowForm(false)
  }

  return (
    <div className="app-container">
      <h1>My Hacker Stories 2</h1>
      <InputWithLabel
        id="search-term"
        value={searchTerm}
        type='text'
        onValueChanged={handleSearchTermChanged}
        autofocus
      >
        <strong>Search Term:</strong>
      </InputWithLabel>
      <hr />
      <button onClick={handleAddClicked}>Add Story</button>
      <hr />
      {
        showForm ? (
          <>
            <StoryForm initStory={storyToEdit} onStorySubmit={handleSubmitForm} onCancel={handleCancelForm} />
            <hr />
          </>) : null
      }
      {asyncMessage ? <p>{asyncMessage}</p>
        : <ul>
          <List list={filteredStories} onRemoveClicked={handleRemoveStory} onEditClicked={handleEditClicked} />
        </ul>
      }
    </div>
  )
}

export default App
