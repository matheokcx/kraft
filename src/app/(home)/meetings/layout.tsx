import { ReactNode } from 'react';

const MeetingsLayout = ({ children, modal }: { children: ReactNode; modal: ReactNode }) => {
	return (
		<>
			{children}
			{modal}
		</>
	);
};

export default MeetingsLayout;
