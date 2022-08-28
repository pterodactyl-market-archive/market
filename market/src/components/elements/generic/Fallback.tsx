import { Spinner } from '@/components/elements/generic';
import { CSSTransition } from 'react-transition-group';
import { Offline } from 'react-detect-offline';
import tw from 'twin.macro';

const Fallback = () => {
	return (
		<Offline>
			<CSSTransition timeout={150} in appear classNames={'fade'}>
				<div tw='z-50 w-full bg-red-500 py-2 pointer-events-none'>
					<div tw='flex items-center justify-center'>
						<Spinner size={'small'} />
						<p css={tw`ml-2 text-sm text-red-50 font-semibold`}>We&apos;re having some trouble connecting to the internet, please wait...</p>
					</div>
				</div>
			</CSSTransition>
		</Offline>
	);
};

export default Fallback;
