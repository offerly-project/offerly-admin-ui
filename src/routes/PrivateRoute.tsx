import { userStore } from "@/stores";
import { observer } from "mobx-react-lite";
import { Navigate, Outlet } from "react-router-dom";

type Props = {};

const PrivateRoute = observer((props: Props) => {
	const { authenticated } = userStore();
	if (!authenticated) {
		return <Navigate to="/login" />;
	}

	return <Outlet />;
});

export default PrivateRoute;
