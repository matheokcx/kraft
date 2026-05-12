'use client';
import { useCallback, useEffect, useState } from 'react';
import { Client } from '@/generated/prisma';
import styles from './clients-list.module.css';
import ClientCard from '@/components/UI/Cards/Client/ClientCard';
import { useTranslations } from 'next-intl';
import Input from '@/components/UI/Input/Input';

type ClientListProps = {
	clientList: Client[];
};

const ClientList = ({ clientList = [] }: ClientListProps) => {
	const t = useTranslations();

	const [clients, setClients] = useState(clientList);
	const [filters, setFilters] = useState({
		job: "",
		birthdate: ""
	});

	const updateListWithFilters = useCallback(() => {
		if (filters.job.trim().length > 0) {
			setClients(clients.filter((client: Client) => client.job.includes(filters.job)));
		}
		if (filters.birthdate.trim().length > 0) {
			setClients(clients.filter((client: Client) => client.birthdate === new Date(filters.birthdate)));
		}
	}, [clients, filters, setClients]);

	useEffect(() => {
		updateListWithFilters();
	}, [filters]);

	return (
		<div className={styles.mainDiv}>
			<div className={styles.filters}>
				<Input
					label={t('job')}
					value={filters.job}
					required={false}
					onChange={(event) => setFilters({ ...filters, job: event.target.value })}
				/>
				<Input
					type="date"
					label={t('birthdate')}
					value={filters.birthdate}
					required={false}
					onChange={(event) => setFilters({ ...filters, birthdate: event.target.value })}
				/>
			</div>
			<div className={styles.clientsList}>
				{clients.length === 0 && <p>{t('clients.noClients')}</p>}
				{clients.map((client: Client, index: number) => (
					<ClientCard key={index} client={client} />
				))}
			</div>
		</div>
	);
};

export default ClientList;
