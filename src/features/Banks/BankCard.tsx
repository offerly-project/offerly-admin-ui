import CardImage from "@/components/Image/CardImage";
import StatusSwitch from "@/components/StatusSwitch/StatusSwitch";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Bank } from "@/entities/bank.entity";
import { useToast } from "@/hooks/use-toast";
import { banksStore } from "@/stores";
import {
	createErrorToastObject,
	formatAssetPath,
	formatBankType,
} from "@/utils/utils";
import { faBridge, faEdit } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { observer } from "mobx-react-lite";
import { useState } from "react";
import DeltaDialog from "../Delta/DeltaDialog";
import BankForm, { BankFormValues } from "./BankForm";

type Props = {
	bank: Bank;
};

const BankCard = observer(({ bank }: Props) => {
	const onEnable = async () => {
		await bank.updateStatus("enabled");
	};
	const onDisable = async () => {
		await bank.updateStatus("disabled");
	};

	const [editOpen, setEditOpen] = useState(false);
	const [deltaOpen, setDeltaOpen] = useState(false);

	const { toast } = useToast();

	const onUpdateBankSubmit = async (values: BankFormValues) => {
		try {
			await banksStore().updateBank(bank.id, values);
			toast({ description: "Bank updated" });
			setEditOpen(false);
		} catch (e: any) {
			toast(createErrorToastObject(e));
		}
	};
	return (
		<Card className="w-60">
			<CardHeader className="flex-row">
				<CardImage
					alt="B"
					className="m-auto"
					styles={{ height: 150, width: 150 }}
					src={
						bank.logo
							? formatAssetPath(bank.logo) + "?" + new Date().getTime()
							: ""
					}
				/>
			</CardHeader>
			<CardContent className="space-y-4">
				<p className=" font-bold text-xl">{bank.name.en}</p>
				<p className=" text-gray-300">{bank.country}</p>
				<p className=" text-gray-300">{formatBankType(bank.type)}</p>
				<StatusSwitch
					status={bank.status}
					onEnable={onEnable}
					onDisable={onDisable}
				/>

				<div className="justify-center flex">
					{bank.scrapper_id && (
						<Dialog
							open={deltaOpen}
							onOpenChange={(open) => setDeltaOpen(open)}
						>
							<DialogTrigger>
								<Button variant={"ghost"}>
									<FontAwesomeIcon icon={faBridge} />
								</Button>
							</DialogTrigger>
							<DeltaDialog open={deltaOpen} scrapperId={bank.scrapper_id} />
						</Dialog>
					)}
					<Dialog open={editOpen} onOpenChange={(open) => setEditOpen(open)}>
						<DialogTrigger>
							<Button variant={"ghost"} className="m-auto">
								<FontAwesomeIcon icon={faEdit} />
							</Button>
						</DialogTrigger>
						<BankForm
							initialValues={{
								name: bank.name,
								country: bank.country,
								type: bank.type,
								logo: bank.logo,
							}}
							onSubmit={onUpdateBankSubmit}
						/>
					</Dialog>
				</div>
			</CardContent>
		</Card>
	);
});

export default BankCard;
