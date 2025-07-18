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

function App() {

  return (
   <div>
    <h1>My Hacker Stories</h1>
    <label htmlFor="sample">Input: </label>
    <input type="text" id="sample" />
    <hr />
    <ul>
      {
        list.map(({title, url, author, num_comments, points, objectID}) => (
          <li key={objectID}>
            <a href={url} target="_blank">{title}</a>
            <p>Authors: {author}</p>
            <p>Number of comments: {num_comments}</p>
            <p>Points: {points}</p>
          </li>
        ))
      }
    </ul>
   </div>

  )
}

export default App
