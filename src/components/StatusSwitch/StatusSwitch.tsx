import { ActiveStatusType } from "@/ts/api.types";
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";

type Props = {
	status: ActiveStatusType;
	onEnable: () => void;
	onDisable: () => void;
};

const StatusSwitch = ({ onEnable, onDisable, status }: Props) => {
	return (
		<div className="flex items-center space-x-2">
			<Label htmlFor="entity-status" className="text-red-500">
				Disabled
			</Label>
			<Switch
				id="entity-status"
				checked={status === "enabled"}
				onCheckedChange={(checked) => {
					if (checked) {
						onEnable();
					} else {
						onDisable();
					}
				}}
			/>
			<Label htmlFor="entity-status" className="text-green-500">
				Enabled
			</Label>
		</div>
	);
};

export default StatusSwitch;
