import { Spinner } from '@/components/elements/generic';
import tw from 'twin.macro';

const Loading = () => {
	return (
		<div css={tw`w-full h-screen flex justify-center items-center`}>
			<div>
				<Spinner size='large' isBlue />
			</div>
		</div>
	);
};

export default Loading;
