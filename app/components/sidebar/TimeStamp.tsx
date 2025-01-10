import { format } from 'date-fns';

interface TimeStampProps {
  date: Date | string;
}

export function TimeStamp({ date }: TimeStampProps) {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  return (
    <div className="flex items-center gap-2 text-bolt-elements-textTertiary text-sm">
      <div className="flex items-center gap-1.5 bg-bolt-elements-background-depth-2 px-3 py-1 rounded-full">
        <div className="i-ph:clock text-lg opacity-70" />
        {format(dateObj, 'h:mm a')}
      </div>
      <div className="flex items-center gap-1.5 bg-bolt-elements-background-depth-2 px-3 py-1 rounded-full">
        <div className="i-ph:calendar text-lg opacity-70" />
        {format(dateObj, 'MMM d, yyyy')}
      </div>
    </div>
  );
} 