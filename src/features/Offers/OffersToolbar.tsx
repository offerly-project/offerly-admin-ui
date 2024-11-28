import Toolbar from "@/components/Toolbar/Toolbar";
import { Button } from "@/components/ui/button";
import { DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { MultiSelect } from "@/components/ui/multiselect";
import { CategoriesService } from "@/services/categories.service";
import { cardsStore, offersStore } from "@/stores";
import { faAdd } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { observer } from "mobx-react-lite";

type Props = {
	onAdd: () => void;
};

const OffersToolbar = observer(({ onAdd }: Props) => {
	const cards = cardsStore().cards;

	const { setCardsQuery: setBanksQuery, setCategoriesQuery } = offersStore();
	const categories = CategoriesService.categories;
	return (
		<Toolbar>
			<DialogTrigger>
				<Button variant="ghost" onClick={onAdd}>
					<FontAwesomeIcon icon={faAdd} />
				</Button>
			</DialogTrigger>
			<Input placeholder="Search..." style={{ width: 250 }} />
			<MultiSelect
				options={cards.map((card) => ({
					label: card.name as unknown as string,
					value: card.id,
				}))}
				onValueChange={setBanksQuery}
				placeholder="Cards"
			/>
			<MultiSelect
				options={categories.map((category) => ({
					label: category,
					value: category,
				}))}
				placeholder="Categories"
				onValueChange={setCategoriesQuery}
			/>
		</Toolbar>
	);
});

export default OffersToolbar;
