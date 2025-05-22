/* eslint-disable @typescript-eslint/no-explicit-any */
export default function JSONStringify(props: { data: any }) {
	const { data } = props;

	return (
		<div
			style={{
				wordWrap: 'break-word',
				whiteSpace: 'pre',
				fontSize: '1.2rem',
			}}
		>
			{JSON.stringify(data, null, 8)}
		</div>
	);
}
