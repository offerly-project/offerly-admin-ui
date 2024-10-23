import ActionsBox from "@/components/ActionsBox/ActionsBox";
import { Dialog } from "@/components/ui/dialog";
import { axiosInstance } from "@/configs/configs";
import { useToast } from "@/hooks/use-toast";
import { banksStore } from "@/stores";
import { createErrorToastObject } from "@/utils/utils";
import { observer } from "mobx-react-lite";
import { useState } from "react";
import BankCard from "./BankCard";
import BankForm, { BankFormValues } from "./BankForm";

type Props = {};

const Banks = observer((props: Props) => {
	const { banks, updateFilter } = banksStore();
	const [open, setOpen] = useState(false);
	const { toast } = useToast();
	const onNewBankSubmit = async ({ logo, ...values }: BankFormValues) => {
		try {
			const path = `/banks/${values.name.toLowerCase()}.png`;
			if (logo) {
				const formData = new FormData();
				formData.append("image", logo);
				formData.append("path", path);
				await axiosInstance.post("/uploads/images", formData);
			}

			banksStore().createBank({
				...values,
				logo: logo ? path : undefined,
			});
			toast({ description: "Bank created" });
			setOpen(false);
		} catch (e: any) {
			toast(createErrorToastObject(e));
		}
	};

	return (
		<div className="flex-col space-y-5">
			<Dialog open={open} onOpenChange={(open) => setOpen(open)}>
				<ActionsBox onSearch={updateFilter} />

				<BankForm onSubmit={onNewBankSubmit} />
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
