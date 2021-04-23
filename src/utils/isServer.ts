// window is undefined when on server
export const isServer = () => typeof window === 'undefined';
