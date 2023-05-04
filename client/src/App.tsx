import { Outlet } from 'react-router';
import { Navigationbar } from './components/Navbar';


function App() {

  return (
    <>
      <Navigationbar />
      <main>
        <Outlet />
      </main>
    </>
  );
}

export default App;
