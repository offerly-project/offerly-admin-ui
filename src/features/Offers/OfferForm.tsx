import ImageUpload from "@/components/ImageUpload/ImageUpload";
import MarkdownEditor from "@/components/Markdown/MarkdownEditor";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/datepicker";
import { DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MultiSelect } from "@/components/ui/multiselect";
import { expiryDateSchema, languagesSchema } from "@/constants/constants";
import { CategoriesService } from "@/services/categories.service";
import { cardsStore } from "@/stores";
import { ChannelType } from "@/ts/api.types";
import { numberValidator } from "@/utils/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { isEmpty } from "lodash";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const schema = z.object({
	terms_and_conditions: languagesSchema,
	description: languagesSchema,
	starting_date: z.coerce
		.date({
			invalid_type_error: "Starting date is required",
			required_error: "Starting date is required",
			message: "Starting date is required",
		})
		.optional(),
	expiry_date: expiryDateSchema,
	minimum_amount: z.string().optional().refine(numberValidator),
	cap: z.string().optional().refine(numberValidator),
	discount_code: z.string().optional(),
	logo: z.string().optional(),
	channels: z
		.array(z.enum(["online", "in-store"], { message: "Channel is required" }))
		.min(1, { message: "at least one channel is required" }),
	categories: z.array(z.string(), { message: "Categories are required" }),
	applicable_cards: z
		.array(z.string(), {
			message: "Applicable cards are required",
		})
		.min(1),
	offer_source_link: z.string({ message: "Offer source link is required" }),
	title: languagesSchema,
});

export type OfferFormValues = z.infer<typeof schema>;

const CHANNELS: ChannelType[] = ["in-store", "online"];

type Props = {
	onSubmit: (values: OfferFormValues) => Promise<void>;
	initialValues?: OfferFormValues;
	open?: boolean;
};

const OfferForm = ({ onSubmit, initialValues, open }: Props) => {
	const {
		formState,
		handleSubmit,
		getValues,
		setValue,
		clearErrors,
		register,
		reset,
		setError,
	} = useForm({
		resolver: zodResolver(schema),
		values: initialValues,
	});

	const [uploading, setUploading] = useState(false);
	const submittable = !uploading && isEmpty(formState.errors);

	const categories = CategoriesService.categories;
	const cards = cardsStore().cards;

	useEffect(() => {
		if (!open) {
			clearErrors();
			return;
		}
		register("description.en");
		register("description.ar");
		register("terms_and_conditions.en");
		register("terms_and_conditions.ar");
	}, [open]);

	return (
		<DialogContent
			className="h-[90vh] overflow-auto"
			onCloseAutoFocus={() => reset()}
		>
			{/* Required Fields */}
			<>
				<ImageUpload
					pathPrefix={"/offers"}
					path={getValues().logo}
					fit
					onUploadStateChange={setUploading}
					onChange={(value) =>
						setValue("logo", value, { shouldValidate: true })
					}
					dims={{ width: 200, height: 200 }}
				/>
				<Input
					placeholder="Title (English)"
					{...register("title.en")}
					error={formState.errors.title?.en?.message}
				/>
				<Input
					placeholder="Title (Arabic)"
					{...register("title.ar")}
					error={formState.errors.title?.ar?.message}
				/>
				<MarkdownEditor
					placeholder="Description (English)"
					value={getValues()?.description?.en}
					onChange={(value) =>
						setValue("description.en", value, { shouldValidate: true })
					}
					error={formState.errors.description?.en?.message}
				/>
				<MarkdownEditor
					placeholder="Description (Arabic)"
					value={getValues()?.description?.ar}
					onChange={(value) =>
						setValue("description.ar", value, { shouldValidate: true })
					}
					error={formState.errors.description?.ar?.message}
				/>
				<MarkdownEditor
					placeholder="Terms & Conditions (English)"
					value={getValues()?.terms_and_conditions?.en}
					onChange={(value) =>
						setValue("terms_and_conditions.en", value, {
							shouldValidate: true,
						})
					}
					error={formState.errors.terms_and_conditions?.en?.message}
				/>
				<MarkdownEditor
					placeholder="Terms & Conditions (Arabic)"
					value={getValues()?.terms_and_conditions?.ar}
					onChange={(value) =>
						setValue("terms_and_conditions.ar", value, {
							shouldValidate: true,
						})
					}
					error={formState.errors.terms_and_conditions?.ar?.message}
				/>

				<MultiSelect
					options={CHANNELS.map((channel) => ({
						label: channel === "in-store" ? "In Store" : "Online",
						value: channel,
					}))}
					defaultValue={getValues().channels}
					onValueChange={(value) =>
						setValue("channels", value as ChannelType[], {
							shouldValidate: true,
						})
					}
					value={getValues().channels}
					placeholder="Channels"
					error={formState.errors.channels?.message}
				/>
				{/* <DatePicker
					label="Expiry Date"
					value={getValues().expiry_date}
					onChange={(date) =>
						date && setValue("expiry_date", date, { shouldValidate: true })
					}
					error={formState.errors.expiry_date?.message}
				/> */}
				<div className="grid w-full max-w-sm items-center gap-3">
					<Label className="pl-2" htmlFor="exipryDate">
						Exipry Date:
					</Label>
					<Input
						id="exipryDate"
						placeholder="DD/MM/YYYY"
						error={formState.errors.expiry_date?.message}
						{...register("expiry_date")}
					/>
				</div>
				<MultiSelect
					options={CategoriesService.list.map((category) => ({
						label: category.name,
						value: category.value,
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
						label: card.name.en,
						value: card.id,
					}))}
					defaultValue={getValues().applicable_cards}
					value={getValues().applicable_cards}
					onValueChange={(value) =>
						setValue("applicable_cards", value, { shouldValidate: true })
					}
					placeholder="Cards"
				/>
			</>

			<hr className="my-4" />

			{/* Optional Fields */}
			<>
				<DatePicker
					label="Starting Date"
					value={getValues().starting_date}
					onChange={(date) =>
						setValue("starting_date", date, { shouldValidate: true })
					}
					error={formState.errors.starting_date?.message}
				/>
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
			</>

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
