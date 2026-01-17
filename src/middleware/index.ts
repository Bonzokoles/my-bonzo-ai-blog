import { onRequest as redirectRequest } from './url-redirect';
import { sequence } from 'astro:middleware';

export const onRequest = sequence(redirectRequest);
