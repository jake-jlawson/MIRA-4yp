export function getDateTime() {
    
    const { day, month, year, hours, minutes } = (() => {
        const currentDate = new Date();
        
        return {
            day: ('0' + currentDate.getDate()).slice(-2),
            month: ('0' + (currentDate.getMonth() + 1)).slice(-2),
            year: currentDate.getFullYear(),
            hours: ('0' + currentDate.getHours()).slice(-2),
            minutes: ('0' + currentDate.getMinutes()).slice(-2)
        };
    })();

    return `${day}/${month}/${year} ${hours}:${minutes}`;
}