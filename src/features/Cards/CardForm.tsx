import Form from "@/components/Form/Form";
import ImageUpload from "@/components/ImageUpload/ImageUpload";
import { Button } from "@/components/ui/button";
import { DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { banksStore } from "@/stores";
import { zodResolver } from "@hookform/resolvers/zod";
import { isEmpty } from "lodash";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const schema = z.object({
	name: z.string().min(1, { message: "Card name is required" }),
	bank: z.string().min(1, { message: "Bank is required" }),
	logo: z.string().optional(),
	grade: z.string(),
	scheme: z.string(),
});

export type CardFormValues = z.infer<typeof schema>;

type Props = {
	initialValues?: CardFormValues;
	onSubmit: (values: CardFormValues) => Promise<void>;
};

const CardForm = ({ initialValues, onSubmit }: Props) => {
	const { formState, register, handleSubmit, reset, setValue, getValues } =
		useForm({
			resolver: zodResolver(schema),
			values: initialValues,
		});

	const [uploading, setUploading] = useState(false);
	const submittable = !uploading && isEmpty(formState.errors);

	return (
		<DialogContent
			onCloseAutoFocus={() => {
				reset();
			}}
		>
			<Form>
				<ImageUpload
					pathPrefix={"/cards"}
					path={getValues().logo}
					onChange={function (path: string): void {
						setValue("logo", path, { shouldValidate: true });
					}}
					onUploadStateChange={(uploading) => {
						setUploading(uploading);
					}}
					dims={{ width: 450, height: 275 }}
				/>
				<Input
					placeholder="Name"
					{...register("name")}
					error={formState.errors.name?.message}
				/>
				<Select
					value={getValues().bank}
					onValueChange={(value) =>
						setValue("bank", value, { shouldValidate: true })
					}
				>
					<SelectTrigger error={formState.errors.bank?.message}>
						<SelectValue placeholder="Bank" />
					</SelectTrigger>
					<SelectContent>
						{banksStore().banksList.map((bank) => (
							<SelectItem value={bank}>{bank}</SelectItem>
						))}
					</SelectContent>
				</Select>
				<Input
					placeholder="Grade"
					{...register("grade")}
					error={formState.errors.grade?.message}
				/>
				<Input
					placeholder="Scheme"
					{...register("scheme")}
					error={formState.errors.scheme?.message}
				/>
				<Button
					disabled={!submittable}
					variant={"outline"}
					onClick={handleSubmit((data) => onSubmit(data))}
				>
					{initialValues ? "Update" : "Create"}
				</Button>
			</Form>
		</DialogContent>
	);
};

export default CardForm;
