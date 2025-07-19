import type { ChangeEvent , FocusEvent} from 'react'
import './App.css'

const list = [
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

const List = () =>  (
  list.map(({title, url, author, num_comments, points, objectID}) => (
    <li key={objectID}>
    <a href={url} target="_blank">{title}</a>
    <p>Authors: {author}</p>
    <p>Number of comments: {num_comments}</p>
    <p>Points: {points}</p>
    </li> 
  ))
)

const Search = () => {

  const onClickHandler = (event: ChangeEvent<HTMLInputElement>) => {
    console.log(event.target.value)
  }

  const onBlurHandler = (event: FocusEvent<HTMLInputElement>) => {
    console.log(event)
  }

  return (
    <>
      <label htmlFor="sample">Input: </label>
      <input type="text" id="sample" onChange={onClickHandler} onBlur={onBlurHandler}/>
    </>
  )
}

const App = () =>  (
  <div className="app-container">
    <h1>My Hacker Stories 2</h1>
      <Search />
    <hr />
    <ul>
      <List />
    </ul>
  </div>
)

export default App
