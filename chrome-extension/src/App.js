import React, { useState } from 'react';
import clsx from 'clsx';
import { useAccount, useConnect, useDisconnect, useContractWrite, useContractRead } from 'wagmi'
import { useWeb3Modal } from '../node_modules/@web3modal/wagmi/dist/esm/exports/react.js'
// import { useWeb3Modal } from '@web3modal/wagmi/react'

import { abi } from './utils/abi.js';

// import { useWallet } from './context/WalletProvider';

const contractAddress = '0xFF5916AAB47613988841c3d2FF137e40DaE3590d';
function App() {

  const { open } = useWeb3Modal()
  // const { isAuthenticated, connectWallet, disconnectWallet, account } = useWallet();
  const [tab, setTab] = useState(0);

  // const { connect, connectors, isLoading, pendingConnector } = useConnect()
  // const { disconnect } = useDisconnect()
  const { address, isConnecting, isConnected } = useAccount()

  const { data: writeData, isLoading: isWriting, isSuccess: isWriteSuccess, write } = useContractWrite({
    address: contractAddress,
    abi: abi,
    functionName: 'add',
  });

  const { data: readData, refetch } = useContractRead({
    address: contractAddress,
    abi: abi,
    functionName: 'getRecord',
    args: ['https://lemonde.fr'],
  });



  console.log({ address, isConnecting, isConnected, writeData, isWriting, isWriteSuccess, readData });

  return (
    <div className="w-[400px] h-[600px] bg-base-200/50 p-3 text-center">
      <header className="flex flex-col align-middle justify-evenly prose">
        <h1 className="mb-2 prose-lg">Git News</h1>
        <button className="btn btn-sm mb-2" onClick={() => open()}>Open Connect Modal</button>
        {/*{connectors.map((connector) => (*/}
        {/*    <button*/}
        {/*        className="btn btn-sm"*/}
        {/*        // disabled={!connector.ready}*/}
        {/*        key={connector.id}*/}
        {/*        onClick={() => {*/}
        {/*          if (isConnected) {*/}
        {/*            disconnect()*/}
        {/*          } else {*/}
        {/*            connect({connector})*/}
        {/*          }*/}
        {/*        }*/}
        {/*      }*/}
        {/*    >*/}
        {/*      {connector.name} {isConnected ? ' (disconnect)' : '(connect)'}*/}
        {/*      {isLoading &&*/}
        {/*          pendingConnector?.id === connector.id &&*/}
        {/*          ' (connecting)'}*/}
        {/*    </button>*/}
        {/*))}*/}
        {/*<button*/}
        {/*    className="btn btn-sm mb-4"*/}
        {/*    onClick={isAuthenticated ? disconnectWallet : connectWallet}*/}
        {/*    id="wallet-connect"*/}
        {/*>*/}
        {/*    {isAuthenticated ? "Disconnect Wallet" : "Connect Wallet"}*/}
        {/*</button>*/}
        <button
            className="btn btn-primary"
            onClick={() => {
              write({
                args: ['https://lemonde.fr', '0x0f186bb32930ee6759eda47aff152d9be149067d42fc3b48677c77548aedb392'],
                from: address,
                // value: parseEther('0.01'),
              })
            }}
        >
          Contribute Now!
        </button>
        {/*<button*/}
        {/*  className="btn btn-primary mt-2"*/}
        {/*  onClick={() => refetch()}*/}
        {/*>*/}
        {/*  Read*/}
        {/*</button>*/}
      </header>
        {isConnected
            ? (
                <section className="flex flex-col align-middle mt-2 justify-between h-[calc(100%-180px)] items-center">
                    {/*<div className="prose">*/}
                    {/*    <h3 className="prose-base">*/}
                    {/*        {tab === 0 ? 'Article History' : 'Rewards'}*/}
                    {/*    </h3>*/}
                    {/*</div>*/}
                    <div className="h-full w-full round flex flex-col overflow-auto mb-2 rounded-md pt-4 pr-4">
                        {tab === 0 ?
                            (<div>
                                <div className="indicator w-full mb-3">
                                    <span className="indicator-item badge badge-accent mr-6 mt-1">135+</span>
                                    <div className="card bg-secondary-content text-neutral-content hover:bg-secondary-content/80">
                                        <div className="card-body prose text-left p-3">
                                            <div className="flex mt-1">
                                                <span className="card-title prose prose-base m-0 p-0 mr-2">v1</span>
                                                <span className="truncate max-w-[300px] prose porse-sm">729b2c7a9b2458436f1b6fedd90696e09da07438cf6df47b961fb9093363e13d</span>
                                            </div>
                                            <p className="prose-sm m-0 p-0">NY Times - Netanyahu Appears to Rebuff Blinken’s Request for Humanitarian Pauses</p>
                                            <a className="truncate max-w-[350px] link link-secondary m-0 p-0 prose prose-sm">https://www.nytimes.com/2023/11/03/technology/israel-hamas-information-war.html</a>
                                        </div>
                                    </div>
                                </div>
                                <div className="indicator w-full mb-3">
                                    <span className="indicator-item badge badge-accent mr-6 mt-1">33+</span>
                                    <div className="card bg-secondary-content text-neutral-content hover:bg-secondary-content/80">
                                        <div className="card-body prose text-left p-3">
                                            <div className="flex mt-1">
                                                <span className="card-title prose prose-base m-0 p-0 mr-2">v2</span>
                                                <span className="truncate max-w-[300px] prose porse-sm">dba9bdf4d07e0baa70fb16170eef63429c706af1da53160cb668182e8cf9c432</span>
                                            </div>
                                            <p className="prose-sm m-0 p-0">NY Times - Netanyahu Appears to Rebuff Blinken’s Request for Humanitarian Pauses</p>
                                            <a className="truncate max-w-[350px] link link-secondary m-0 p-0 prose prose-sm">https://www.nytimes.com/2023/11/03/technology/israel-hamas-information-war.html</a>
                                        </div>
                                    </div>
                                </div>
                                <div className="indicator w-full mb-3">
                                    <span className="indicator-item badge badge-accent mr-6 mt-1">12+</span>
                                    <div className="card bg-secondary-content text-neutral-content hover:bg-secondary-content/80">
                                        <div className="card-body prose text-left p-3">
                                            <div className="flex mt-1">
                                                <span className="card-title prose prose-base m-0 p-0 mr-2">v3</span>
                                                <span className="truncate max-w-[300px] prose porse-sm">09a2da24847a1dce454a4a40724f379e594113a7a9ed353e9dc310ca2dedd30e</span>
                                            </div>
                                            <p className="prose-sm m-0 p-0">NY Times - Netanyahu Appears to Rebuff Blinken’s Request for Humanitarian Pauses</p>
                                            <a className="truncate max-w-[350px] link link-secondary m-0 p-0 prose prose-sm">https://www.nytimes.com/2023/11/03/technology/israel-hamas-information-war.html</a>
                                        </div>
                                    </div>
                                </div>
                            </div>)
                            : (<div>
                                <div className="stat">
                                    <div className="stat-desc text-primary">{address}</div>
                                    <div className="stat-value">233.11 GN</div>
                                    <div className="stat-title">Rewards for Contributions</div>
                                    <div className="stat-desc text-secondary">151 contributions</div>
                                </div>
                                <div className="stat">
                                    <label className="label">
                                        <span className="label-text">E-Mail?</span>
                                        <span className="label-text-alt">Get notified <input type="checkbox" checked="checked" className="checkbox checkbox-sm checkbox-primary" /></span>
                                    </label>
                                    <div className="join">
                                        <input type="text" placeholder="ex.: me@mail.com" className="input input-bordered input-primary w-full max-w-xs join-item" />
                                        <button className="btn join-item rounded-r-full btn-outline">Save</button>
                                    </div>
                                </div>
                            </div>)
                        }
                    </div>
                    <div className="tabs tabs-boxed w-fit">
                        <a className={clsx('tab', tab === 0 && 'tab-active')} onClick={() => setTab(0)}>History</a>
                        <a className={clsx('tab', tab === 1 && 'tab-active')} onClick={() => setTab(1)}>Account</a>
                    </div>
                </section>
            )
            : null
        }
    </div>
  );
}

export default App;
