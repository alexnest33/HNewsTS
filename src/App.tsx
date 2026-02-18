import { Route,Routes } from 'react-router'
import { LatestNewsPage } from './pages/LatestNewsPage'
import NewsDetailsPage from './pages/NewsDetailsPage'
import './App.css'




function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<LatestNewsPage />} />
         <Route path="/news/:id" element={<NewsDetailsPage />} />
      </Routes>
    </>
  )
}

export default App
