import { useState, type ChangeEvent , type FocusEvent} from 'react'
import './App.css'

interface Stories {
  title: string;
  url: string;
  author: string;
  num_comments: number;
  points: number;
  objectID: number;
}

const ItemList = ({item} : {item: Stories}) => {
  console.log(`Item with ID ${item.objectID} renders`)
  return (
    <li>
      <a href={item.url} target="_blank">{item.title}</a>
      <p>Authors: {item.author}</p>
      <p>Number of comments: {item.num_comments}</p>
      <p>Points: {item.points}</p>
  </li> 
  )
}

const List = ({list} : {list: Stories[]}) =>  {
  console.log('List renders')
  return list.map((item) => <ItemList key={item.objectID} item={item} /> )
}

interface SearchProps {
  searchTerm: string;
  onSearchTermChanged: (term: string) => void
}
const Search = ({ searchTerm, onSearchTermChanged } : SearchProps) => {

  const onChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    onSearchTermChanged(event.target.value)
  }

  const onBlurHandler = (event: FocusEvent<HTMLInputElement>) => {
    console.log(event)
  }

  console.log('Search renders')

  return (
    <>
      <label htmlFor="sample">Input: </label>
      <input type="text" id="sample" value={searchTerm} onChange={onChangeHandler} onBlur={onBlurHandler}/>
      <p>Entered search term: {searchTerm}</p>
    </>
  )
}

const App = () =>  {
  const [searchTerm, setSearchTerm] = useState("React")
  const stories: Stories[] =  [
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
  ]

  console.log('App renders')

  const filteredStories = stories.filter(({title}) => title.toLowerCase().includes(searchTerm.toLowerCase()))
  
  const handleSearchTermChanged = (newTerm: string) => {
    setSearchTerm(newTerm)
  }

  return (
    <div className="app-container">
      <h1>My Hacker Stories 2</h1>
        <Search searchTerm={searchTerm} onSearchTermChanged={handleSearchTermChanged} />
      <hr />
      <ul>
        <List list={filteredStories} />
      </ul>
    </div>
  )
}

export default App
