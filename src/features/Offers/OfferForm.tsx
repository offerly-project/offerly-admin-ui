import ImageUpload from "@/components/ImageUpload/ImageUpload";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/datepicker";
import { DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { MultiSelect } from "@/components/ui/multiselect";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { CategoriesService } from "@/services/categories.service";
import { cardsStore } from "@/stores";
import { numberValidator } from "@/utils/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { isEmpty } from "lodash";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const schema = z.object({
	terms_and_conditions: z
		.string()
		.min(1, { message: "Terms and conditions are required" }),
	description: z.string().min(1, { message: "Description is required" }),
	starting_date: z.coerce.date().optional(),
	expiry_date: z.coerce.date(),
	minimum_amount: z.string().optional().refine(numberValidator),
	cap: z.string().optional().refine(numberValidator),
	discount_code: z.string().optional(),
	logo: z.string().optional(),
	channel: z.enum(["online", "offline"]),
	categories: z.array(z.string(), { message: "Categories are required" }),
	applicable_cards: z.array(z.string(), {
		message: "Applicable cards are required",
	}),
	offer_source_link: z
		.string()
		.min(1, { message: "Offer source link is required" }),
});

export type OfferFormValues = z.infer<typeof schema>;

type Props = {
	onSubmit: (values: OfferFormValues) => Promise<void>;
	initialValues?: OfferFormValues;
};

const OfferForm = ({ onSubmit, initialValues }: Props) => {
	const { formState, handleSubmit, getValues, setValue, register, reset } =
		useForm({
			resolver: zodResolver(schema),
			values: initialValues,
		});

	const [uploading, setUploading] = useState(false);
	const submittable = !uploading && isEmpty(formState.errors);

	const categories = CategoriesService.categories;
	const cards = cardsStore().cards;

	console.log(categories, cards);

	return (
		<DialogContent
			style={{ width: "95vw", maxWidth: "100vw" }}
			onCloseAutoFocus={() => reset()}
		>
			<ImageUpload
				pathPrefix={"/offers"}
				path={getValues().logo}
				onUploadStateChange={setUploading}
				onChange={(value) => setValue("logo", value, { shouldValidate: true })}
				dims={{ width: 200, height: 200 }}
			/>
			<div className="grid grid-cols-4 grid-rows-2 gap-4 items-center">
				<Textarea
					placeholder="Terms & Conditions"
					className="resize-none"
					{...register("terms_and_conditions")}
					error={formState.errors.terms_and_conditions?.message}
				/>
				<Textarea
					placeholder="Description"
					className="resize-none"
					{...register("description")}
					error={formState.errors.description?.message}
				/>
				<Select
					value={getValues().channel}
					onValueChange={(value: "online" | "offline") =>
						setValue("channel", value, { shouldValidate: true })
					}
				>
					<SelectTrigger error={formState.errors.channel?.message}>
						<SelectValue placeholder="Channel" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value={"online"}>Online</SelectItem>
						<SelectItem value={"offline"}>Offline</SelectItem>
					</SelectContent>
				</Select>
				<Input
					placeholder="Source Link"
					{...register("offer_source_link")}
					error={formState.errors.offer_source_link?.message}
				/>

				<Input
					placeholder="Minimum Amount"
					error={formState.errors.minimum_amount?.message}
					{...register("minimum_amount")}
				/>
				<Input
					placeholder="Cap"
					error={formState.errors.cap?.message}
					{...register("cap")}
				/>
				<Input placeholder="Discount Code" {...register("discount_code")} />

				<DatePicker
					label="Starting Date"
					value={getValues().starting_date}
					onChange={(date) =>
						setValue("starting_date", date, { shouldValidate: true })
					}
					error={formState.errors.starting_date?.message}
				/>
				<DatePicker
					label="Expiry Date"
					value={getValues().expiry_date}
					onChange={(date) =>
						date && setValue("expiry_date", date, { shouldValidate: true })
					}
					error={formState.errors.expiry_date?.message}
				/>
				<MultiSelect
					options={categories.map((category) => ({
						label: category,
						value: category,
					}))}
					defaultValue={getValues().categories}
					onValueChange={(value) =>
						setValue("categories", value, { shouldValidate: true })
					}
					value={getValues().categories}
					placeholder="Categories"
					error={formState.errors.categories?.message}
				/>
				<MultiSelect
					error={formState.errors.applicable_cards?.message}
					options={cards.map((card) => ({
						label: card.name,
						value: card.id,
					}))}
					defaultValue={getValues().applicable_cards}
					value={getValues().applicable_cards}
					onValueChange={(value) =>
						setValue("applicable_cards", value, { shouldValidate: true })
					}
					placeholder="Cards"
				/>
			</div>
			<Button
				disabled={!submittable}
				onClick={handleSubmit(onSubmit)}
				variant={"outline"}
				className="w-[100px] m-auto"
			>
				Submit
			</Button>
		</DialogContent>
	);
};

export default OfferForm;
