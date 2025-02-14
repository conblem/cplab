import NextAuth from "next-auth";

const issuer = process.env.NEXT_PUBLIC_ZITADEL_ISSUER!;
const token = `${issuer}/oauth/v2/token`;
const authorization = `${issuer}/oauth/v2/authorize`;
const jwks_endpoint = `${issuer}/oauth/v2/keys`;
const userinfo = `${issuer}/oidc/v1/userinfo`;
const clientId = process.env.ZITADEL_CLIENT_ID!;
// const projectId = process.env.ZITADEL_PROJECT_ID!;

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    {
      id: "zitadel",
      name: "Zitadel",
      type: "oidc",
      issuer,
      clientId,
      clientSecret: "FAKE_TO_SILENCE_ERRORS",
      token,
      authorization: {
        url: authorization,
        params: {
          scope: `openid email profile urn:zitadel:iam:user:metadata urn:zitadel:iam:org:projects:roles urn:zitadel:iam:org:project:id:zitadel:aud`,
          response_type: "code",
          prompt: "select_account",
        },
      },
      jwks_endpoint,
      userinfo,
      checks: ["pkce", "state", "nonce"],
      idToken: false,
      profile(profile) {
        // const rolesWithOrganizations: Record<string, Record<string, string>> = profile[`urn:zitadel:iam:org:project:${projectId}:roles`];
        // const organizationsWithRoles = Object.entries(rolesWithOrganizations).reduce((acc, [role, organizationsAndUrl]) => {
        //   const organizations = Object.keys(organizationsAndUrl)
        //   if (organizations.length != 1) {
        //     throw new Error("Can only be part of one organization")
        //   }
        //   const organization = organizations[0];
        //   if (!acc[organization]) {
        //     acc[organization] = []
        //   }
        //   acc[organization].push(role)
        //   return acc;
        // }, {} as { [_: string]: string[] });
        // const organizationsWithRolesEntries = Object.entries(organizationsWithRoles)
        // if (organizationsWithRolesEntries.length != 1) {
        //   throw new Error("Can only be part of one organization")
        // }
        // const [organization, roles] = organizationsWithRolesEntries[0];

        return {
          id: profile.sub,
          name: profile.name,
          firstName: profile.given_name,
          lastName: profile.family_name,
          email: profile.email,
          loginName: profile.preferred_username,
          image: profile.picture,
          // organization,
          // roles
        };
      },
    },
  ],
  callbacks: {
    async signIn({ profile }) {
      return profile?.email_verified ?? false;
    },
    async jwt({ token, account, user }) {
      if (account) {
        token.jwt = account.id_token;
        token.access_token = account.access_token;
      }
      if (user) {
        token.user = user;
      }
      return token;
    },
    async session({ session, token }) {
      Object.assign(session, {
        user: token.user,
        access_token: token.access_token,
        jwt: token.jwt,
      });
      return session;
    },
  },
});
