import StatusSwitch from "@/components/StatusSwitch/StatusSwitch";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Bank } from "@/entities/bank.entity";
import { formatAssetPath, formatBankType } from "@/utils/utils";
import { observer } from "mobx-react-lite";

type Props = {
	bank: Bank;
};

const BankCard = observer(({ bank }: Props) => {
	const onEnable = () => {
		bank.updateStatus("enabled");
	};
	const onDisable = () => {
		bank.updateStatus("disabled");
	};

	return (
		<Card className="w-60">
			<CardHeader className="flex-row">
				<img
					className="h-20 w-20 rounded-lg"
					src={formatAssetPath(bank.logo)}
				/>
			</CardHeader>
			<CardContent className="space-y-4">
				<p className=" font-bold text-xl">{bank.name}</p>
				<p className=" text-gray-300">{bank.country}</p>
				<p className=" text-gray-300">Type: {formatBankType(bank.type)}</p>
				<StatusSwitch
					status={bank.status}
					onEnable={onEnable}
					onDisable={onDisable}
				/>
			</CardContent>
		</Card>
	);
});

export default BankCard;
