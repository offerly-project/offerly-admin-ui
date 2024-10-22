import ActionsBox from "@/components/ActionsBox/ActionsBox";
import { Dialog } from "@/components/ui/dialog";
import { banksStore } from "@/stores";
import { observer } from "mobx-react-lite";
import { useState } from "react";
import BankCard from "./BankCard";
import NewBankForm from "./NewBankForm";

type Props = {};

const Banks = observer((props: Props) => {
	const { banks, updateFilter } = banksStore();
	const [open, setOpen] = useState(false);
	return (
		<div className="flex-col space-y-5">
			<Dialog open={open} onOpenChange={(open) => setOpen(open)}>
				<ActionsBox onSearch={updateFilter} />

				<NewBankForm closeDialog={() => setOpen(false)} />
			</Dialog>
			<div className="flex gap-10 flex-row flex-wrap items-center justify-evenly">
				{banks.map((bank) => (
					<BankCard key={bank.id} bank={bank} />
				))}
			</div>
		</div>
	);
});

export default Banks;
