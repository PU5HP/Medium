
import './App.css'
import { SigninCard } from './pages/Signin';
import { SignupPage } from './pages/Signup';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Posts } from './pages/Posts';
import { Blog } from './pages/Blog';
import { Publishpage } from './pages/Publishpage';
function App() {
  return (
    <>
      <BrowserRouter>
      <Routes>
        <Route path='/' element={<SignupPage/>}/>
        <Route path='/signin' element={<SigninCard/>}/>
        <Route path='/blog/:id' element={<Blog/>}/>
        <Route path='/blog/bulk/posts' element={<Posts/>}/>
        <Route path='/publish' element={<Publishpage/>}/>
      </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
