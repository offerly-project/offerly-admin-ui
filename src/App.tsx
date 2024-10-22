import { useEffect } from "react";
import {
	createBrowserRouter,
	createRoutesFromElements,
	Route,
	RouterProvider,
} from "react-router-dom";
import Banks from "./features/Banks/Banks";
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
