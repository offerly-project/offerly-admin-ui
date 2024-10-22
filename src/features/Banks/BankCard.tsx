import StatusSwitch from "@/components/StatusSwitch/StatusSwitch";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Bank } from "@/entities/bank.entity";
import { formatAssetPath, formatBankType } from "@/utils/utils";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { observer } from "mobx-react-lite";

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

	return (
		<Card className="w-60">
			<CardHeader className="flex-row">
				<img
					className="h-20 w-20 rounded-lg"
					src={formatAssetPath(bank.logo)}
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
					<Button variant={"ghost"} className="m-auto">
						<FontAwesomeIcon icon={faEdit} />
					</Button>
				</div>
			</CardContent>
		</Card>
	);
});

export default BankCard;
