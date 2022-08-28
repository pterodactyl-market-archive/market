import tw from 'twin.macro';
import { HeroBackground, Handshake } from '@/assets/images';

const Hero = () => (
	<div
		css={[
			tw`w-full h-96 border-b bg-zinc-100 bg-blend-multiply dark:bg-blend-luminosity border-zinc-300 dark:(bg-zinc-900 border-zinc-700) mb-12`,
			{ backgroundImage: `url(${HeroBackground})`, backgroundPosition: 'center bottom' },
		]}>
		<div css={tw`w-full h-full max-w-7xl mx-auto px-6 flex items-end justify-between gap-12`}>
			<div css={tw`h-full flex flex-1 flex-col justify-center text-center md:text-left`}>
				<h1 css={tw`text-5xl text-blue-600 dark:text-blue-500 font-bold`}>Pterodactyl Market</h1>
				<span css={tw`text-zinc-600 dark:text-zinc-400 pt-2`}>
					<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
					<p>Netus tincidunt faucibus tristique mattis mauris, lectus.</p>
				</span>
				<div css={tw`inline-flex space-x-6 items-start justify-start mt-10`}>
					<button tw='flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-all hover:shadow'>
						Start browsing
					</button>
					<button tw='flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50 transition-all hover:shadow'>
						Learn more
					</button>
				</div>
			</div>
			<img src={Handshake} css={tw`hidden md:block -mb-0.5`} alt='Pterodactyl Market Hero Image' />
		</div>
	</div>
);

export default Hero;
