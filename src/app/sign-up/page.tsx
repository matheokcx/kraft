import styles from './sign-up-page.module.css';
import SignUpForm from '@/components/UI/Forms/Auth/SignUpForm/SignUpForm';

const SignUpPage = () => {
	return (
		<main className={styles.signUpPage}>
			<SignUpForm />
		</main>
	);
};

export default SignUpPage;
