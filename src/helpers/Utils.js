import { defaultDirection } from '../constants/defaultValues';

export const mapOrder = (array, order, key) => {
	array.sort(function (a, b) {
		var A = a[key],
			B = b[key];
		if (order.indexOf(A + '') > order.indexOf(B + '')) {
			return 1;
		} else {
			return -1;
		}
	});
	return array;
};

export const getDateWithFormat = () => {
	const today = new Date();
	let dd = today.getDate();
	let mm = today.getMonth() + 1; //January is 0!

	var yyyy = today.getFullYear();
	if (dd < 10) {
		dd = '0' + dd;
	}
	if (mm < 10) {
		mm = '0' + mm;
	}
	return dd + '.' + mm + '.' + yyyy;
};

export const getCurrentTime = () => {
	const now = new Date();
	return now.getHours() + ':' + now.getMinutes();
};
export const minDate = (MinDate = null) => {
	let today, day, month, year;
	if (MinDate) {
		if (isNaN(MinDate)) {
			today = new Date(MinDate);
		} else {
			today = new Date(MinDate * 1000);
		}
	} else {
		today = new Date();
	}
	day = today.getDate();
	month = today.getMonth() + 1; //January is 0
	year = today.getFullYear();
	if (day < 10) {
		day = '0' + day;
	}
	if (month < 10) {
		month = '0' + month;
	}
	return year + '-' + month + '-' + day;
};

export const getDirection = () => {
	let direction = defaultDirection;
	if (localStorage.getItem('direction')) {
		const localValue = localStorage.getItem('direction');
		if (localValue === 'rtl' || localValue === 'ltr') {
			direction = localValue;
		}
	}
	return {
		direction,
		isRtl: direction === 'rtl',
	};
};

export const setDirection = (localValue) => {
	let direction = 'ltr';
	if (localValue === 'rtl' || localValue === 'ltr') {
		direction = localValue;
	}
	localStorage.setItem('direction', direction);
};
