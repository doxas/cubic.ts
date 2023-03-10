import { useEffect, useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import { Noto_Sans_JP } from '@next/font/google';
import Cubic from '@/cubic';
import styles from '@/styles/Home.module.css';

const nsj = Noto_Sans_JP({ weight: '400', subsets: [] });

export default function Home() {
  useEffect(() => {
    console.log('😇', 'effects');
  }, []);

  return (
    <>
      <Head>
        <title>prototype</title>
        <meta
          name="description"
          content="Generated by create next app"
        />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1"
        />
        <link
          rel="icon"
          href="/favicon.ico"
        />
      </Head>
      <main
        id="wrap"
        className={nsj.className}
      >
        <Cubic className={styles['main-canvas']}></Cubic>
        <div className={styles['background']}>
          <Image
            src="/static/background.jpg"
            alt="background"
            fill
            className={styles['background-image']}
          />
        </div>
        <div className={styles['layer']}>ぶ～ん 🚙=3</div>
      </main>
    </>
  );
}
