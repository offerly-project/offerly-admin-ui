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
	const cards = cardsStore().pureCards;

	const { setCardsQuery, setCategoriesQuery, setSearchQuery, query } =
		offersStore();
	const categories = CategoriesService.categories;
	return (
		<Toolbar>
			<DialogTrigger>
				<Button variant="ghost" onClick={onAdd}>
					<FontAwesomeIcon icon={faAdd} />
				</Button>
			</DialogTrigger>
			<Input
				placeholder="Search..."
				style={{ width: 250 }}
				value={query.search}
				onChange={(e) => setSearchQuery(e.target.value)}
			/>
			<MultiSelect
				options={cards.map((card) => ({
					label: card.name.en,
					value: card.id,
				}))}
				defaultValue={query.cards}
				onValueChange={setCardsQuery}
				placeholder="Cards"
			/>
			<MultiSelect
				options={categories.map((category) => ({
					label: category,
					value: category,
				}))}
				defaultValue={query.categories}
				placeholder="Categories"
				onValueChange={setCategoriesQuery}
			/>
		</Toolbar>
	);
});

export default OffersToolbar;
