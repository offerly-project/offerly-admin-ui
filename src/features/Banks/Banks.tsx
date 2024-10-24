import Grid from "@/components/Grid/Grid";
import { Dialog } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { banksStore } from "@/stores";
import { createErrorToastObject } from "@/utils/utils";
import { observer } from "mobx-react-lite";
import { useState } from "react";
import BankCard from "./BankCard";
import BankForm, { BankFormValues } from "./BankForm";
import BanksToolbar from "./BanksToobar";

type Props = {};

const Banks = observer((props: Props) => {
	const { banks, updateFilter } = banksStore();
	const [open, setOpen] = useState(false);
	const { toast } = useToast();
	const onNewBankSubmit = async (values: BankFormValues) => {
		try {
			await banksStore().createBank(values);
			toast({ description: "Bank created" });
			setOpen(false);
		} catch (e: any) {
			toast(createErrorToastObject(e));
		}
	};

	return (
		<div className="flex-col space-y-5">
			<Dialog open={open} onOpenChange={(open) => setOpen(open)}>
				<BanksToolbar onSearch={updateFilter} />

				<BankForm onSubmit={onNewBankSubmit} />
			</Dialog>
			<Grid>
				{banks.map((bank) => (
					<BankCard key={bank.id} bank={bank} />
				))}
			</Grid>
		</div>
	);
});

export default Banks;
