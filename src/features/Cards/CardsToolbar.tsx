import Toolbar from "@/components/Toolbar/Toolbar";
import { Button } from "@/components/ui/button";
import { DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { banksStore, cardsStore } from "@/stores";
import { faAdd } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { observer } from "mobx-react-lite";

type Props = {
	onAdd: () => void;
};

const CardsToolbar = observer(({ onAdd }: Props) => {
	const { banks } = banksStore();
	const { updateFilter, updateSearch, query } = cardsStore();
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
				value={query.search}
				onChange={(e) => updateSearch(e.target.value)}
			/>
			<Select value={query.bank} onValueChange={(value) => updateFilter(value)}>
				<SelectTrigger>
					<SelectValue placeholder="Bank" />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="All">All</SelectItem>
					{banks.map((item) => (
						<SelectItem value={item.name.en}>{item.name.en}</SelectItem>
					))}
				</SelectContent>
			</Select>
		</Toolbar>
	);
});

export default CardsToolbar;
