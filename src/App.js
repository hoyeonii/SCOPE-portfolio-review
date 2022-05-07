//https://www.youtube.com/watch?v=cS94eDcTe44
//https://www.youtube.com/watch?v=pJ8LykeBDo4
import AddPortfolio from "./components/AddPortfolio.js";
import Portfolios from "./components/Portfolios.js";
import Portfolio from "./components/Portfolio.js";
import Navbar from "./components/Navbar.js";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./components/auth/Register.js";
import Login from "./components/auth/Login.js";
import Experts from "./components/Experts.js";
import Home from "./components/Home.js";
import AccountInfo from "./components/AccountInfo.js";
import Profile from "./components/Profile.js";
import EditAccount from "./components/EditAccount.js";
import RequestFeedback from "./components/RequestFeedback.js";
import "./App.css";
import ViewRequest from "./components/ViewRequest.js";
import AddFeedback from "./components/AddFeedback.js";
import ViewFeedback from "./components/ViewFeedback.js";

function App() {
  return (
    <div className="App">
      <Router>
        <Navbar />

        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/portfolios" element={<Portfolios />} />
          <Route path="/portfolio/:id" element={<Portfolio />} />
          <Route path="/profile/:id" element={<Profile />} />
          <Route path="/experts" element={<Experts />} />
          <Route path="/EditAccount" element={<EditAccount />} />
          <Route path="/" element={<Home />} />
          <Route path="/accountInfo" element={<AccountInfo />} />
          <Route path="/requestFeedback/:id" element={<RequestFeedback />} />
          <Route path="/request/:requestId" element={<ViewRequest />} />
          <Route path="/feedback/:requestId" element={<ViewFeedback />} />
          <Route path="/addFeedback/:requestId" element={<AddFeedback />} />
          <Route path="/*" element={<>Page Not Found</>} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
