import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import { destroyCookie, parseCookies } from 'nookies';
import decode from 'jwt-decode';
import { AuthTokenError } from '../services/errors/AuthTokenError';
import { validateUserPermissions } from './validateUserPermissions';

interface WithSSRAuthOptions {
  permissions?: string[];
  roles?: string[];
}

export function withSSRAuth<P>(
  fn: GetServerSideProps<P>,
  options?: WithSSRAuthOptions
): GetServerSideProps {
  return async (context: GetServerSidePropsContext): Promise<GetServerSidePropsResult<P>> => {
    const cookies = parseCookies(context);
    const token = cookies['imoveis.token'];
    
    if (!token) {
      return {
        redirect: {
          destination: '/',
          permanent: false
        }
      }
    }

    // if (options) {
    //   const user = decode<{ permissions: string[], roles: string[] }>(token);

    //   const { permissions, roles } = options;

    //   const userHasValidPermissions = validateUserPermissions({
    //     user,
    //     permissions,
    //     roles
    //   });

    //   if(!userHasValidPermissions) {
    //     return {
    //       redirect: {
    //         destination: '/home',
    //         permanent: false
    //       }
    //     }
    //   }
    // }

    // try {
      return await fn(context);
    // } catch (err) {
      // if (err instanceof AuthTokenError) {
      //   destroyCookie(context, 'imoveis.token', { path: '/' });
      //   // destroyCookie(context, 'nextauth.refreshToken', { path: '/' });

      //   return {
      //     redirect: {
      //       destination: '/',
      //       permanent: false
      //     }
      //   }
      // }
    // }
  }
}