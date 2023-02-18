import React, { useState, useEffect } from 'react';
import bridge from '@vkontakte/vk-bridge';
import { View, ScreenSpinner, AdaptivityProvider, AppRoot, ConfigProvider, SplitLayout, SplitCol } from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';
import '@rainbow-me/rainbowkit/styles.css'

import Home from './panels/Home';
import Persik from './panels/Persik';

import {
  getDefaultWallets,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import { configureChains, createClient, WagmiConfig } from 'wagmi';
import { mainnet, polygon, optimism, arbitrum } from 'wagmi/chains';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';
import { ConnectButton } from '@rainbow-me/rainbowkit';

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
        <WagmiConfig client={wagmiClient}>
        <RainbowKitProvider chains={chains}>
        <YourApp />
        </RainbowKitProvider>
        </WagmiConfig>
    );
}
export const YourApp = () => {
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
