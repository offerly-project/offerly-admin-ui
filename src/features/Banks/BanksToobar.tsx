import Toolbar from "@/components/Toolbar/Toolbar";
import { banksStore } from "@/stores";
import { faAdd } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "../../components/ui/button";
import { DialogTrigger } from "../../components/ui/dialog";
import { Input } from "../../components/ui/input";

type Props = {
	onAdd?: () => void;
};

const BanksToolbar = ({ onAdd }: Props) => {
	const onSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		banksStore().updateFilter(e.target.value);
	};
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
				value={banksStore().filter}
				onChange={onSearchChange}
			/>
		</Toolbar>
	);
};

export default BanksToolbar;
