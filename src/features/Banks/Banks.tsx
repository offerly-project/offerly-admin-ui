import Grid from "@/components/Grid/Grid";
import { Dialog } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { banksStore } from "@/stores";
import { createErrorToastObject } from "@/utils/utils";
import { observer } from "mobx-react-lite";
import { useState } from "react";
import BankCard from "./BankCard";
import BankForm from "./BankForm";
import BanksToolbar from "./BanksToobar";

type Props = {};

const Banks = observer((props: Props) => {
	const { banks } = banksStore();
	const [open, setOpen] = useState(false);
	const { toast } = useToast();
	const onNewBankSubmit = async (values: any) => {
		try {
			await banksStore().createBank(values);
			toast({ description: "Bank created" });
			setOpen(false);
		} catch (e: any) {
			toast(createErrorToastObject(e));
		}
	};

	return (
		<div className="flex-col flex space-y-5">
			<Dialog open={open} onOpenChange={(open) => setOpen(open)}>
				<BanksToolbar onAdd={() => setOpen(true)} />

				<BankForm onSubmit={onNewBankSubmit} />
			</Dialog>
			<Grid
				columnCount={3}
				rowCount={Math.ceil(banks.length / 3)}
				columnWidth={350}
				rowHeight={500}
			>
				{banks.map((bank) => (
					<BankCard key={bank.id} bank={bank} />
				))}
			</Grid>
		</div>
	);
});

export default Banks;
