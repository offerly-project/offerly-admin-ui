import StatusSwitch from "@/components/StatusSwitch/StatusSwitch";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { axiosInstance } from "@/configs/configs";
import { Bank } from "@/entities/bank.entity";
import { useToast } from "@/hooks/use-toast";
import { banksStore } from "@/stores";
import {
	createErrorToastObject,
	formatAssetPath,
	formatBankType,
} from "@/utils/utils";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { observer } from "mobx-react-lite";
import { useState } from "react";
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

	const [open, setOpen] = useState(false);

	const { toast } = useToast();

	const onUpdateBankSubmit = async ({ logo, ...values }: BankFormValues) => {
		try {
			const path = `/banks/${values.name.toLowerCase()}.png`;
			if (logo) {
				const formData = new FormData();
				formData.append("image", logo);
				formData.append("path", path);
				axiosInstance.post("/uploads/images", formData);
			}

			banksStore().updateBank(bank.id, {
				...values,
				logo: logo ? path : bank.logo,
			});
			toast({ description: "Bank updated" });
			setOpen(false);
		} catch (e: any) {
			toast(createErrorToastObject(e));
		}
	};
	return (
		<Card className="w-60">
			<CardHeader className="flex-row">
				<img
					className="h-20 w-20 rounded-lg"
					src={formatAssetPath(bank.logo) + "?" + new Date().getTime()}
					alt={bank.name + " logo"}
				/>
			</CardHeader>
			<CardContent className="space-y-4 ">
				<p className=" font-bold text-xl">{bank.name}</p>
				<p className=" text-gray-300">{bank.country}</p>
				<p className=" text-gray-300">Type: {formatBankType(bank.type)}</p>
				<StatusSwitch
					status={bank.status}
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
						<BankForm
							initialValues={{
								name: bank.name,
								country: bank.country,
								type: bank.type,
								logo: bank.logoFile,
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
