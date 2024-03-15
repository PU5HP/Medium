
import './App.css'
import { SigninCard } from './pages/Signin';
import { SignupCard } from './pages/Signup';
import { PostCard } from './pages/Post';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Button } from "@/components/ui/button"
function App() {
  

  return (
    <>
      <Button></Button>
      <BrowserRouter>
      <Routes>
        <Route path='/signup' element={<SignupCard/>}/>
        <Route path='/signin' element={<SigninCard/>}/>
        <Route path='/blog/:id' element={<PostCard/>}/>
      </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
