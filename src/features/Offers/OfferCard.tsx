import CardImage from "@/components/Image/CardImage";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Offer } from "@/entities/offer.entity";
import { useToast } from "@/hooks/use-toast";
import { formatAssetPath } from "@/utils/utils";
import moment from "moment";
import { useMemo } from "react";

type Props = {
	offer: Offer;
};

const OfferCard = ({ offer }: Props) => {
	const dateFmt = useMemo(() => {
		const fmt: string[] = [];
		if (offer.starting_date)
			fmt.push(moment(offer.starting_date).format("DD/MM/YYYY"));
		if (offer.expiry_date)
			fmt.push(moment(offer.expiry_date).format("DD/MM/YYYY"));
		return fmt.join(" - ");
	}, [offer.starting_date, offer.expiry_date]);

	const constraintsFmt = useMemo(() => {
		const constraints: string[] = [];
		if (offer.minimum_amount) constraints.push(`Min: ${offer.minimum_amount}`);
		if (offer.cap) constraints.push(`Max: ${offer.cap}`);
		return constraints.join(" | ");
	}, [offer.cap, offer.minimum_amount]);

	const channelFmt = useMemo(() => {
		return offer.channel === "online" ? "Online" : "Offline";
	}, [offer.channel]);

	const categoriesFmt = useMemo(() => {
		return offer.categories.join(" - ");
	}, [offer.categories]);

	const { toast } = useToast();

	return (
		<Card>
			<CardHeader>
				<CardImage
					src={
						offer.logo
							? formatAssetPath(offer.logo) + "?" + new Date().getTime()
							: ""
					}
					className="w-40 h-40 m-auto"
					alt={"logo"}
				/>
			</CardHeader>
			<CardContent className="flex flex-col space-y-4">
				<p className="font-bold text-lg">{offer.description}</p>
				<p className="text-gray-500">{offer.terms_and_conditions}</p>
				<a
					href={offer.offer_source_link}
					className="text-blue-400 border-b w-fit pb-1 border-blue-400 cursor-pointer"
					target="_blank"
				>
					Source Link
				</a>
				{offer.discount_code && (
					<p
						className="text-green-600 border-b w-fit pb-1 border-green-600 cursor-pointer"
						onClick={() => {
							navigator.clipboard.writeText(offer.discount_code!);
							toast({
								description: "Discount code copied to clipboard",
							});
						}}
					>
						Discount Code: {offer.discount_code}
					</p>
				)}
				<p className="text-gray-500">{dateFmt}</p>
				<p className="text-gray-500">Constraints: {constraintsFmt}</p>
				<p className="text-gray-500">Channel: {channelFmt}</p>
				<p className="text-gray-500">Categories: {categoriesFmt}</p>
			</CardContent>
		</Card>
	);
};

export default OfferCard;
