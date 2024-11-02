import {
	BlockTypeSelect,
	BoldItalicUnderlineToggles,
	headingsPlugin,
	InsertThematicBreak,
	linkDialogPlugin,
	listsPlugin,
	ListsToggle,
	MDXEditor,
	thematicBreakPlugin,
	toolbarPlugin,
	UndoRedo,
} from "@mdxeditor/editor";
import "@mdxeditor/editor/style.css";
import { useMemo, useState } from "react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
type Props = {
	placeholder?: string;
	value?: string;
	onChange?: (value: string) => void;
	className?: string;
	error?: string;
};

const MarkdownEditor = ({
	placeholder,
	value,
	onChange,
	className,
	error,
}: Props) => {
	const label = useMemo(() => {
		const label = [placeholder];
		if (value) {
			label.push("Filled");
		} else {
			label.push("Empty");
		}
		return label.join(" : ");
	}, [value, placeholder]);
	const [state, setState] = useState(value || "");
	const [open, setOpen] = useState(false);
	const onSave = () => {
		setOpen(false);
		onChange?.(state);
	};
	return (
		<Dialog
			open={open}
			onOpenChange={(val) => {
				if (!val) {
					setState(value || "");
				}
				setOpen(val);
			}}
		>
			<DialogTrigger>
				<div className="w-full">
					<Button variant={"outline"} className={"w-full " + className}>
						{label}
					</Button>
					{error && <p className="text-red-600 text-sm bg">{error}</p>}
				</div>
			</DialogTrigger>
			<DialogContent className="pt-16">
				<Card className="pb-8">
					<MDXEditor
						autoFocus
						trim
						placeholder={placeholder}
						plugins={[
							headingsPlugin(),
							linkDialogPlugin(),
							listsPlugin({}),
							thematicBreakPlugin(),
							toolbarPlugin({
								toolbarClassName: "bg-zinc-900",
								toolbarContents: () => (
									<>
										<BlockTypeSelect />
										<UndoRedo />
										<BoldItalicUnderlineToggles />
										<ListsToggle options={["bullet", "number"]} />
										<InsertThematicBreak />
									</>
								),
							}),
						]}
						className="dark-theme h-[300px] w-full overflow-scroll prose"
						markdown={state}
						onChange={setState}
					/>
				</Card>

				<Button
					variant={"ghost"}
					className="w-[100px] ml-auto"
					onClick={onSave}
				>
					Save
				</Button>
			</DialogContent>
		</Dialog>
	);
};

export default MarkdownEditor;
