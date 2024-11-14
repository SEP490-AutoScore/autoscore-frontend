import './App.css'
import Header from './components/Header';
import Footer from './components/Footer';

function App() {
  return (
    <div className="App">
      <Header />
      <main>
        {/* Main content goes here */}
        <h1>Welcome to the Application</h1>
      </main>
      <Footer />
    </div>
  );
}

export default App
