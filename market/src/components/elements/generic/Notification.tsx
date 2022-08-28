import tw from 'twin.macro';
import React, { Fragment, useState, useEffect } from 'react';
import { Transition } from '@headlessui/react';
import { HeroIcons } from '@/components/elements';

/*
 * example component
 *
 *	<Notification
 *	 show={show}
 *	 callback={(close: boolean) => setShow(close)}
 *	 type="error"
 *	 icon
 *  split
 *	 content={{ title: 'Title here', message: 'Message Here' }}
 *	 action={[
 *		 { name: 'Undo', run: () => console.log('undo'), primary: true },
 *		 { name: 'Dismiss', run: () => console.log('dismiss') },
 *	 ]}
 *  />
 *
 */

type MessageContent = {
	title: string;
	message?: string;
};

type ActionContent = {
	name: string;
	primary?: boolean;
	run: () => void | any;
};

type MessageType = 'error' | 'warning' | 'success' | 'generic';

const Notification = (props: {
	show: boolean;
	callback: any;
	content: MessageContent;
	type: MessageType;
	icon?: boolean;
	action?: Array<ActionContent>;
	split?: boolean;
}) => {
	const MessageIcon = () => {
		return props.type === 'error' ? (
			<HeroIcons icon="ExclamationCircleIcon" className="h-6 w-6 text-red-400" outline />
		) : props.type === 'warning' ? (
			<HeroIcons icon="ExclamationIcon" className="h-6 w-6 text-amber-500" outline />
		) : props.type === 'success' ? (
			<HeroIcons icon="CheckCircleIcon" className="h-6 w-6 text-green-400" outline />
		) : props.type === 'generic' ? (
			<HeroIcons icon="InformationCircleIcon" className="h-6 w-6 text-gray-500" outline />
		) : null;
	};

	return (
		<Fragment>
			<div aria-live="assertive" className="fixed inset-0 flex items-end px-4 py-6 pointer-events-none sm:p-6 sm:items-start">
				<div className="w-full flex flex-col items-center space-y-4 sm:items-end">
					<Transition
						show={props.show}
						as={Fragment}
						enter="transform ease-out duration-300 transition"
						enterFrom="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
						enterTo="translate-y-0 opacity-100 sm:translate-x-0"
						leave="transition ease-in duration-100"
						leaveFrom="opacity-100"
						leaveTo="opacity-0">
						{props.split ? (
							<div className="max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5 divide-x divide-gray-200">
								<div className="w-0 flex-1 flex items-center p-4">
									<div className="w-full">
										<p className="text-sm font-medium text-gray-900">{props.content.title}</p>
										{props.content.message && <p className="mt-1 text-sm text-gray-500">{props.content.message}</p>}
									</div>
								</div>
								<div className="flex">
									<div className="flex flex-col divide-y divide-gray-200">
										{props.action &&
											props.action.map((item: ActionContent) => {
												return (
													<div className="h-0 flex-1 flex">
														<button
															css={
																item.primary
																	? tw`w-full border border-transparent rounded-none rounded-tr-lg px-4 py-3 flex items-center justify-center text-sm font-medium text-cyan-600 hover:text-cyan-500 focus:outline-none focus:z-10 focus:ring-2 focus:ring-cyan-500`
																	: tw`w-full border border-transparent rounded-none rounded-br-lg px-4 py-3 flex items-center justify-center text-sm font-medium text-gray-700 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500`
															}
															onClick={() => {
																item.run();
																props.callback(false);
															}}>
															{item.name}
														</button>
													</div>
												);
											})}
									</div>
								</div>
							</div>
						) : (
							<div className="max-w-sm w-full bg-white shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden">
								<div className="p-4">
									<div className="flex items-start">
										{props.icon && (
											<div className="flex-shrink-0">
												<MessageIcon />
											</div>
										)}
										<div css={[props.icon && tw`ml-3 pt-0.5`, props.action && !props.content.message && tw`flex justify-between`, tw`w-0 flex-1`]}>
											<p className="text-sm font-medium text-gray-900">{props.content.title}</p>
											{props.content.message && <p className="mt-1 text-sm text-gray-500">{props.content.message}</p>}
											{props.action &&
												props.content.message &&
												props.action.map((item: ActionContent) => {
													return (
														<button
															type="button"
															onClick={item.run}
															css={[
																props.action?.indexOf(item) !== 0 && tw`ml-5`,
																item.primary ? tw`text-cyan-600 hover:text-cyan-500` : tw`text-gray-700 hover:text-gray-500`,
															]}
															className="mt-3 flex-shrink-0 bg-white rounded-md text-sm font-medium focus:outline-none">
															{item.name}
														</button>
													);
												})}
											{props.action &&
												!props.content.message &&
												props.action.map((item: ActionContent) => {
													return (
														<div className="flex">
															<button
																type="button"
																onClick={item.run}
																css={[
																	props.action?.indexOf(item) !== 0 && tw`-ml-7`,
																	item.primary ? tw`text-cyan-600 hover:text-cyan-500` : tw`text-gray-700 hover:text-gray-500`,
																]}
																className="bg-white rounded-md text-sm font-medium text-cyan-600 hover:text-cyan-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500">
																{item.name}
															</button>
														</div>
													);
												})}
										</div>
										<div className="ml-4 flex-shrink-0 flex">
											<button
												className="bg-white rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2"
												onClick={() => {
													props.callback(false);
												}}>
												<span className="sr-only">Close</span>
												<HeroIcons icon="XIcon" className="h-5 w-5" outline />
											</button>
										</div>
									</div>
								</div>
							</div>
						)}
					</Transition>
				</div>
			</div>
		</Fragment>
	);
};

export default Notification;
