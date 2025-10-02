import {
  HashRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { Layout, Garage, Winners } from '@pages';
import './styles/reset.scss';
import './styles/App.scss';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/garage" replace />} />
          <Route path="garage" element={<Garage />} />
          <Route path="winners" element={<Winners />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
