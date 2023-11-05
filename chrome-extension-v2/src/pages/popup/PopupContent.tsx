import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import { useWeb3Modal } from '@web3modal/wagmi/react'
import { useAccount, useContractWrite, useContractRead, useBalance, useWalletClient } from 'wagmi'
import { IExecDataProtector } from '@iexec/dataprotector';

import withSuspense from '@src/shared/hoc/withSuspense';
import withErrorBoundary from '@src/shared/hoc/withErrorBoundary';

import { polygonAbi } from '@src/shared/abi';
import emailStorage from '@src/shared/storages/emailStorage';
import { postArticle, getArchive } from "@src/shared/api";

import '@src/index.css';

const contractAddress = '0x468e28d8f409c62112818336c680b11c3f6ef6a0';
const decimals = 1000000000000000000;
const Popup = () => {
    const [currentUrl, setCurrentUrl] = useState('');
    const [history, setHistory] = useState();
    const [email, setEmail] = useState('');
    const [loadingContent, setLoadingContent] = useState(false);

    // Get current url on mount
    useEffect(() => {
        chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
            // console.log('DEBUG TABS', tabs);
            // console.log('DEBUG URL', tabs[0].url);
            setCurrentUrl(tabs[0].url);
        });
        emailStorage.get().then((initEmail) => {
            // console.log({ initEmail });
            if(initEmail) setEmail(initEmail);
        });
    }, [])

    const getHistory = async () => {
        if(currentUrl) {
            const { data } = await getArchive({ url: currentUrl });
            // console.log({ article: data.article })
            if(data.article) setHistory(data.article);
        }
    }

    // When we have a currentUrl we can fetch the history
    useEffect(() => {
        getHistory()
    }, [currentUrl])
  // const theme = useStorage(exampleThemeStorage);

  const web3Provider = useWalletClient();
  // const web3Provider = window.ethereum;
  // instantiate
  const dataProtector = new IExecDataProtector(web3Provider);

  const { open } = useWeb3Modal()
  const [tab, setTab] = useState(0);

  // const { connect, connectors, isLoading, pendingConnector } = useConnect()
  // const { disconnect } = useDisconnect()
  const { address, isConnecting, isConnected } = useAccount()

  const { data: writeData, isLoading: isWriting, isSuccess: isWriteSuccess, write } = useContractWrite({
    address: contractAddress,
    abi: polygonAbi,
    functionName: 'add',
  });

  const { data: readData, refetch } = useContractRead({
    address: contractAddress,
    abi: polygonAbi,
    functionName: 'getRecord',
    args: [currentUrl],
  });

    const { data: contribData, refetch: refetchContrib } = useContractRead({
        address: contractAddress,
        abi: polygonAbi,
        functionName: 'getContributions',
    });

    const { data: balanceData, refetch: refetchBalance } = useBalance({
        address: address,
        token: contractAddress,
    })

    useEffect(() => {
        setTimeout(() => {
            refetch();
            refetchBalance();
            refetchContrib();
            getHistory();
        }, 3000)
    }, [isWriteSuccess]);

    const matchArticle = (article: { [key: string]: Record<string, unknown> }, hash: string) => {
        // console.log({ article, hash });
        // find article where value of key hash is equal to hash
        if(article?.versions) {
            const allVersions = Object.values(article.versions);
            return allVersions.find((version) => '0x' + version.hash === hash);
        }
        return null
    }

  console.log({ address, isConnecting, isConnected, writeData, isWriting, isWriteSuccess, readData, dataProtector, contribData  });

  return (
    <div>
      <div className="w-[450px] h-[650px] bg-base-200/50 p-3 text-center">
      <header className="flex flex-col align-middle justify-evenly prose">
        <h1 className="mb-2 prose-lg">Git News</h1>
        <button className="btn btn-sm mb-2" onClick={() => open()}>Open Connect Modal</button>
        <button
            className={clsx('btn btn-primary', isWriting || loadingContent && 'btn-disabled')}
            onClick={async () => {
                setLoadingContent(true);
                const { data } = await postArticle({
                    url: currentUrl,
                    // walletAddress: address ? String(address) : null,
                    // Todo: hard-coded for now, pass the iExec NFT later
                    walletAddress: '0xD9c3169A81c570ECF667d5c685C5C37bbD65b820',
                });
                setLoadingContent(false);
                console.log({ data });
                const article = data?.article;
                const keys = Object.keys(article.versions);
                const lastKey = keys[keys.length - 1];
                const lastVersion = article?.versions[lastKey];
                console.log({ lastVersion })
                // @ts-ignore
                  await write({
                    args: [
                        currentUrl,
                        '0x' + lastVersion?.hash,
                    ],
                    from: address,
                  });
            }}
        >
          Contribute Now!
          {isWriting || loadingContent ? <span className="loading loading-spinner loading-xs"/> : null}
        </button>
      </header>
        {isConnected
            ? (
                <section className="flex flex-col align-middle mt-2 justify-between h-[calc(100%-180px)] items-center">
                    <div className="h-full w-full round flex flex-col overflow-auto mb-2 rounded-md pt-4 pr-4">
                        {tab === 0 ?
                            (<div>
                                {/* @ts-ignore */}
                                {readData?.length ? readData?.map((item, index) => {
                                    const version = matchArticle(history, item?.urlHash);
                                    return(
                                    <div className="indicator w-full mb-3" key={item.urlHash}>
                                    <span className="indicator-item badge badge-accent mr-6 mt-1">{Number(item.counter)}+</span>
                                    <div className="card bg-secondary-content text-neutral-content hover:bg-secondary-content/80">
                                        <div className="card-body prose text-left p-3">
                                            <div className="flex mt-1">
                                                <span className="card-title prose prose-base m-0 p-0 mr-2">v{index + 1}</span>
                                                <span className="truncate max-w-[300px] prose porse-sm">{item.urlHash}</span>
                                            </div>
                                            <p className="prose-sm m-0 p-0">{version?.title ? version.title : null}</p>
                                            <a className="truncate max-w-[350px] link link-secondary m-0 p-0 prose prose-sm" href={currentUrl} target="_blank" rel="noopener noreferrer">
                                                {currentUrl}
                                            </a>
                                        </div>
                                    </div>
                                </div>
                                )}) : 'No contributions yet...'}
                            </div>)
                            : (<div>
                                <div className="stat">
                                    <div className="stat-desc text-primary">{address}</div>
                                    <div className="stat-value">
                                        {Number(balanceData.value) / decimals + ' ' + balanceData.symbol}
                                    </div>
                                    <div className="stat-title">Rewards for Contributions</div>
                                    <div className="stat-desc text-secondary">{Number(contribData || 0)} contributions</div>
                                </div>
                                <div className="stat">
                                    <label className="label">
                                        <span className="label-text">E-Mail</span>
                                        {/*<span className="label-text-alt">Get notified <input type="checkbox" checked="checked" className="checkbox checkbox-sm checkbox-primary" /></span>*/}
                                    </label>
                                    <div className="join">
                                        <input type="text" placeholder="ex.: me@mail.com" value={email} onChange={(evt) => setEmail(evt.target.value)} className="input input-bordered input-primary w-full max-w-xs join-item" />
                                        <button className="btn join-item rounded-r-full btn-outline" onClick={async () => {
                                            console.log({ email });
                                            emailStorage.set(email);
                                            const protectedData = await dataProtector.protectData({
                                                data: {
                                                    email
                                                }
                                            });
                                            console.log({ protectedData });
                                        }}>Save</button>
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
    </div>
  );
};

export default withErrorBoundary(withSuspense(Popup, <div> Loading ... </div>), <div> Error... </div>);
