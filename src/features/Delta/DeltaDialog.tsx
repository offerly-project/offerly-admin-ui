import LoadingIndicator from "@/components/LoadingIndicator/LoadingIndicator";
import { DialogContent } from "@/components/ui/dialog";
import { axiosInstance } from "@/configs/configs";
import { titleCase } from "@/utils/utils";
import { useEffect, useState } from "react";

type Props = { scrapperId: string; open: boolean };

interface IDelta {
	delta_added: string[];
	delta_removed: string[];
}

type DeltaData = {
	ar: IDelta;
	en: IDelta;
};

const DeltaDialog = ({ scrapperId, open }: Props) => {
	const [loading, setLoading] = useState(true);
	const [data, setData] = useState<DeltaData | null>(null);
	const [error, setError] = useState<Error | null>(null);

	useEffect(() => {
		if (open) {
			setLoading(true);
			axiosInstance
				.get(`/scrappers/delta/${scrapperId}`)
				.then((res) => {
					setData(res.data);
				})
				.catch((e) => {
					setError(e);
				})
				.finally(() => {
					setLoading(false);
				});
		}
		return () => {
			setData(null);
			setError(null);
			setLoading(true);
		};
	}, [scrapperId, open]);

	return (
		<DialogContent
			className="h-[75vh]"
			style={{ width: "90vw", minWidth: "80%" }}
		>
			{loading ? (
				<LoadingIndicator />
			) : error ? (
				<p>{error.message}</p>
			) : (
				<div className="flex flex-row gap-4">
					{/* English Offers */}
					<div className="w-[50%]">
						<p className="w-full text-center font-bold text-blue-500">
							English
						</p>
						<div className="flex flex-row gap-4">
							{/* Added Offers */}
							<div className="w-full">
								<p className="font-semibold text-center text-green-500">
									Added
								</p>
								<div className="h-[60vh] overflow-y-auto">
									{data?.en.delta_added.length ? (
										data.en.delta_added.map((item, index) => (
											<div
												key={item}
												className="py-1 border-b border-[rgba(255,255,255,0.2)]"
											>
												{`${titleCase(item)}`}
											</div>
										))
									) : (
										<p className="text-gray-500 text-center">
											No offers added.
										</p>
									)}
								</div>
							</div>
							{/* Removed Offers */}
							<div className="w-full">
								<p className="font-semibold text-center text-red-500">
									Removed
								</p>
								<div className="h-[60vh] overflow-y-auto">
									{data?.en.delta_removed.length ? (
										data.en.delta_removed.map((item, index) => (
											<div
												key={item}
												className="py-1 border-b border-[rgba(255,255,255,0.2)]"
											>
												{`${titleCase(item)}`}
											</div>
										))
									) : (
										<p className="text-gray-500 text-center">
											No offers removed.
										</p>
									)}
								</div>
							</div>
						</div>
					</div>

					{/* Arabic Offers */}
					<div className="w-[50%]">
						<p className="w-full text-center font-bold text-blue-500">Arabic</p>
						<div className="flex flex-row gap-4">
							{/* Added Offers */}
							<div className="w-full">
								<p className="font-semibold text-center text-green-500">
									Added
								</p>
								<div className="h-[60vh] overflow-y-auto">
									{data?.ar.delta_added.length ? (
										data.ar.delta_added.map((item, index) => (
											<div
												key={item}
												className="py-1 border-b border-[rgba(255,255,255,0.2)]"
											>
												{`${titleCase(item)}`}
											</div>
										))
									) : (
										<p className="text-gray-500 text-center">
											No offers added.
										</p>
									)}
								</div>
							</div>
							{/* Removed Offers */}
							<div className="w-full">
								<p className="font-semibold text-center text-red-500">
									Removed
								</p>
								<div className="h-[60vh] overflow-y-auto">
									{data?.ar.delta_removed.length ? (
										data.ar.delta_removed.map((item, index) => (
											<div
												key={item}
												className="py-1 border-b border-[rgba(255,255,255,0.2)]"
											>
												{`${titleCase(item)}`}
											</div>
										))
									) : (
										<p className="text-gray-500 text-center">
											No offers removed.
										</p>
									)}
								</div>
							</div>
						</div>
					</div>
				</div>
			)}
		</DialogContent>
	);
};

export default DeltaDialog;
