import LoadingIndicator from "@/components/LoadingIndicator/LoadingIndicator";
import { Toaster } from "@/components/ui/toaster";
import { userStore } from "@/stores";
import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import { Outlet } from "react-router-dom";

type Props = {};

const RootLayout = observer((props: Props) => {
	const { initialising, initialize } = userStore();
	useEffect(() => {
		initialize();
	}, []);

	if (initialising) {
		return (
			<div style={{ height: "100vh" }}>
				<LoadingIndicator fullHeightAndWidth />
			</div>
		);
	}

	return (
		<>
			<Outlet />
			<Toaster />
		</>
	);
});

export default RootLayout;
