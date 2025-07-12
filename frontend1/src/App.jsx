import { Routes , Route  } from "react-router-dom"
import Authe from "./pages/Authe.jsx"
import Navbar from "./components/Navbar.jsx"
import Home from './components/homePage.jsx'
import AddBlog from "./pages/AddBlog.jsx"
import BlogPage from "./pages/BlogPage.jsx"
import VerifyUser from "./components/VerifyUser.jsx"
import ProfilePage from "./pages/ProfilePage.jsx"
import EditProfilepage from './pages/EditProfilepage.jsx'
import SearchBlogs from "./pages/SearchBlogs.jsx"
import Setting from "./components/Setting.jsx"


function App() {
    return (
    
      <Routes>
        <Route path="/" element={<Navbar/>} className=" ">
          <Route path="/" element={<Home/>} ></Route>
          <Route path="/signIn" element={<Authe type="signin" />} ></Route>
          <Route path="/signUp" element={<Authe type="signup" />}></Route>
          <Route path="/add-blog" element={<AddBlog/>}></Route>
          <Route path="/blog/:id" element={<BlogPage/>}></Route>
          <Route path="/edit/:id" element={<AddBlog/>}></Route>
          <Route path="/verify-email" element={<VerifyUser/>}></Route>
          <Route path="/:username" element={<ProfilePage/>}></Route>
          <Route path="/:username/liked-blogs" element={<ProfilePage/>}></Route>
          <Route path="/:username/saved-blogs" element={<ProfilePage/>}></Route>
          <Route path="/:username/draft-blogs" element={<ProfilePage/>}></Route>
          <Route path="/edit-profile" element={<EditProfilepage/>}></Route>
          <Route path="/search-blogs" element={<SearchBlogs/>}></Route>
          <Route path="/tag/:tag" element={<SearchBlogs/>}></Route>
          <Route path="/setting" element={<Setting/>}></Route>
        </Route>
      </Routes>
  
  )
}

export default App
