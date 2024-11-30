import CardImage from "@/components/Image/CardImage";
import StatusSwitch from "@/components/StatusSwitch/StatusSwitch";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Card as CardEntity } from "@/entities/card.entity";
import { useToast } from "@/hooks/use-toast";
import { cardsStore } from "@/stores";
import { createErrorToastObject, formatAssetPath } from "@/utils/utils";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Dialog, DialogTrigger } from "@radix-ui/react-dialog";
import { observer } from "mobx-react-lite";
import { useState } from "react";
import CardForm, { CardFormValues } from "./CardForm";

type Props = {
	card: CardEntity;
};

const CardCard = observer(({ card }: Props) => {
	const onEnable = async () => {
		await card.updateStatus("enabled");
	};
	const onDisable = async () => {
		await card.updateStatus("disabled");
	};

	const [open, setOpen] = useState(false);
	const { toast } = useToast();

	const onUpdateCardSubmit = async (values: CardFormValues) => {
		try {
			await cardsStore().updateCard(card.id, values);
			toast({ description: "Bank updated" });
			setOpen(false);
		} catch (e: any) {
			toast(createErrorToastObject(e));
		}
	};

	return (
		<Card>
			<CardHeader className="flex-row">
				<CardImage
					className="m-auto"
					styles={{ height: 275 / 2, width: 450 / 2 }}
					alt="C"
					src={
						card.logo
							? formatAssetPath(card.logo) + "?" + new Date().getTime()
							: ""
					}
				/>
			</CardHeader>
			<CardContent className="space-y-4 ">
				<p className=" font-bold text-lg">{card.name.en}</p>
				<p className=" text-gray-300">{card.scheme.en}</p>
				<p className=" text-gray-300">{card.bank.name.en}</p>
				<p className=" text-gray-300">{card.grade.en}</p>
				<StatusSwitch
					status={card.status}
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
						<CardForm
							initialValues={{
								name: card.name,
								scheme: card.scheme,
								bank: card.bank.name.en,
								grade: card.grade,
								logo: card.logo,
							}}
							onSubmit={onUpdateCardSubmit}
						/>
					</Dialog>
				</div>
			</CardContent>
		</Card>
	);
});

export default CardCard;
