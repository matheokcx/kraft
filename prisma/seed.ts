import { prismaClient } from '@/lib/prisma';
import bcrypt from 'bcrypt';
import { fakerFR as faker } from '@faker-js/faker';
import { ClientStatus, ProjectDifficulty } from '@/generated/prisma';

const randomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

async function main(): Promise<void> {
	await prismaClient.clientNote.deleteMany();
	await prismaClient.meeting.deleteMany();
	await prismaClient.file.deleteMany();
	await prismaClient.project.deleteMany();
	await prismaClient.client.deleteMany();
	await prismaClient.user.deleteMany();

	console.log('\n=== Démarrage du seeding de la base de données ===');

	const usersNumber: number = 10;
	console.log(`\n\n-- Ajout des utilisateurs (${usersNumber + 1}) --`);
	const me = await prismaClient.user.create({
		data: {
			name: 'Deleplanque Mathéo',
			email: 'matheo.deleplanque@gmail.com',
			password: await bcrypt.hash('test12345678', 10),
			birthdate: new Date('2005-12-11'),
		},
	});
	for (let i = 0; i < usersNumber; i++) {
		const userFirstName: string = faker.person.firstName();
		const userLastName: string = faker.person.lastName();

		await prismaClient.user.create({
			data: {
				name: `${userLastName} ${userFirstName}`,
				email: faker.internet.email({ firstName: userFirstName, lastName: userLastName }),
				password: await bcrypt.hash('password', 10),
				birthdate: faker.date.birthdate({ min: 18, max: 60, mode: 'age' }),
				gender: faker.helpers.arrayElement(['MALE', 'FEMALE']),
			},
		});
	}

	const clientNumber: number = 30;
	console.log(`\n-- Ajout des clients (${clientNumber}) et leurs projets --`);
	for (let i = 0; i < clientNumber; i++) {
		const sex = faker.person.sexType().toUpperCase() as 'MALE' | 'FEMALE';
		const firstName: string = faker.person.firstName(sex.toLowerCase() as any);
		const lastName: string = faker.person.lastName();
		const status: ClientStatus = faker.helpers.weightedArrayElement([
			{ weight: 40, value: 'LEAD' },
			{ weight: 40, value: 'SIGNED' },
			{ weight: 10, value: 'LOST' },
			{ weight: 10, value: 'ARCHIVED' },
		]);

		const newClient = await prismaClient.client.create({
			data: {
				firstName: firstName,
				lastName: lastName,
				job: faker.person.jobType(),
				mail: faker.internet.email({ firstName, lastName }),
				status: status as ClientStatus,
				gender: sex === 'MALE' ? 'MALE' : 'FEMALE',
				freelanceId: me.id,
				phone: faker.phone.number({ style: 'national' }),
				links: [faker.internet.url(), faker.internet.url()],
				notes: {
					create: Array.from({ length: randomInt(0, 5) }).map(() => ({
						text: faker.lorem.words(randomInt(5, 15)),
						createdAt: faker.date.recent({ days: 60 }),
					})),
				},
			},
		});

		if (status === 'SIGNED' || status === 'ARCHIVED') {
			const projectsNumber: number = randomInt(1, 3);

			for (let i = 0; i < projectsNumber; i++) {
				const isFinish: boolean = Math.random() > 0.7;
				const projectStartDate: Date = isFinish
					? faker.date.past({ years: 2 })
					: faker.date.recent({ days: 30 });
				const endDate = new Date(projectStartDate);
				endDate.setDate(endDate.getDate() + randomInt(15, 90));

				const project = await prismaClient.project.create({
					data: {
						title: faker.commerce.productName(),
						description: faker.lorem.sentences(2),
						startDate: projectStartDate,
						endDate: endDate,
						cost: parseFloat(faker.commerce.price({ min: 1000, max: 20000 })),
						difficulty: faker.helpers.arrayElement([
							'EASY',
							'MEDIUM',
							'HARD',
							'EXPERT',
						]),
						clientId: newClient.id,
						meetings: {
							create: Array.from({ length: randomInt(0, 5) }).map(() => {
								const meetingStartDate: Date = faker.date.between({
									from: projectStartDate,
									to: endDate,
								});
								const meetingEndDate: Date = new Date(meetingStartDate);
								meetingEndDate.setHours(meetingEndDate.getHours() + 2);
								return {
									title: 'Point avancement ' + faker.word.noun(),
									description: faker.lorem.sentence(),
									startHour: meetingStartDate,
									endHour: meetingEndDate,
								};
							}),
						},
					},
				});

				if (Math.random() > 0.6) {
					const difficulty: ProjectDifficulty = faker.helpers.weightedArrayElement([
						{ weight: 40, value: 'EASY' },
						{ weight: 30, value: 'MEDIUM' },
						{ weight: 20, value: 'HARD' },
						{ weight: 10, value: 'EXPERT' },
					]);

					await prismaClient.project.create({
						data: {
							title: 'Sous-projet : ' + faker.hacker.verb(),
							description: 'Développement spécifique',
							startDate: projectStartDate,
							endDate: new Date(projectStartDate.getTime() + 7 * 24 * 60 * 60 * 1000),
							cost: parseFloat(faker.commerce.price({ min: 1000, max: 5000 })),
							difficulty: difficulty,
							clientId: newClient.id,
							parentProjectId: project.id,
						},
					});
				}
			}
		}
	}
}

main();
