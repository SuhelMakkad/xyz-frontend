import { PropsWithChildren } from 'react';

import { locales } from '@/locales/types';

import { Navbar } from './component/navbar';

export const generateStaticParams = async () => {
  return locales.map((locale) => ({ locale }));
};

const PublicLayout = ({ children }: PropsWithChildren) => {
  return (
    <>
      <Navbar />

      {children}
    </>
  );
};

export default PublicLayout;
