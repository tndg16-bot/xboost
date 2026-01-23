import { format, formatDistanceToNow } from 'date-fns';
import { ja } from 'date-fns/locale';

export const formatDate = (date: Date | string): string => {
  return format(new Date(date), 'yyyy年MM月dd日', { locale: ja });
};

export const formatDateTime = (date: Date | string): string => {
  return format(new Date(date), 'yyyy年MM月dd日 HH:mm', { locale: ja });
};

export const getTimeAgo = (date: Date | string): string => {
  return formatDistanceToNow(new Date(date), { 
    addSuffix: true, 
    locale: ja 
  });
};

export const formatISODate = (date: Date | string): string => {
  return new Date(date).toISOString();
};
