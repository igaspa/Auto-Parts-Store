import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SignIn from './components/SignIn';
import Order from './components/OrderCard';
import OrderList from './components/OrderList';
import ItemList from './components/itemList'
import Container from '@mui/material/Container';

function App() {
	return (
			<Router>
				<Container maxWidth="sm">
					<Routes>
						<Route
							exact
							path="/login"
							element={
								<>
									<SignIn />
								</>
							}
						></Route>
            <Route
							exact
							path="/order"
							element={
								<>
									<OrderList />
								</>
							}
						></Route>
						<Route
							exact
							path="/"
							element={
									<ItemList/>
							}
						></Route>
					</Routes>
				</Container>
			</Router>
	);
}

export default App;