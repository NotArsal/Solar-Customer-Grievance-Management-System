// client/src/utils/statusColors.js

export const getStatusStyles = (status) => {
  const normalizedStatus = status?.toLowerCase();

  switch (normalizedStatus) {
    case 'resolved':
      return {
        badge: 'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-900',
        text: 'text-emerald-600 dark:text-emerald-400',
        bgSide: 'border-l-4 border-l-emerald-500',
        rowBg: 'bg-emerald-50/30 dark:bg-emerald-950/10'
      };
    case 'in-progress':
    case 'in progress':
      return {
        badge: 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-900',
        text: 'text-amber-600 dark:text-amber-400',
        bgSide: 'border-l-4 border-l-amber-500',
        rowBg: 'bg-amber-50/10 dark:bg-amber-950/10'
      };
    case 'pending':
    case 'open':
      return {
        badge: 'bg-blue-100 text-blue-800 border-blue-200 animate-pulse dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-900',
        text: 'text-blue-600 dark:text-blue-400',
        bgSide: 'border-l-4 border-l-blue-500',
        rowBg: 'dark:bg-blue-950/5'
      };
    case 'unresolved':
    case 'escalated':
    case 'breached':
      return {
        badge: 'bg-rose-100 text-rose-800 border-rose-200 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-900',
        text: 'text-rose-600 dark:text-rose-400',
        bgSide: 'border-l-4 border-l-rose-500',
        rowBg: 'bg-rose-50/10 dark:bg-rose-950/10'
      };
    default:
      return {
        badge: 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700',
        text: 'text-gray-600 dark:text-gray-400',
        bgSide: 'border-l-4 border-l-gray-400 dark:border-l-gray-600',
        rowBg: ''
      };
  }
};
