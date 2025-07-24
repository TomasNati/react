import { useState, 
    type ChangeEvent, 
    type FocusEvent, 
    useEffect, 
    type Dispatch, 
    type SetStateAction, 
    type HTMLInputTypeAttribute, 
    useRef
} from 'react'
import './App.css'

const searchKey = 'search';

type StorageValueType =  string;

const useStorageState = (key: string, initialValue: StorageValueType): 
    [StorageValueType, Dispatch<SetStateAction<StorageValueType>>] => {
    const [value, setValue] = useState<StorageValueType>(localStorage.getItem(key) || initialValue)

    useEffect(() => {
        localStorage.setItem(key, value)
        console.log(`%cuseStorageState changed to: ${value}`, 'font-weight: bold; color: green;')
    }, [value, key])

    return [value, setValue]
}

interface Stories {
  title: string;
  url: string;
  author: string;
  num_comments: number;
  points: number;
  objectID: number;
}

interface ItemListProps {
  url: string;
  title: string;
  author: string;
  num_comments: number;
  points: number;
  onRemoveClicked: () => void;
}

const ItemList = ({ url, title, author, num_comments, points, onRemoveClicked } : ItemListProps) => {
  console.log(`Item with url ${url} renders`)
  return (
    <li>
      <a href={url} target="_blank">{title}</a>
      <p>Authors: {author}</p>
      <p>Number of comments: {num_comments}</p>
      <p>Points: {points}</p>
      <button type="button" onClick={onRemoveClicked}>Remove</button>
      <br />
      <br />
    </li>
  )
}

const List = ({list, onRemoveClicked} : {list: Stories[], onRemoveClicked: (objectID: number) => void}) =>  {
  console.log('List renders')
  // rest operator on the left, {objectID,...item}, destructure objectID current element in the list, 
  //   assigning the rest of the properties to a new object, 'item'.
  // spread operator on the right, ...item, creates key=value pairs for each operator in item object
  return list.map(({objectID, ...item}) => (
    <ItemList 
        key={objectID} 
        onRemoveClicked={() => onRemoveClicked(objectID)}
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

const App = () =>  {
  const [searchTerm, setSearchTerm] = useStorageState(searchKey, "React")
  const [stories, setStories] = useState<Stories[]>( [
    {
      title: 'React',
      url: 'http://reactjs.org/',
      author: 'Jordan Walke',
      num_comments: 3,
      points: 4,
      objectID: 0
    },
    {
      title: 'Redux',
      url: 'https://redux.js.org/',
      author: 'Dan Abramov, Andrew Clark',
      num_comments: 2,
      points: 5,
      objectID: 1
    }
  ])

  console.log('App renders')

  const filteredStories = stories.filter(({title}) => title.toLowerCase().includes(searchTerm.toLowerCase()))
  
  const handleSearchTermChanged = (newTerm: string) => {
    setSearchTerm(newTerm)
  }

  const handleRemoveStory = (objectID: number) => {
    const newStories = stories.filter((story) => story.objectID !== objectID)
    setStories(newStories)
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
      <ul>
        <List list={filteredStories} onRemoveClicked={handleRemoveStory} />
      </ul>
    </div>
  )
}

export default App
