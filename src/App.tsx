import { RouteRoute } from 'routes'
import './App.css'
import { BrowserRouter } from 'react-router-dom'
import { LoadingModal } from 'ui-molecules'
import { GlobalContext } from 'providers'
import { useContext } from 'react'

function App() {
  const { state } = useContext(GlobalContext)
  const { loading } = state

  return (
    <>
      <BrowserRouter>
        <RouteRoute />
        {loading?.open && <LoadingModal />}
      </BrowserRouter>
    </>
  )
}

export default App
