import logo from './logo.svg';
import './App.css';
import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";
import Home from './pages/home';

function App() {
  return (
    <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                {/* <Route path="/login" element={<Login />} />
                <Route path="*" element={<NotFound />} /> */}
            </Routes>
        </Router>
  );
}

export default App;
