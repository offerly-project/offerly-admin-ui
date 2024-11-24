import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { userStore } from "@/stores";
import { createErrorToastObject } from "@/utils/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

type Props = {};

const schema = z.object({
	username: z.string().min(1, { message: "Username is required" }),
	password: z.string().min(1, { message: "Password is required" }),
});

type FormValues = z.infer<typeof schema>;

const Login = (props: Props) => {
	const { register, handleSubmit, formState } = useForm<FormValues>({
		resolver: zodResolver(schema),
	});

	const [rememberMe, setRememberMe] = useState(
		localStorage.getItem("remember_me") === "true"
	);
	const { toast } = useToast();

	const onSubmit = (data: FormValues) => {
		userStore()
			.login(data.username, data.password, rememberMe)
			.catch((err) => {
				toast(createErrorToastObject(err));
			});
	};

	return (
		<Card className="w-80">
			<CardHeader>
				<CardTitle>Login</CardTitle>
			</CardHeader>
			<CardContent className="space-y-5">
				<Input
					placeholder="Username"
					{...register("username")}
					error={formState.errors.username?.message}
				/>
				<Input
					placeholder="Password"
					type="password"
					{...register("password")}
					error={formState.errors.password?.message}
				/>
				<div className="flex-row flex gap-2 align-center">
					<div className="h-[30px] place-items-center grid">
						<Checkbox
							checked={rememberMe}
							onCheckedChange={() => {
								setRememberMe(!rememberMe);
							}}
						/>
					</div>
					<p className="text-white pt-[2px]">Remember me</p>
				</div>
				<div className="text-center">
					<Button variant={"outline"} onClick={handleSubmit(onSubmit)}>
						Submit
					</Button>
				</div>
			</CardContent>
		</Card>
	);
};

export default Login;
