import Navbar from './components/common/Navbar';
import Login from './pages/Login.jsx';

function App() {
  return (
    <>
      <Navbar
        onLoginClick={() => window.location.assign('/login')}
      />

      {window.location.pathname === '/login' && <Login />}
    </>
  );
}

export default App;