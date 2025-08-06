import {
  useState,
  type ChangeEvent,
  type FocusEvent,
  useEffect,
  type Dispatch,
  type SetStateAction,
  type HTMLInputTypeAttribute,
  useRef,
  useReducer,
  useCallback
} from 'react'
import './App.css'
import { addAsyncStory, deleteAsyncStories, editAsyncStory } from './api-fake';
import { type Stories, getAsyncStories } from './api';
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
  const [triggerCount, setTriggerCount] = useState(0)
  const [storiesState, dispatchStories] = useReducer(storiesReducer, {
    stories: [],
    asyncMessage: '',
    storyToEdit: undefined,
    showForm: false
  })

  const { stories, asyncMessage, storyToEdit, showForm } = storiesState


  const fetchStories = useCallback(async () => {
    try {
      if (searchTerm == '') return
      dispatchStories({ type: 'FETCH_STORIES_START', payload: 'Loading data...' })
      const result = await getAsyncStories(searchTerm)
      dispatchStories({ type: 'FETCH_STORIES_COMPLETE', payload: result.data.stories })
    } catch (error: unknown) {
      console.error('Error fetching stories:', error)
      dispatchStories({ type: 'SET_ERROR', payload: 'There was an error fetching the stories' })
      setTimeout(() => {
        dispatchStories({ type: 'CLEAR_ERROR', payload: undefined })
      }, 2000)
    }
  }, [triggerCount])

  useEffect(() => {
    fetchStories()
  }, [fetchStories])

  const handleSearchTermChanged = (newTerm: string) => {
    setSearchTerm(newTerm)
  }

  const handleRemoveStory = async (objectID: number) => {
    try {
      dispatchStories({ type: 'DELETE_STORY_START', payload: 'Deleting Story and refreshing' })
      const { data: { stories: newStories } } = await deleteAsyncStories(objectID, stories)
      dispatchStories({ type: 'DELETE_STORY_COMPLETE', payload: newStories })
    } catch {
      dispatchStories({ type: 'SET_ERROR', payload: 'There was an error deleting the story' })
      setTimeout(() => {
        dispatchStories({ type: 'CLEAR_ERROR', payload: undefined })
      }, 2000)
    }
  }

  const handleEditClicked = (objectIDToEdit: number) => {
    const story = stories.find(({ objectID }) => objectID == objectIDToEdit)
    if (!story) return;
    dispatchStories({ type: 'EDIT_STORY_START', payload: story })
  }

  const handleAddClicked = () => {
    dispatchStories({ type: 'ADD_STORY_START', payload: undefined })
  }

  const handleSubmitForm = async (story: Stories, isAdd = false) => {
    try {
      dispatchStories({
        type: isAdd ? 'ADD_STORY_PROCESSING' : 'EDIT_STORY_PROCESSING',
        payload: `${isAdd ? 'Adding' : 'Updating'} Story and refreshing`
      })
      const { data: { stories: newStories } } = isAdd
        ? await addAsyncStory(story, stories)
        : await editAsyncStory(story, stories)
      dispatchStories({
        type: isAdd ? 'ADD_STORY_COMPLETE' : 'EDIT_STORY_COMPLETE',
        payload: newStories
      })
    } catch {
      dispatchStories({ type: 'SET_ERROR', payload: `There was an error ${isAdd ? 'adding' : 'updating'} the Story` })
      setTimeout(() => {
        dispatchStories({ type: 'CLEAR_ERROR', payload: undefined })
      }, 2000)
    } finally {
      dispatchStories({ type: 'CLOSE_STORY_FORM', payload: undefined })
    }
  }

  const handleCancelForm = () => {
    dispatchStories({ type: 'CLOSE_STORY_FORM', payload: undefined })
  }

  const handleTriggerSearch = () => setTriggerCount((count: number) => count + 1)

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
      <div style={{
        display: 'flex',
        gap: 3
      }}>
        <button onClick={handleAddClicked}>Add Story</button>
        <button onClick={handleTriggerSearch} disabled={!searchTerm}>Search</button>
      </div>
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
          <List list={stories} onRemoveClicked={handleRemoveStory} onEditClicked={handleEditClicked} />
        </ul>
      }
    </div>
  )
}

export default App
