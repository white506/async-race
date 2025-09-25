import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout, Garage, Winners } from '@pages';
import './styles/reset.scss';
import './styles/App.scss';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="garage" element={<Garage />} />
          <Route path="winners" element={<Winners />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
