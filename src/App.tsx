import { useEffect, useState } from "react";
import {
	createBrowserRouter,
	createRoutesFromElements,
	Route,
	RouterProvider,
} from "react-router-dom";
import Banks from "./features/Banks/Banks";
import Cards from "./features/Cards/Cards";
import Offers from "./features/Offers/Offers";
import RootLayout from "./layouts/RootLayout";
import LoginPage from "./pages/Login/LoginPage";
import PrivateRoute from "./routes/PrivateRoute";
import PublicRoute from "./routes/PublicRoute";
import { CategoriesService } from "./services/categories.service";
import { CountriesService } from "./services/countries.service";

const router = createBrowserRouter(
	createRoutesFromElements(
		<Route element={<RootLayout />}>
			<Route element={<PrivateRoute />}>
				<Route path={"/banks"} element={<Banks />}></Route>
				<Route path={"/cards"} element={<Cards />}></Route>
				<Route path={"/offers"} element={<Offers />}></Route>
			</Route>
			<Route element={<PublicRoute />}>
				<Route path={"/login"} element={<LoginPage />}></Route>
			</Route>
		</Route>
	)
);

function App() {
	const [loading, setLoading] = useState(true);
	useEffect(() => {
		Promise.all([
			CountriesService.populate(),
			CategoriesService.populate(),
		]).then(() => setLoading(false));
	}, []);
	return !loading && <RouterProvider router={router} />;
}

export default App;
