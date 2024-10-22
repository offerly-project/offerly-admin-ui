import ActionsBox from "@/components/ActionsBox/ActionsBox";
import LoadingIndicator from "@/components/LoadingIndicator/LoadingIndicator";
import { banksStore } from "@/stores";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import BankCard from "./BankCard";

type Props = {};

const Banks = observer((props: Props) => {
	const { banks, shouldFetch, fetchBanks, updateFilter } = banksStore();
	const [loading, setLoading] = useState(shouldFetch());
	useEffect(() => {
		if (loading) {
			fetchBanks().finally(() => {
				setLoading(false);
			});
		}
	}, []);

	return loading ? (
		<LoadingIndicator fullHeightAndWidth />
	) : (
		<div className="flex-col space-y-5">
			<ActionsBox onSearch={updateFilter} />
			<div className="flex-row flex-wrap">
				{banks.map((bank) => (
					<BankCard key={bank.id} bank={bank} />
				))}
			</div>
		</div>
	);
});

export default Banks;
