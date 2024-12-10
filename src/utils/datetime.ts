/**
 * 时间日期相关操作
 */


/**
 * 时间格式化
 * 将 2018-09-23T11:54:16.000+0000 格式化成 2018/09/23 11:54:16
 * @param datetime 国际化日期格式
 */
export function format(datetime: string) {
    return formatWithSeperator(datetime, "-", ":");
}

/**
 * 时间格式化
 * 将 2018-09-23T11:54:16.000+0000 格式化成类似 2018/09/23 11:54:16
 * 可以指定日期和时间分隔符
 * @param datetime 国际化日期格式
 */
export function formatWithSeperator(datetime: string, dateSeprator: string, timeSeprator: string) {
    if (datetime != null) {
        const dateMat = new Date(datetime);
        const year = dateMat.getFullYear().toString();
        const month = dateMat.getMonth() + 1;
        const day = dateMat.getDate();
        const hh = dateMat.getHours();
        const mm = dateMat.getMinutes();
        const ss = dateMat.getSeconds();
        const timeFormat = year + dateSeprator + formatItem(month) + dateSeprator + formatItem(day) + " " + formatItem(hh) + timeSeprator + formatItem(mm) + timeSeprator + formatItem(ss);
        return timeFormat;
    }
}

function formatItem(item: number): string {
    if (item < 10) {
        return  "0" + item;
    }
    return item.toString()
}
