import { userStore } from "@/stores";
import { routeFmt } from "@/utils/utils";
import { observer } from "mobx-react-lite";
import { Navigate, Outlet } from "react-router-dom";

type Props = {};

const PublicRoute = observer((props: Props) => {
	const { authenticated } = userStore();
	if (authenticated) {
		return <Navigate to={routeFmt("/banks")} />;
	}

	return <Outlet />;
});

export default PublicRoute;
