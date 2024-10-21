import { Toaster } from "@/components/ui/toaster";
import { Outlet } from "react-router-dom";

type Props = {};

const RootLayout = (props: Props) => {
	return (
		<>
			<div className="p-4 text-2xl">
				<h1 className="font-bold text-white">Offerly</h1>
			</div>
			<Outlet />
			<Toaster />
		</>
	);
};

export default RootLayout;
