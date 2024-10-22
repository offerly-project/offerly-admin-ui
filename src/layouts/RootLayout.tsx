import { Toaster } from "@/components/ui/toaster";
import { Outlet } from "react-router-dom";

type Props = {};

const RootLayout = (props: Props) => {
	return (
		<>
			<Outlet />
			<Toaster />
		</>
	);
};

export default RootLayout;
