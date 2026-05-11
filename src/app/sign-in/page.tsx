import styles from './sign-in-page.module.css';
import SignInForm from '@/components/UI/Forms/Auth/SignInForm/SignInForm';

const SignInPage = () => {
	return (
		<main className={styles.signInPage}>
			<SignInForm />
		</main>
	);
};

export default SignInPage;
