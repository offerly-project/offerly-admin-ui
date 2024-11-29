import Grid from "@/components/Grid/Grid";
import { Dialog } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { cardsStore } from "@/stores";
import { createErrorToastObject } from "@/utils/utils";
import { observer } from "mobx-react-lite";
import { useState } from "react";
import CardCard from "./CardCard";
import CardForm, { CardFormValues } from "./CardForm";
import CardsToolbar from "./CardsToolbar";

type Props = {};

const Cards = observer((props: Props) => {
	const { cards: cards } = cardsStore();
	const [open, setOpen] = useState(false);
	const { toast } = useToast();
	const onNewCardSubmit = async (values: CardFormValues) => {
		try {
			await cardsStore().createCard(values);
			toast({ description: "Card created" });
			setOpen(false);
		} catch (e: any) {
			toast(createErrorToastObject(e));
		}
	};

	return (
		<div className="flex-col flex space-y-5">
			<Dialog open={open} onOpenChange={(open) => setOpen(open)}>
				<CardsToolbar onAdd={() => setOpen(true)} />
				<CardForm onSubmit={onNewCardSubmit} />
			</Dialog>
			<Grid>
				{cards.map((card) => (
					<CardCard key={card.id} card={card} />
				))}
			</Grid>
		</div>
	);
});

export default Cards;
