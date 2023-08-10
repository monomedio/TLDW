import logo from './logo.svg';
import './App.css';
import SearchBox from './components/SearchBox';
import SummaryButton from './components/SummaryButton';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import 'semantic-ui-css/semantic.min.css'
import TimeStamp from './components/TimeStamp';
import MainPage from './components/MainPage';
import "./background"
import "./content"

function App() {
  return (
    <div className="mt-5" style={{ width: '600px', height: '300px' }}>
        <MainPage/>
    </div>
  );
}

export default App;
