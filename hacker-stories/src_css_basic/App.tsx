import {
  useState,
  useEffect,
  type Dispatch,
  type SetStateAction,
  useReducer,
  useCallback,
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
import { List } from './List';
import { PagerOptions, type PagerOptionValues } from './PagerOptions'
import { Pager } from './Pager'

const searchKey = 'search';

type StorageValueType = string;


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


const getSumComments = (stories: Stories[]) => {
  console.log('C: getSumComments');
  return stories.reduce(
    (result, value) => result + value.num_comments,
    0
  );
};

const App = () => {
  const isMounted = useRef(false)
  const [searchTerm, setSearchTerm] = useStorageState(searchKey, "React", isMounted)
  const [currentPageNumber, setCurrentPageNumber] = useState(0)
  const [currentPageTotal, setCurrentPageTotal] = useState(0)
  const [pagerOption, setPagerOptions] = useState<PagerOptionValues>('Get More (manual)')

  const [triggerCount, setTriggerCount] = useState(0)
  const [usarApiFake, setUsarApiFake] = useState(false)
  const [storiesState, dispatchStories] = useReducer(storiesReducer, {
    stories: [],
    unsortedStories: [],
    asyncMessage: '',
    storyToEdit: undefined,
    showForm: false,
    sortStatus: [
      { field: 'title' },
      { field: 'author' },
      { field: 'num_comments' },
      { field: 'points' },
    ]
  })

  const { stories, asyncMessage, storyToEdit, showForm, sortStatus } = storiesState


  const fetchStories = useCallback(async () => {
    try {
      if (searchTerm == '') return
      dispatchStories({ type: 'FETCH_STORIES_START', payload: 'Loading data...' })
      const result = usarApiFake ? await fakeGetAsyncStories() : await getAsyncStories(searchTerm, currentPageNumber)
      setCurrentPageTotal(result.totalPages)
      dispatchStories({ type: 'FETCH_STORIES_COMPLETE', payload: {
        data: result.data,
        page: result.page,
        pagerType: pagerOption
      } })
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

  const handleSearchTermChanged = useCallback((newTerm: string) => {
    setSearchTerm(newTerm)
  }, []);

  const handleRemoveStory = useCallback(async (objectID: number) => {
    try {
      dispatchStories({ type: 'DELETE_STORY_START', payload: 'Deleting Story and refreshing' })
      const { data: newStories } = await deleteAsyncStories(objectID, stories)
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
      const { data: newStories } = isAdd
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

  const handleTriggerSearch = useCallback(() => {
    setCurrentPageNumber(0)
    setTriggerCount((count: number) => count + 1)
  }, []);

  const handleGetNewPage = (page: number) => {
    setCurrentPageNumber(page)
    setTriggerCount((count: number) => count + 1)
  }

  const sumComments = useMemo(() => getSumComments(stories), [stories]);

  const handleSort = (field: keyof Stories) => {
    dispatchStories({ type: 'SORT', payload: field })
  }

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
        <PagerOptions selectedOption={pagerOption} onSelectOption={(value) => setPagerOptions(value)} />
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
        : (
          <>
            <Pager
              currentPage={currentPageNumber}
              totalPages={currentPageTotal}
              moreManual={pagerOption === 'Get More (manual)' ? {
                onGetMoreResultsClicked: () => handleGetNewPage(currentPageNumber + 1)
              } : undefined}
              clasico={pagerOption === 'Clásico' ? {
                onPageChange: (page: number) => handleGetNewPage(page - 1),
                pagerSize: 5,
              } : undefined}
            />
            <List
              list={stories}
              onRemoveClicked={handleRemoveStory}
              onEditClicked={handleEditClicked}
              onSort={handleSort}
              sortStatus={sortStatus}
            />
          </>
        )
      }
    </div>
  )
}

export default App
