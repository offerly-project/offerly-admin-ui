import { offersStore } from "@/stores";
import { observer } from "mobx-react-lite";

type Props = {};

const Offers = observer((props: Props) => {
	console.log(offersStore().offers);

	return <div>Offers</div>;
});

export default Offers;
