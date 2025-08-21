import {
  useState,
  useEffect,
  type Dispatch,
  type SetStateAction,
  useReducer,
  useCallback,
  type FormEvent,
  useRef,
  RefObject,
  useMemo
} from 'react'
import './App.css'
import { addAsyncStory, deleteAsyncStories, editAsyncStory, getAsyncStories as fakeGetAsyncStories } from './api-fake';
import { type Stories, getAsyncStories } from './api';
import { StoryForm } from './Form'
import { storiesReducer } from './reducer';
import { SimpleForm } from './SimpleForm'
import Check from './check.svg?react';
import React from 'react';

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

const useStorageState = (key: string, initialValue: StorageValueType, isMounted: RefObject<boolean>):
  [StorageValueType, Dispatch<SetStateAction<StorageValueType>>] => {
  const [value, setValue] = useState<StorageValueType>(localStorage.getItem(key) || initialValue)

  useEffect(() => {
    if (!isMounted.current) {
        isMounted.current = true;
    } else {
        localStorage.setItem(key, value)
        console.log(`%cuseStorageState changed to: ${value}`, 'font-weight: bold; color: green;')
    }
  }, [value, key, isMounted])

  return [value, setValue]
}

const ItemList = ({ url, title, author, num_comments, points, onRemoveClicked, onEditClicked }: ItemListProps) => {
  return (
    <li className='item'>
      <span style={{width: '35%'}}><a href={url} target="_blank">{title}</a></span>
      <span style={{width: '25%'}}><p>Authors: {author}</p></span>
      <span style={{width: '15%'}}><p>Number of comments: {num_comments}</p></span>
      <span style={{width: '15%'}}><p>Points: {points}</p></span>
      <span style={{width: '10%'}}>
        <button onClick={onRemoveClicked}>
            <Check height="18px" width="18px" />
        </button>
        <button onClick={onEditClicked}>Edit</button>
      </span>
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
const List = React.memo(({ list, onRemoveClicked, onEditClicked }: ListProps) => {
  // rest operator on the left, {objectID,...item}, destructure objectID current element in the list, 
  //   assigning the rest of the properties to a new object, 'item'.
  // spread operator on the right, ...item, creates key=value pairs for each operator in item object
  console.log('B:List')
  return list.map(({ objectID, ...item }) => (
    <ItemList
      onRemoveClicked={() => onRemoveClicked(objectID)}
      onEditClicked={() => onEditClicked(objectID)}
      {...item}
    />
  ))
})


const getSumComments = (stories: Stories[]) => {
    console.log('C');
    return stories.reduce(
        (result, value) => result + value.num_comments,
        0
    );
};

const App = () => {
  const isMounted = useRef(false)
  const [searchTerm, setSearchTerm] = useStorageState(searchKey, "React", isMounted)
  
  const [triggerCount, setTriggerCount] = useState(0)
  const [usarApiFake, setUsarApiFake] = useState(false)
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
      const result = usarApiFake ? await fakeGetAsyncStories() : await getAsyncStories(searchTerm)
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
    console.log('Fetching stories')
    fetchStories()
  }, [fetchStories])

  const handleSearchTermChanged = (newTerm: string) => {
    setSearchTerm(newTerm)
  }

  const handleRemoveStory = useCallback(async (objectID: number) => {
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
  }, [stories])

  const handleEditClicked = useCallback((objectIDToEdit: number) => {
    const story = stories.find(({ objectID }) => objectID == objectIDToEdit)
    if (!story) return;
    dispatchStories({ type: 'EDIT_STORY_START', payload: story })
  }, [stories])

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

  const handleTriggerSearch = (event: FormEvent) => {
    setTriggerCount((count: number) => count + 1)
    event.preventDefault();
  }

   const sumComments = useMemo(() => getSumComments(stories), [stories]);

  console.log('B:App')

  return (
    <div className="app-container">
      <h1>My Hacker Stories 2 with {sumComments} comments</h1>
      <SimpleForm
        handleTriggerSearch={handleTriggerSearch}
        handleSearchTermChanged={handleSearchTermChanged}
        searchTerm={searchTerm}
      />
      <hr />
      <div style={{
        marginTop: '5px'
      }}>
        <button onClick={handleAddClicked}>Add Story</button>
        <input type='checkbox' checked={usarApiFake} onChange={(event) => setUsarApiFake(event.target.checked)} />
        <span>Usar API fake</span>
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
