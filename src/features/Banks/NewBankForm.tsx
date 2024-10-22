import ImageUpload from "@/components/ImageUpload/ImageUpload";
import { Button } from "@/components/ui/button";
import {
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { axiosInstance } from "@/configs/configs";
import { BankType } from "@/entities/bank.entity";
import { useToast } from "@/hooks/use-toast";
import { CountriesService } from "@/services/countries.service";
import { banksStore } from "@/stores";
import { createErrorToastObject } from "@/utils/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { isEmpty } from "lodash";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { BANK_TYPES_LIST } from "./bank.constants";

type Props = {
	closeDialog: () => void;
};

const schema = z.object({
	name: z.string().min(1, { message: "Bank name is required" }),
	type: z.enum(["digital", "regular", "digital-wallet"]),
	country: z.string({ message: "Country is required" }).min(1),
});

type FormValues = z.infer<typeof schema>;

const NewBankForm = ({ closeDialog }: Props) => {
	const { register, handleSubmit, formState, reset, setValue } =
		useForm<FormValues>({
			resolver: zodResolver(schema),
		});

	const { toast } = useToast();
	const submittable = isEmpty(formState.errors);

	const [logo, setLogo] = useState<File | null>(null);

	const onSubmit = async (values: FormValues) => {
		try {
			const path = `/banks/${values.name.toLowerCase()}`;
			if (logo) {
				const formData = new FormData();
				formData.append("image", logo);
				formData.append("path", path);
				await axiosInstance.post("/uploads/images", formData);
			}
			banksStore().createBank({
				...values,
				logo: path,
			});
			toast({ description: "Bank created" });
			closeDialog();
		} catch (e: any) {
			toast(createErrorToastObject(e));
		}
	};

	return (
		<DialogContent
			className="w-96"
			onCloseAutoFocus={() => {
				reset();
				setLogo(null);
			}}
		>
			<DialogHeader>
				<DialogHeader>
					<DialogTitle>New Bank</DialogTitle>
				</DialogHeader>
				<div className="flex flex-col gap-4 pt-4">
					<ImageUpload
						value={logo}
						onChange={(file) => {
							setLogo(file);
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
						onClick={handleSubmit(onSubmit)}
					>
						Create
					</Button>
				</div>
			</DialogHeader>
		</DialogContent>
	);
};

export default NewBankForm;
