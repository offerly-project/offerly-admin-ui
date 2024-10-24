type Props = {
	children: React.ReactNode;
};

const Grid = ({ children }: Props) => {
	return (
		<div className="flex gap-10 flex-row flex-wrap items-center justify-evenly">
			{children}
		</div>
	);
};

export default Grid;
