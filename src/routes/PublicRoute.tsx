import { userStore } from "@/stores";
import { observer } from "mobx-react-lite";
import { Navigate, Outlet } from "react-router-dom";

type Props = {};

const PublicRoute = observer((props: Props) => {
	const { authenticated } = userStore();
	if (authenticated) {
		return <Navigate to={"/admin/banks"} />;
	}

	return <Outlet />;
});

export default PublicRoute;
