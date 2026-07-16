import { useState } from 'react'
import Login from './Login'
import Feed from './Feed'

function App() {
  const [token, setToken] = useState(() => sessionStorage.getItem('token'))
  const [username, setUsername] = useState(() => sessionStorage.getItem('username'))

  if (!token) {
    return (
      <Login
        onLoginSuccess={() => {
          setToken(sessionStorage.getItem('token'))
          setUsername(sessionStorage.getItem('username'))
        }}
      />
    )
  }

  return <Feed token={token} username={username} />
}

export default App