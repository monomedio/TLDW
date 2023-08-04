import logo from './logo.svg';
import './App.css';
import SearchBox from './components/SearchBox';
import SummaryButton from './components/SummaryButton';
function App() {
  return (
    <div className="App">
    <div className='row'>
        <div className='left'>
            <SearchBox/>
        </div>
        <div className='right'>
            <SummaryButton/>
        </div>
    </div>
    </div>
  );
}

export default App;
