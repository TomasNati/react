const welcomeSalutes = [{
  title: 'React',
  greeting: 'Hey'
}, {
  title: 'Reacción',
  greeting: 'Hola'
},
{
  title: 'Le React',
  greeting: 'Bonjour'
}
]

function App() {

  return (
   <div>
    { welcomeSalutes.map(({title, greeting}) => <h1>{greeting}! Hello {title}</h1>) }
    <label htmlFor="sample">Input: </label>
    <input type="text" id="sample" />
   </div>

  )
}

export default App
