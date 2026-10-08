
import './App.css'
import { BrowserRouter,Route,Routes } from 'react-router-dom'
import { LandingPage } from './pages/Landing'
import {Game} from './pages/Game'
function App() {


  return (
   <div >
   <BrowserRouter>
   <Routes>
   <Route path="/" element={<LandingPage/>} />
   <Route path="/game" element={<Game/>}/>
   </Routes>
   </BrowserRouter>
   </div>
  )
}

export default App
