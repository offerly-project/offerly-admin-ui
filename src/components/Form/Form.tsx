type Props = { children: React.ReactNode };

const Form = ({ children }: Props) => {
	return <div className="flex flex-col gap-4 pt-4">{children}</div>;
};

export default Form;
