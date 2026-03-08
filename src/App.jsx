import { useState } from 'react'
import { supabase } from './services/supabaseClient'

function App() {
  const [message, setMessage] = useState('')

  async function createTestTour() {
    const { error } = await supabase
      .from('tours')
      .insert([
        {
          title: 'My First Tour',
          slug: 'my-first-tour'
        }
      ])

    if (error) {
      setMessage('Error: ' + error.message)
    } else {
      setMessage('Tour created successfully')
    }
  }

  return (
    <div style={{ padding: 40 }}>
      <h1>Crave Adventures</h1>
      <button onClick={createTestTour}>Create Test Tour</button>
      <p>{message}</p>
    </div>
  )
}

export default App