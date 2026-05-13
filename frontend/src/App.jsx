import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import CreatePoll from "./pages/CreatePoll";
import PollView from "./pages/PollView";
import PollResult from "./pages/PollResult";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/createPoll" element={<CreatePoll />} />
        <Route path="/poll/:shareId" element={<PollView />} />
        <Route path="/poll/:shareId/results" element={<PollResult />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
