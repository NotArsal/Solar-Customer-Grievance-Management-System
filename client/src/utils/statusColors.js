export const getStatusColor = (status) => {
  switch (status) {
    case 'Pending':
    case 'Open': 
      return 'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900 dark:text-blue-200 dark:border-blue-700';
    case 'In-Progress':
    case 'In Progress': 
      return 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-900 dark:text-amber-200 dark:border-amber-700';
    case 'Resolved': 
      return 'bg-green-100 text-green-800 border-green-300 dark:bg-green-900 dark:text-green-200 dark:border-green-700';
    case 'Closed': 
      return 'bg-gray-100 text-gray-800 border-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600';
    case 'Escalated':
    case 'Breached': 
      return 'bg-red-100 text-red-800 border-red-300 animate-pulse dark:bg-red-900 dark:text-red-200 dark:border-red-700';
    default: 
      return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
  }
};
