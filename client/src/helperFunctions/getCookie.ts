export const getUserCookie = () => {
    const existingCookies = document.cookie;
    const getVal = existingCookies.split('=');
    const name = getVal[getVal.length - 2];
    return name === 'tasksListUbi' ? getVal[getVal.length - 1] : '';
}