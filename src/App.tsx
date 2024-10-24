import { useEffect } from "react";
import {
	createBrowserRouter,
	createRoutesFromElements,
	Route,
	RouterProvider,
} from "react-router-dom";
import Banks from "./features/Banks/Banks";
import Cards from "./features/Cards/Cards";
import Offers from "./features/Offers/Offers";
import Stores from "./features/Stores/Stores";
import RootLayout from "./layouts/RootLayout";
import LoginPage from "./pages/Login/LoginPage";
import PrivateRoute from "./routes/PrivateRoute";
import PublicRoute from "./routes/PublicRoute";
import { CountriesService } from "./services/countries.service";

const router = createBrowserRouter(
	createRoutesFromElements(
		<Route path="/" element={<RootLayout />}>
			<Route path="/" element={<PrivateRoute />}>
				<Route path="/banks" element={<Banks />}></Route>
				<Route path="/cards" element={<Cards />}></Route>
				<Route path="/offers" element={<Offers />}></Route>
				<Route path="/stores" element={<Stores />}></Route>
			</Route>
			<Route path="/" element={<PublicRoute />}>
				<Route path="/login" element={<LoginPage />}></Route>
			</Route>
		</Route>
	)
);

function App() {
	useEffect(() => {
		CountriesService.populate();
	}, []);
	return <RouterProvider router={router} />;
}

export default App;
