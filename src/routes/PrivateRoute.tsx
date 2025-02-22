import PrivateLayout from "@/layouts/PrivateLayout";
import { userStore } from "@/stores";
import { observer } from "mobx-react-lite";
import { Navigate } from "react-router-dom";

type Props = {};

const PrivateRoute = observer((props: Props) => {
	const { authenticated } = userStore();
	if (!authenticated) {
		return <Navigate to={"/login"} />;
	}

	return <PrivateLayout />;
});

export default PrivateRoute;
