import { faAdd } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "../ui/button";
import { DialogTrigger } from "../ui/dialog";
import { Input } from "../ui/input";

type Props = {
	onAdd?: () => void;
	onSearch?: (query: string) => void;
};

const ActionsBox = ({ onAdd, onSearch }: Props) => {
	return (
		<div className="flex-row flex space-x-4">
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
		</div>
	);
};

export default ActionsBox;
