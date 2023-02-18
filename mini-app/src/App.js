import React, { useState, useEffect } from 'react';
import bridge from '@vkontakte/vk-bridge';
import { View, ScreenSpinner, AdaptivityProvider, AppRoot, ConfigProvider, SplitLayout, SplitCol } from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';
import '@rainbow-me/rainbowkit/styles.css'
import {
  getDefaultWallets,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import { configureChains, createClient, WagmiConfig } from 'wagmi';
import { mainnet, polygon, optimism, arbitrum } from 'wagmi/chains';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import Home from './panels/Home';
import Persik from './panels/Persik';
import CreateNew from './panels/CreateNewEvent';
import MyTicket from './panels/MyTickets';
import AvailableEvents from './panels/AvailableEvents';

import INFTicketsFactory from "../public/contracts/INFTicketsFactory.json";

import {
  useAccount,
  useConnect,
  useNetwork,
  useProvider,
  useContractWrite,
  useSignMessage,
  useSignTypedData,
} from "wagmi";

const { writeAsync: createEventWriteAsync } = useContractWrite({
  address: "",
  abi: INFTicketsFactory,
  functionName: "createEvent",
});

const createEventHandler = async (timestamp) => {
  let txn;
  try {
    txn = await (
      await createEventWriteAsync({
        recklesslySetUnpreparedArgs: [Math.floor(timestamp / 1000)],
      })
    ).wait();
  } catch (e) {
    throw new Error("Transaction failed!");
  }
};

const App = () => {
	const [activePanel, setActivePanel] = useState('home');
	const [fetchedUser, setUser] = useState(null);
	const [popout, setPopout] = useState(<ScreenSpinner size='large' />);
    const { chains, provider } = configureChains(
        [mainnet, polygon, optimism, arbitrum],
        [
            alchemyProvider({ apiKey: process.env.ALCHEMY_ID }),
            publicProvider()
        ]
    );

    const { connectors } = getDefaultWallets({
        appName: 'My RainbowKit App',
        chains
    });

    const wagmiClient = createClient({
        autoConnect: true,
        connectors,
        provider
    })
	useEffect(() => {
		async function fetchData() {
			const user = await bridge.send('VKWebAppGetUserInfo');
			setUser(user);
			setPopout(null);
		}
		fetchData();
	}, []);

	const go = e => {
		setActivePanel(e.currentTarget.dataset.to);
	};

	return (
		<ConfigProvider>
			<AdaptivityProvider>
				<AppRoot>
					<SplitLayout >
						<SplitCol>
							<View activePanel={activePanel}>
								<Home id='home' fetchedUser={fetchedUser} go={go} />
								<MyTicket id='mytickets' go={go} />
								<Persik id='persik' go={go} />
								<CreateNew id='create' go={go} />
								<AvailableEvents id='available' go={go} />

							</View>
							<WagmiConfig client={wagmiClient}>
								<RainbowKitProvider chains={chains}>
									<ConnectWalletApp />
								</RainbowKitProvider>
							</WagmiConfig>
						</SplitCol>
					</SplitLayout>
				</AppRoot>
			</AdaptivityProvider>
		</ConfigProvider>
	);
}
export const ConnectWalletApp = () => {
  return (
    <div
      style={{
        position: "absolute",
        top: 5,
        right: 5,
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}
    >
      <ConnectButton />
    </div>
  );
};
export default App;
