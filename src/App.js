import { BrowserRouter, Route, Routes } from "react-router-dom";
import Budget from "./pages/Budget";
import Login from "./pages/Login";
import './App.css';

const App = () => (
  <BrowserRouter basename="/">
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Budget />} /> 
      </Routes>
    </BrowserRouter>
)

export default App;
