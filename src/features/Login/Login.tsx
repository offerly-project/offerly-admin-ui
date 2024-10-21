import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { userStore } from "@/stores";
import { zodResolver } from "@hookform/resolvers/zod";
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

	const onSubmit = (data: FormValues) => {
		userStore().login(data.username, data.password);
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
