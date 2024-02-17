
import './App.css';
import Game from './pages/Game';
import { GameProvider } from './context/GameContext';
import { createBrowserRouter , RouterProvider} from 'react-router-dom';
import Home from './pages/Home';
function App() {

	const router=createBrowserRouter([
		{
			path:"/",
			element:<Home/>
		},
		{
			path:'game/',
			element:<Game/>
		}]
	)

	return (

	<GameProvider>

		<RouterProvider router={router} />
		
	</GameProvider>
	)
	
}

export default App;
