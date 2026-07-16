import { useState } from 'react'
import Login from './Login'

function App() {
  const [token, setToken] = useState(() => sessionStorage.getItem('token'))

  if (!token) {
    return (
      <Login
        onLoginSuccess={() => setToken(sessionStorage.getItem('token'))}
      />
    )
  }

  return <div>Logged in! Feed goes here.</div>
}

export default App
