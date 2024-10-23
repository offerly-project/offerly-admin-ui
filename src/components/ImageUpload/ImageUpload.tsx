import { faUpload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useMemo, useRef } from "react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";

type Props = {
	onChange: (file: File) => void;
	value?: File | null;
};

const ImageUpload = ({ onChange, value }: Props) => {
	const inputRef = useRef<HTMLInputElement>(null);

	const imageUrl = useMemo(() => {
		if (value) {
			const blob = new Blob([value]);
			return URL.createObjectURL(blob);
		} else {
			return null;
		}
	}, [value]);

	useEffect(() => {
		if (inputRef.current) {
			if (!value) {
				inputRef.current.value = null as unknown as string;
			}
		}
	}, [value]);

	return (
		<Card
			style={{ height: 250, width: 250 }}
			className="m-auto p-1 grid place-items-center"
			onClick={() => inputRef.current?.click()}
		>
			{imageUrl ? (
				<img
					src={imageUrl}
					style={{ height: 200, width: 200 }}
					className="rounded-lg"
				/>
			) : (
				<Button variant={"ghost"} className="h-full w-full">
					<div className="flex flex-row gap-2 items-center justify-center opacity-50">
						<FontAwesomeIcon icon={faUpload} />
						<span>Upload</span>
					</div>
				</Button>
			)}
			<input
				ref={inputRef}
				onChange={(e) => {
					onChange(e.target.files![0]);
				}}
				type="file"
				className="hidden"
			/>
		</Card>
	);
};

export default ImageUpload;
