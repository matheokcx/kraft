'use client';
import styles from './client-form.module.css';
import BackButton from '@/components/UI/Buttons/BackButton/BackButton';
import Separator from '@/components/UI/Separator';
import Input, { InputProps } from '@/components/UI/Input/Input';
import SelectField from '@/components/UI/SelectField/SelectField';
import { Client, ClientStatus, GENDER } from '@/generated/prisma';
import {
	BriefcaseIcon,
	CakeIcon,
	EnvelopeIcon,
	GenderIntersexIcon,
	LinkIcon,
	PhoneIcon,
	ThermometerIcon,
} from '@phosphor-icons/react/ssr';
import LinksList from '@/components/UI/LinksList';
import { useTranslations } from 'next-intl';
import { createClient, updateClient } from '@/app/(home)/clients/action';
import toast from 'react-hot-toast';
import { useActionState, useEffect } from 'react';

type ClientFormProps = {
	client?: Client;
};

const ClientForm = ({ client }: ClientFormProps) => {
	const t = useTranslations();
	const inputs: InputProps[] = [
		{
			type: 'text',
			name: 'lastName',
			label: t('lastName'),
			placeholder: 'Dubois',
			defaultValue: client?.lastName,
		},
		{
			type: 'text',
			name: 'firstName',
			label: t('firstName'),
			placeholder: 'Alex',
			defaultValue: client?.firstName,
		},
		{
			type: 'date',
			name: 'birthdate',
			label: t('birthdate'),
			placeholder: 'Alex',
			defaultValue: client?.birthdate?.toISOString().split('T')[0],
			icon: <CakeIcon size={24} />,
			required: false,
		},
		{
			type: 'text',
			name: 'job',
			label: t('job'),
			placeholder: 'CEO',
			defaultValue: client?.job,
			icon: <BriefcaseIcon size={24} />,
		},
		{
			type: 'email',
			name: 'mail',
			label: 'Mail',
			placeholder: 'alex.dubois@example.com',
			defaultValue: client?.mail ?? undefined,
			icon: <EnvelopeIcon size={24} />,
			required: false,
		},
		{
			type: 'tel',
			name: 'phone',
			label: '0707070707',
			placeholder: 'CEO',
			defaultValue: client?.phone ?? undefined,
			icon: <PhoneIcon size={24} />,
			required: false,
		},
		{
			type: 'file',
			name: 'image',
			label: t('clients.imageFileInputText'),
			required: false,
		},
	];

	const [createState, create, isCreating] = useActionState(createClient, null);
	const [updateState, edit, isUpdating] = useActionState(updateClient, null);

	if (client) {
		inputs.push({
			type: 'hidden',
			name: 'clientId',
			label: 'clientId',
			defaultValue: client.id,
		});
	}

	useEffect(() => {
		if (createState?.error) toast.error(createState.error);
	}, [createState]);

	useEffect(() => {
		if (updateState?.error) toast.error(updateState.error);
	}, [updateState]);

	return (
		<form action={client ? edit : create} className={styles.gridForm}>
			<div className={styles.titleRow}>
				<h1 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
					<BackButton />
					{client ? t('clients.updatePage.title') : t('clients.createPage.title')}
				</h1>
				<Separator widthPercent={30} />
			</div>
			<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
				<div style={{ display: 'grid', gap: '12px' }}>
					{inputs.map((input: InputProps, index: number) => (
						<Input key={index} {...input} />
					))}

					<button
						className={styles.valideFormButton}
						type="submit"
						disabled={isCreating || isUpdating}
					>
						{client ? t('edit') : t('create')}
					</button>
				</div>
				<div>
					<SelectField
						name="gender"
						label="Sex"
						values={Object.values(GENDER)}
						icon={<GenderIntersexIcon size={24} />}
						defaultValue={client?.gender}
					/>

					<SelectField
						name="status"
						label={t('status')}
						values={Object.values(ClientStatus)}
						icon={<ThermometerIcon size={24} />}
						defaultValue={client?.status}
					/>

					<label
						style={{
							display: 'flex',
							alignItems: 'center',
							gap: '5px',
							marginBottom: '10px',
						}}
					>
						<LinkIcon size={24} />
						{t('clients.associateLinksLabel')}
					</label>
					<LinksList existinglinks={client?.links} />
				</div>
			</div>
		</form>
	);
};

export default ClientForm;
