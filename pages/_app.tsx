import "../styles/globals.css";
import type { AppProps } from "next/app";
import SignerContext from "../src/context/Signer";
import PreviewBookContext from "../src/context/PreviewBook";
import LoadingContext from "../src/context/Loading";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { eBook } from "../src/controllers/eBookMarketLaunch";
import Loading from "../src/components/common/Loading";
import { initializeSF } from "../src/controllers/Superfluid";
import { useRouter } from "next/router";
import { ChakraProvider } from '@chakra-ui/react'
import Head from 'next/head';

function MyApp({ Component, pageProps }: AppProps) {
  const [signer, setSigner] = useState<
    | {
        address: string;
        signer: ethers.providers.JsonRpcSigner;
        subdomain: string;
      }
    | undefined
  >(undefined);

  const [previewBook, setPreviewBook] = useState<eBook | undefined>();
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  // useEffect(() => {
  //   const providerEventsCB = async (_signer, _address) => {
  //     if (_signer && _address) {
  //       setSigner({ address: _address, signer: _signer });
  //     } else {
  //       setSigner(undefined);
  //     }
  //   };
  //   connectToWallet(providerEventsCB).then(async (_signer) => {
  //     if (_signer) {
  //       const _address = await _signer.getAddress();
  //       setSigner({ address: _address, signer: _signer });
  //       window && initializeSF();
  //     }
  //   });
  // }, []);

  return (
    <SignerContext.Provider value={{ signer, setSigner }}>
      <PreviewBookContext.Provider value={{ previewBook, setPreviewBook }}>
        <LoadingContext.Provider value={{ loading, setLoading }}>
          {/* <div className={`${signer && "filter blur-xl bg-gray-300"}`}> */}
            {loading && <Loading />}
            <div className={`${loading && "filter blur-xl bg-gray-100"}`}>
              <ChakraProvider>
               
                <Head>
                  <title>DeBooki</title>
                  <meta name="viewport" content="initial-scale=1.0, width=device-width" />
                  <meta name="description" content="A Metaverse NFT Book Library" />
                  <meta name="keywords" content="NextJs, Polygon, JavaScript, Nft Storage, IPFS, Vercel, Superfluid, Ethereum, Blockchain" />
                  <meta name="author" content="Lakshay Maini" />
                  <link rel="icon" type="image/png" href={"/open-book.png"} />
                </Head>
                <Component {...pageProps} />
              
              </ChakraProvider>
            </div>
          {/* </div> */}
        </LoadingContext.Provider>
      </PreviewBookContext.Provider>
    </SignerContext.Provider>
  );
}
export default MyApp;
