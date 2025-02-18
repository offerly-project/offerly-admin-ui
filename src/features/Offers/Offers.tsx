import Grid from "@/components/Grid/Grid";
import { Dialog } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { offersStore } from "@/stores";
import { createErrorToastObject } from "@/utils/utils";
import { observer } from "mobx-react-lite";
import { useState } from "react";
import OfferCard from "./OfferCard";
import OfferForm, { OfferFormValues } from "./OfferForm";
import OffersToolbar from "./OffersToolbar";

type Props = {};

const Offers = observer((props: Props) => {
	const [open, setOpen] = useState(false);
	const offers = offersStore().offers;
	const { toast } = useToast();
	const onNewOfferSubmit = async (values: OfferFormValues) => {
		try {
			await offersStore().createOffer(values);
			toast({ description: "Offer created" });
			setOpen(false);
		} catch (e: any) {
			toast(createErrorToastObject(e));
		}
	};
	console.log(offers);

	return (
		<div className="flex-col flex space-y-5">
			<Dialog open={open} onOpenChange={(open) => setOpen(open)}>
				<OffersToolbar onAdd={() => setOpen(true)} />
				<OfferForm onSubmit={onNewOfferSubmit} open={open} />
			</Dialog>
			<Grid
				columnCount={2}
				rowCount={Math.ceil(offers.length / 2)}
				columnWidth={500}
				rowHeight={400}
			>
				{offers.map((offer) => (
					<OfferCard key={offer.id} offer={offer} />
				))}
			</Grid>
		</div>
	);
});

export default Offers;
