'use client';
import { editProfile } from '@/app/profile/edit/action';
import { useActionState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useTranslations } from 'next-intl';
import Input from '@/components/UI/Input/Input';
import SelectField from '@/components/UI/SelectField/SelectField';
import { GENDER } from '@/generated/prisma';
import styles from './profile-form.module.css';
import { User } from '@/types';

type ProfileFormProps = {
	user: User;
};

const ProfileForm = ({ user }: ProfileFormProps) => {
	const t = useTranslations();

	const [state, action, isLoading] = useActionState(editProfile, null);

	useEffect(() => {
		if (state?.error) {
			toast.error(state.error);
		}
	}, [state]);

	return (
		<form action={action} className={styles.profileForm}>
			<h2>Modifier votre profil</h2>
			<Input type="text" label={t('fullName')} name="name" defaultValue={user.name} />
			<Input type="email" label={t('mail')} name="email" defaultValue={user.email} />
			<Input
				type="date"
				label={t('birthdate')}
				name="birthdate"
				defaultValue={user.birthdate.toISOString().split('T')[0]}
			/>

			<SelectField
				label={t('gender')}
				name="gender"
				values={Object.values(GENDER)}
				defaultValue={user.gender}
			/>
			<SelectField
				label={t('country')}
				name="country"
				values={[
					'countries.france',
					'countries.belgium',
					'countries.switzerland',
					'countries.spain',
				]}
				defaultValue={user.country}
			/>

			<button type="submit" disabled={isLoading}>
				{t('edit')}
			</button>
		</form>
	);
};

export default ProfileForm;
