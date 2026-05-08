'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const LanguageButton = () => {
	const router = useRouter();
	const [selectedLanguage, setSelectedLanguage] = useState<string>('en');
	const languages: { value: string; text: string }[] = [
		{ value: 'en', text: 'English' },
		{ value: 'fr', text: 'Français' },
	];

	const handleLanguageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
		setSelectedLanguage(event.target.value);
		document.cookie = `locale=${event.target.value}`;
		router.refresh();
	};

	useEffect(() => {
		const value: string | undefined = document.cookie
			.split('; ')
			.find((row) => row.startsWith('locale='))
			?.split('=')[1];

		setSelectedLanguage(value || '');
	}, []);

	return (
		<select value={selectedLanguage} onChange={handleLanguageChange} style={{ width: '100%' }}>
			{languages.map((language: { value: string; text: string }) => (
				<option key={language.value} value={language.value}>
					{language.text}
				</option>
			))}
		</select>
	);
};

export default LanguageButton;
