interface ApplicationContext {
  basePath: string;
  apiPappersToken: string;
  apiUrlPappers: string;
}

declare const _app_context_: Partial<ApplicationContext>;

export const getContext: () => ApplicationContext = () => {
  const context = typeof _app_context_ === 'object' ? _app_context_ : {};

  return {
    // basePath: context.basePath || process.env.BASE_URL,
    basePath: context.basePath,
    apiPappersToken: 'ed40a009f9d29ac913eb8e6874a901b4ade3230d12ed65df',
    apiUrlPappers: 'https://suggestions.pappers.fr/v2'
  };
};
