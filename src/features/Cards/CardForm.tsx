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
import { languagesSchema } from "@/constants/constants";
import { banksStore } from "@/stores";
import { zodResolver } from "@hookform/resolvers/zod";
import { isEmpty } from "lodash";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const schema = z.object({
	name: languagesSchema,
	bank: z.string().min(1, { message: "Bank is required" }),
	logo: z.string().optional(),
	grade: languagesSchema,
	scheme: languagesSchema,
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
			className="h-[80%] overflow-auto"
		>
			<Form>
				<ImageUpload
					pathPrefix={"/cards"}
					path={getValues().logo}
					onChange={function (path: string): void {
						setValue("logo", path, { shouldValidate: true });
					}}
					cut
					onUploadStateChange={(uploading) => {
						setUploading(uploading);
					}}
					dims={{ width: 450, height: 275 }}
				/>
				<Input
					placeholder="Name (English)"
					{...register("name.en")}
					error={formState.errors.name?.en?.message}
				/>
				<Input
					placeholder="Name (Arabic)"
					{...register("name.ar")}
					error={formState.errors.name?.ar?.message}
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
					placeholder="Grade (English)"
					{...register("grade.en")}
					error={formState.errors.grade?.en?.message}
				/>
				<Input
					placeholder="Grade (Arabic)"
					{...register("grade.ar")}
					error={formState.errors.grade?.ar?.message}
				/>
				<Input
					placeholder="Scheme (English)"
					{...register("scheme.en")}
					error={formState.errors.scheme?.en?.message}
				/>
				<Input
					placeholder="Scheme (Arabic)"
					{...register("scheme.ar")}
					error={formState.errors.scheme?.ar?.message}
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
