import { Dialog } from "@/components/ui/dialog";
import { offersStore } from "@/stores";
import { observer } from "mobx-react-lite";
import { useState } from "react";
import OfferCard from "./OfferCard";
import OffersToolbar from "./OffersToolbar";

type Props = {};

const Offers = observer((props: Props) => {
	const [open, setOpen] = useState(false);
	const offers = offersStore().offers;

	return (
		<div className="flex-col flex space-y-5">
			<Dialog open={open} onOpenChange={(open) => setOpen(open)}>
				<OffersToolbar onAdd={() => setOpen(true)} />
			</Dialog>
			<div className="flex flex-col space-y-10">
				{offers.map((offer) => (
					<OfferCard key={offer.id} offer={offer} />
				))}
			</div>
		</div>
	);
});

export default Offers;
