type Props = {
	children: React.ReactNode;
};

const Grid = ({ children }: Props) => {
	return (
		<div className="flex gap-10 flex-row flex-wrap items-start justify-between m-auto">
			{children}
		</div>
	);
};

export default Grid;
