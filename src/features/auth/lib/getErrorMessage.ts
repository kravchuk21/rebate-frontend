import type { ResponseError } from '@siberiacancode/fetches';

import type { GithubComVladislavkravchukRebateBackendInternalSharedResponseErrorResponse } from '@/shared/api/generated/types.gen';

type ApiErrorResponse = GithubComVladislavkravchukRebateBackendInternalSharedResponseErrorResponse;

export const getErrorMessage = (error: unknown): string | undefined => {
  if (error && typeof error === 'object' && 'error' in error) {
    const message = (error as ApiErrorResponse).error;
    if (typeof message === 'string') return message;
  }

  const responseError = error as ResponseError | undefined;
  const data = responseError?.response?.data as ApiErrorResponse | undefined;

  return data?.error;
};
