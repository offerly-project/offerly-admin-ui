import PrivateLayout from "@/layouts/PrivateLayout";
import { userStore } from "@/stores";
import { routeFmt } from "@/utils/utils";
import { observer } from "mobx-react-lite";
import { Navigate } from "react-router-dom";

type Props = {};

const PrivateRoute = observer((props: Props) => {
	const { authenticated } = userStore();
	if (!authenticated) {
		return <Navigate to={routeFmt("/login")} />;
	}

	return <PrivateLayout />;
});

export default PrivateRoute;
