import CardImage from "@/components/Image/CardImage";
import MarkdownPreview from "@/components/Markdown/MarkdownPreview";
import StatusSwitch from "@/components/StatusSwitch/StatusSwitch";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Offer } from "@/entities/offer.entity";
import { useToast } from "@/hooks/use-toast";
import { offersStore } from "@/stores";
import { formatAssetPath } from "@/utils/utils";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { observer } from "mobx-react-lite";
import moment from "moment";
import { useMemo, useState } from "react";
import OfferForm, { OfferFormValues } from "./OfferForm";

type Props = {
	offer: Offer;
};

const OfferCard = observer(({ offer }: Props) => {
	const dateFmt = useMemo(() => {
		const fmt: string[] = [];
		if (offer.starting_date)
			fmt.push(moment(offer.starting_date).format("DD/MM/YYYY"));
		if (offer.expiry_date)
			fmt.push(moment(offer.expiry_date).format("DD/MM/YYYY"));
		return fmt.join(" - ");
	}, [offer.starting_date, offer.expiry_date]);

	const constraintsFmt = useMemo(() => {
		if (!offer.minimum_amount && !offer.cap) return "None";
		const constraints: string[] = [];
		if (offer.minimum_amount) constraints.push(`Min: ${offer.minimum_amount}`);
		if (offer.cap) constraints.push(`Max: ${offer.cap}`);
		return constraints.join(" | ");
	}, [offer.cap, offer.minimum_amount]);

	const channelFmt = useMemo(() => {
		return offer.channels
			.map((channel) => (channel === "in-store" ? "In Store" : "Online"))
			.join(" - ");
	}, [offer.channels]);

	const categoriesFmt = useMemo(() => {
		return offer.categories.map((category) => category.name).join(" - ");
	}, [offer.categories]);

	const { toast } = useToast();

	const [open, setOpen] = useState(false);

	const onUpdateOfferSubmit = async (values: OfferFormValues) => {
		try {
			await offersStore().updateOffer(offer.id, values);
			toast({ description: "Offer updated" });
			setOpen(false);
		} catch (e: any) {
			toast({ description: e.message });
		}
	};

	const onEnable = async () => {
		await offer.updateStatus("enabled");
	};

	const onDisable = async () => {
		await offer.updateStatus("disabled");
	};

	const onDelete = async () => {
		await offersStore().deleteOffer(offer.id);
	};

	console.log(offer.bankId);

	return (
		<Card className="flex flex-row w-[95%]">
			<CardHeader className="h-60 w-60">
				<CardImage
					src={
						offer.logo
							? formatAssetPath(offer.logo) + "?" + new Date().getTime()
							: ""
					}
					styles={{
						height: 150,
						width: 150,
					}}
					alt={"logo"}
				/>
			</CardHeader>
			<CardContent className="flex flex-col space-y-4 py-4">
				<MarkdownPreview className="font-bold text-lg">
					{offer.title.en}
				</MarkdownPreview>
				{/* <MarkdownPreview className="text-gray-500">
					{offer.description.en}
				</MarkdownPreview>
				<MarkdownPreview className="text-gray-500">
					{offer.terms_and_conditions.en}
				</MarkdownPreview> */}
				{/* <a
					href={offer.offer_source_link}
					className="text-blue-400 border-b w-fit pb-1 border-blue-400 cursor-pointer"
					target="_blank"
				>
					Source Link
				</a> */}
				{/* {offer.discount_code && (
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
				)} */}
				<p className="text-gray-500">{dateFmt}</p>
				<p className="text-gray-500">Constraints: {constraintsFmt}</p>
				<p className="text-gray-500">Channel: {channelFmt}</p>
				<p className="text-gray-500">Categories: {categoriesFmt}</p>
				<StatusSwitch
					status={offer.status}
					onEnable={onEnable}
					onDisable={onDisable}
				/>
				<div className="justify-center flex">
					<Dialog open={open} onOpenChange={(open) => setOpen(open)}>
						<DialogTrigger>
							<Button variant={"ghost"} className="m-auto">
								<FontAwesomeIcon icon={faEdit} />
							</Button>
						</DialogTrigger>
						<OfferForm
							initialValues={{
								description: offer.description,
								terms_and_conditions: offer.terms_and_conditions,
								offer_source_link: offer.offer_source_link,
								discount_code: offer.discount_code,
								starting_date: offer.starting_date,
								expiry_date: moment(offer.expiry_date).format("DD/MM/YYYY"),
								minimum_amount: offer.minimum_amount?.toString(),
								cap: offer.cap?.toString(),
								channels: offer.channels,
								categories: offer.categories.map((category) => category.id),
								logo: offer.logo,
								applicable_cards: offer.applicable_cards,
								title: offer.title,
							}}
							onSubmit={onUpdateOfferSubmit}
						/>
					</Dialog>
					<AlertDialog>
						<AlertDialogTrigger>
							<Button variant={"ghost"}>
								<FontAwesomeIcon icon={faTrash} />
							</Button>
						</AlertDialogTrigger>
						<AlertDialogContent>
							<AlertDialogHeader>
								<AlertDialogTitle>Confirmation</AlertDialogTitle>
								<AlertDialogDescription>
									Are you sure you want to delete this offer?
								</AlertDialogDescription>
							</AlertDialogHeader>
							<AlertDialogFooter>
								<AlertDialogCancel>No</AlertDialogCancel>
								<AlertDialogAction onClick={onDelete}>Yes</AlertDialogAction>
							</AlertDialogFooter>
						</AlertDialogContent>
					</AlertDialog>
				</div>
			</CardContent>
		</Card>
	);
});

export default OfferCard;
