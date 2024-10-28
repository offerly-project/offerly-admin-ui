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
import { BankType } from "@/entities/bank.entity";
import { CountriesService } from "@/services/countries.service";
import { zodResolver } from "@hookform/resolvers/zod";
import { isEmpty } from "lodash";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { BANK_TYPES_LIST } from "./bank.constants";

type Props = {
	initialValues?: BankFormValues;
	onSubmit: (values: BankFormValues) => Promise<void>;
};

const schema = z.object({
	name: z.string().min(1, { message: "Bank name is required" }),
	type: z.enum(["digital", "regular", "digital-wallet"]),
	country: z.string({ message: "Country is required" }).min(1),
	logo: z.string().optional(),
});

export type BankFormValues = z.infer<typeof schema>;

const BankForm = ({ initialValues, onSubmit }: Props) => {
	const { register, handleSubmit, formState, reset, setValue, getValues } =
		useForm<BankFormValues>({
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
			<>
				<Form>
					<ImageUpload
						pathPrefix={"/banks"}
						path={getValues().logo}
						onChange={(path) => {
							setValue("logo", path);
						}}
						dims={{ height: 400, width: 400 }}
						onUploadStateChange={(uploading) => {
							setUploading(uploading);
						}}
					/>
					<Input
						placeholder="Name"
						{...register("name")}
						error={formState.errors.name?.message}
					/>

					<Select
						onValueChange={(value) => {
							setValue("type", value as BankType, { shouldValidate: true });
						}}
						value={getValues().type}
					>
						<SelectTrigger error={formState.errors.type?.message}>
							<SelectValue placeholder="Type" />
						</SelectTrigger>
						<SelectContent>
							{BANK_TYPES_LIST.map((item) => (
								<SelectItem value={item.value}>{item.name}</SelectItem>
							))}
						</SelectContent>
					</Select>
					<Select
						value={getValues().country}
						onValueChange={(value) =>
							setValue("country", value, { shouldValidate: true })
						}
					>
						<SelectTrigger error={formState.errors.country?.message}>
							<SelectValue placeholder="Country" />
						</SelectTrigger>
						<SelectContent>
							{CountriesService.list.map((item) => (
								<SelectItem value={item.value}>{item.name}</SelectItem>
							))}
						</SelectContent>
					</Select>
					<Button
						disabled={!submittable}
						variant={"outline"}
						onClick={handleSubmit((data) => onSubmit(data))}
					>
						{initialValues ? "Update" : "Create"}
					</Button>
				</Form>
			</>
		</DialogContent>
	);
};

export default BankForm;
