
import './App.css'
import { SigninCard } from './pages/Signin';
import { SignupPage } from './pages/Signup';
import { PostCard } from './pages/Post';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

function App() {
  return (
    <>
      <BrowserRouter>
      <Routes>
        <Route path='/signup' element={<SignupPage/>}/>
        <Route path='/signin' element={<SigninCard/>}/>
        <Route path='/blog/:id' element={<PostCard/>}/>
      </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
