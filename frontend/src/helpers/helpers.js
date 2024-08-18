import {format, getTime} from 'date-fns'

export function deleteSymbols(str) {
	if (str) {
		return str.replace(/[^A-Z0-9]/gi, '');
	}
	return ""
}

export function regexNumeric(str) {
	if (str) {
		return str.replace(/[^0-9]/gi, '');
	}
	return ""
}

export function returnSign(str) {
	return str.includes("?") ? '&' : '?'
}

export function regexPhoneNumber(str) {
	if (str) {
		return str.replace(/(\d{3})(\d{2})(\d{3})(\d{2})(\d{2})/, "$1 $2 $3-$4-$5");
	}
	return ""
}

export function clearTemporaryStorage() {
	localStorage.removeItem('tokenTime')
	localStorage.removeItem('authUser')
	localStorage.removeItem('username')
	localStorage.removeItem('authorities')
	localStorage.removeItem('token')
	sessionStorage.clear();
	document.cookie.split(";").forEach(function (c) { document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); });
}

export function findFromArrayById(array, id) {
	if (array.length > 0 && id) {
		return array.filter(x => x.id === id)[0].name;
	}
}

export function findIdFromArray(array, id) {
	if (array.length > 0 && id) {
		if(array.filter(x => x.id === id).length > 0) {
			return array.filter(x => x.id === id)[0].id;
		} else {
			return false
		}
	}
}

export function formatMoney(amount, decimalCount = null, decimal = ".", thousands = " ") {
	if (!decimalCount && decimalCount !== 0) {
		const state = JSON.parse(localStorage.getItem('state'))
		if (state) {
			//decimalCount = state.settings.decimalPoint
			decimalCount = 0
		} else {
			decimalCount = 0
		}
	}

	try {
		decimalCount = Math.abs(decimalCount);
		decimalCount = isNaN(decimalCount) ? 0 : decimalCount; // 0 was 2

		const negativeSign = amount < 0 ? "-" : "";

		let i = parseInt(amount = Math.abs(Number(amount) || 0).toFixed(decimalCount)).toString();
		let j = (i.length > 3) ? i.length % 3 : 0;

		return negativeSign + (j ? i.substr(0, j) + thousands : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands) + (decimalCount ? decimal + Math.abs(amount - i).toFixed(decimalCount).slice(2) : "");
	} catch (e) {
		console.log(e)
	}
}

export function formatMoneyInput(amount, decimalCount = null, decimal = ".", thousands = " ") {
	if(amount === "") {
		return ""
	}
	try {
		decimalCount = Math.abs(decimalCount);
		decimalCount = isNaN(decimalCount) ? 0 : decimalCount; // 0 was 2

		const negativeSign = amount < 0 ? "-" : "";

		let i = parseInt(amount = Math.abs(Number(amount) || 0).toFixed(decimalCount)).toString();
		let j = (i.length > 3) ? i.length % 3 : 0;

		return negativeSign + (j ? i.substr(0, j) + thousands : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands) + (decimalCount ? decimal + Math.abs(amount - i).toFixed(decimalCount).slice(2) : "");
	} catch (e) {
		console.log(e)
	}
}

export function formatDateWithTime(date) {
	if (date) {
		return format(new Date(date), 'dd.MM.yyyy HH:mm')
	}
}

export function formatDate(date) {
	if (date) {
		return format(new Date(date), 'dd.MM.yyyy')
	}
}

export function formatDateBackend(date) {
	if (date) {
		return format(new Date(date), 'yyyy-MM-dd')
	}
}

export function getUnixTime() {
	return getTime(new Date())
}

export function todayDate() {
	return format(new Date(), 'dd.MM.yyyy HH:mm:ss')
}

export function todayDDMMYYYY() {
	return format(new Date(), 'dd.MM.yyyy')
}

export function getHHmm() {
	return format(new Date(), 'HH:mm')
}

export function getUnixTimeByDate(date) {
	return getTime(date)
}

export function formatUnixTime(unixTime) {
	if (unixTime)
		return format(new Date(unixTime), 'dd.MM.yyyy HH:mm:ss')
}
export async function sleep(millis) {
	return new Promise(resolve => setTimeout(resolve, millis));
}

export const WALLET_TYPE = {
	METAMASK: 'Metamask',
	KAIKAS: 'Kaikas',
	KLIP: 'Klip'
}

export const NETWORK_TYPE = {
	POLYGON: 'polygon',
	ETHEREUM: 'ethereum',
	KLAYTN: 'klaytn'
}

export const truncateAddress = (address) => {
	if (!address) return 'No Account';
	const match = address.match(
		/^(0x[a-zA-Z0-9]{2})[a-zA-Z0-9]+([a-zA-Z0-9]{2})$/
	);
	if (!match) return address;
	return `${match[1]}…${match[2]}`;
};