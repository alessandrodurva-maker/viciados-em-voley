import React from 'react';

// Fix: Updated props to use React.SVGProps for type safety and to allow React props like 'key'.
export const TrashIcon = ({ className = 'w-6 h-6', ...props }: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

// Fix: Updated props to use React.SVGProps for type safety and to allow React props like 'key'.
export const ShareIcon = ({ className = 'w-6 h-6', ...props }: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8m-4-6l-4-4m0 0L8 6m4-4v12" />
    </svg>
);

// Fix: Updated props to use React.SVGProps for type safety and to allow React props like 'key'.
export const RedoIcon = ({ className = 'w-6 h-6', ...props }: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h5M20 20v-5h-5M4 4l1.5 1.5A9 9 0 0119.5 7.5M20 20l-1.5-1.5A9 9 0 004.5 16.5" />
    </svg>
);

// Fix: Updated props to use React.SVGProps for type safety and to allow React props like 'key'.
export const VolleyballIcon = ({ className = 'w-6 h-6', ...props }: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path fillRule="evenodd" d="M12 2a10 10 0 100 20 10 10 0 000-20zM.44 10.23c.33-3.93 2.5-7.33 5.48-9.4A9.96 9.96 0 002.01 12c0 .28.01.56.04.83-.28-1.03-.45-2.1-.4-3.17zm1.12 4.04a9.96 9.96 0 01-1.5-3.5c.05-1.11.23-2.22.53-3.28a9.96 9.96 0 019.8-6.42 10 10 0 0110.01 10.01 9.96 9.96 0 01-6.43 9.8c-1.06.3-2.17.48-3.28.53a9.96 9.96 0 01-3.5-1.5 10 10 0 01-5.62-5.63zm15.96 5.3a9.96 9.96 0 002.4-4.59c-.06.01-.11.02-.17.02a.75.75 0 01-.75-.75c0-.06.01-.12.02-.17a9.96 9.96 0 00-4.59 2.4 10 10 0 002.09 3.09z" clipRule="evenodd" />
    </svg>
);

// Fix: Updated props to use React.SVGProps for type safety and to allow React props like 'key'.
export const WinnerIcon = ({ className = 'w-6 h-6', ...props }: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path fillRule="evenodd" d="M12.963 2.286a.75.75 0 00-1.071 1.071L12 4.429l-.892-.892a.75.75 0 00-1.071 1.071l.892.892-1.06 1.06a.75.75 0 101.06 1.06l1.06-1.06.892.892a.75.75 0 001.071-1.071l-.892-.892 1.06-1.06a.75.75 0 00-1.06-1.06l-1.06 1.06L12.963 2.286z" clipRule="evenodd" />
        <path fillRule="evenodd" d="M10.5 6a2.25 2.25 0 00-2.25 2.25v.516c0 .43.203.834.545 1.097l1.705 1.364a.75.75 0 001.097-.545v-2.13a.75.75 0 00-.75-.75h-1.5a.75.75 0 01-.75-.75V8.25A.75.75 0 019 7.5h1.5a.75.75 0 000-1.5H9a2.25 2.25 0 00-2.25 2.25v.09a.75.75 0 00.75.75h.375a.75.75 0 000-1.5H7.5v-.09A3.75 3.75 0 0111.25 6h1.5A3.75 3.75 0 0116.5 9.75v.09a.75.75 0 000 1.5h-.375a.75.75 0 00-.75.75v2.13c0 .54.628.89 1.097.545l1.705-1.364a1.5 1.5 0 00.545-1.097V8.25A2.25 2.25 0 0013.5 6h-3z" clipRule="evenodd" />
        <path fillRule="evenodd" d="M3 14.25a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75a.75.75 0 01-.75-.75zm0 3a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75a.75.75 0 01-.75-.75z" clipRule="evenodd" />
    </svg>
);

// Fix: Updated props to use React.SVGProps for type safety and to allow React props like 'key'.
export const ClearIcon = ({ className = 'w-6 h-6', ...props }: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

// Fix: Updated props to use React.SVGProps for type safety and to allow React props like 'key'.
export const StarIcon = ({ className = 'w-6 h-6', ...props }: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className} {...props}>
      <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.007z" clipRule="evenodd" />
    </svg>
);
