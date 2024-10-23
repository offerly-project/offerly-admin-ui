import { Card } from "../ui/card";

type Props = { src: string; alt: string };

const CardImage = ({ src, alt }: Props) => {
	return (
		<>
			{src ? (
				<img className="h-20 w-20 rounded-lg" src={src} alt="logo" />
			) : (
				<Card className="h-20 w-20 grid place-items-center">
					<p className="font-bold text-2xl">{alt}</p>
				</Card>
			)}
		</>
	);
};

export default CardImage;
