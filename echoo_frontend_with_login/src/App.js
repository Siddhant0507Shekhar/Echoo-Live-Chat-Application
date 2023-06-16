import './App.css';
import Navbar from './components/navbar/navbar';
import Chats from './components/Chats/Chats';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Admin from './components/Admin/Admin';
import GroupSettings from './components/Group Settings/GroupSettings';

function Home() {
  return (
    <div className="home-container">
      <h1>Welcome to Echoo</h1>
      <p>Start chatting with friends in real-time!</p>
      <button className="start-button">Get Started</button>
    </div>
  )
}


function App() {
  const during_load = () => {
    fetch("/api/get_username").then(response => response.json()).then(data => {
      window.UserName = data.username;
      console.log(window.UserName);
    })
  }
  during_load();

  return (
    <BrowserRouter>
      <div className="App">
        <Navbar />
        {/* <GroupSettings /> */}
        <Routes>
          <Route path='' element={<Home/>}/>
          <Route path="/chat" element={<Chats />} />
          <Route path="/group_settings" element={<GroupSettings />} />
          <Route path="/ad-min" element={<Admin />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
