export function formatDate(date: string, includeRelative = false, locale: string = 'en') {
    const currentDate = new Date();

    if (!date.includes('T')) {
        date = `${date}T00:00:00`;
    }

    const targetDate = new Date(date);
    const yearsAgo = currentDate.getFullYear() - targetDate.getFullYear();
    const monthsAgo = currentDate.getMonth() - targetDate.getMonth();
    const daysAgo = currentDate.getDate() - targetDate.getDate();

    let formattedDate = '';
    
    const isZh = locale.includes('zh');

    if (yearsAgo > 0) {
        formattedDate = isZh ? `${yearsAgo} 年前` : `${yearsAgo}y ago`;
    } else if (monthsAgo > 0) {
        formattedDate = isZh ? `${monthsAgo} 个月前` : `${monthsAgo}mo ago`;
    } else if (daysAgo > 0) {
        formattedDate = isZh ? `${daysAgo} 天前` : `${daysAgo}d ago`;
    } else {
        formattedDate = isZh ? '今天' : 'Today';
    }

    const fullDate = targetDate.toLocaleString(isZh ? 'zh-CN' : 'en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
    });

    if (!includeRelative) {
        return fullDate;
    }

    return `${fullDate} (${formattedDate})`;
}