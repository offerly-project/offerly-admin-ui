import Login from "@/features/Login/Login";
import styles from "./LoginPage.module.scss";

type Props = {};

const LoginPage = (props: Props) => {
	return (
		<div className={styles.container}>
			<Login />
		</div>
	);
};

export default LoginPage;
