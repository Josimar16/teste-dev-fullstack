import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import { parseCookies } from "nookies";

export function withSSRGuest<P>(fn: GetServerSideProps<P>): GetServerSideProps {
  return async (context: GetServerSidePropsContext): Promise<GetServerSidePropsResult<P>> => {
    const cookies = parseCookies(context);

    if (cookies['imoveis.token']) {
      return {
        redirect: {
          destination: '/home',
          permanent: false
        }
      }
    }

    return await fn(context);
  }
}