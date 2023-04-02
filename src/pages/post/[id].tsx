import { type NextPage } from "next";
import Head from "next/head";
import Image from "next/image";

import { api } from "~/utils/api";


const SinglePostPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Chirp Post</title>
      </Head>
      <main className="flex h-screen justify-center">
        <div>
         <p>Single Post View</p>
        </div>
      </main>
    </>
  );
};

export default SinglePostPage;