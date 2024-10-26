import Grid from "@/components/Grid/Grid";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { cardsStore } from "@/stores";
import { observer } from "mobx-react-lite";
import { useState } from "react";
import CardsToolbar from "./CardsToolbar";

type Props = {};

const Cards = observer((props: Props) => {
	const { cards } = cardsStore();
	const [open, setOpen] = useState(false);
	return (
		<div className="flex-col flex space-y-5">
			<Dialog open={open} onOpenChange={(open) => setOpen(open)}>
				<CardsToolbar onAdd={() => setOpen(true)} />
				<DialogContent>
					<DialogHeader>
						<DialogTitle></DialogTitle>
					</DialogHeader>
				</DialogContent>
			</Dialog>
			<Grid>
				{cards.map((card) => (
					<div key={card.id}>{card.name}</div>
				))}
			</Grid>
		</div>
	);
});

export default Cards;
