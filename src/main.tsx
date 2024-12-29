import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { Dialog, DialogContent } from "./components/ui/dialog.tsx";
import "./index.css";

if (import.meta.env.PROD) {
	console.log = () => {};
}

Dialog.defaultProps = {
	modal: false,
};

DialogContent.defaultProps = {
	onInteractOutside: (e) => {
		e.preventDefault();
	},
};

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<App />
	</StrictMode>
);
