import Toolbar from "@/components/Toolbar/Toolbar";
import { faAdd } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "../../components/ui/button";
import { DialogTrigger } from "../../components/ui/dialog";
import { Input } from "../../components/ui/input";

type Props = {
	onAdd?: () => void;
	onSearch?: (query: string) => void;
};

const BanksToolbar = ({ onAdd, onSearch }: Props) => {
	return (
		<Toolbar>
			<DialogTrigger>
				<Button variant="ghost" onClick={onAdd}>
					<FontAwesomeIcon icon={faAdd} />
				</Button>
			</DialogTrigger>
			<Input
				className="w-100 inline-block"
				placeholder="Search..."
				onChange={(e) => {
					onSearch?.(e.target.value);
				}}
			/>
		</Toolbar>
	);
};

export default BanksToolbar;
