const data = [
	{
		id: 'dashboards',
		icon: 'iconsminds-shop-4',
		label: 'Dashboards',
		to: '/',
	},
	{
		id: 'Users',
		icon: 'simple-icon-people',
		label: 'Users',
		to: '/users',
		subs: [
			{
				icon: 'simple-icon-user',
				label: 'Users',
				to: '/users',
			},
			{
				icon: 'iconsminds-add-user',
				label: 'Add User',
				to: '/add-user',
			},
		],
	},
	{
		id: 'Farmer',
		icon: 'iconsminds-environmental-3',
		label: 'Farmer',
		to: '/farmer',
		subs: [
			{
				icon: 'iconsminds-network',
				label: 'Farmer',
				to: '/farmers',
			},
			{
				icon: 'iconsminds-add-basket',
				label: 'Add Farmer',
				to: '/add-farmer',
			},
		],
	},
	{
		id: 'Orders',
		icon: 'simple-icon-emotsmile',
		label: 'Orders',
		to: '/orders',
		subs: [
			{
				icon: 'simple-icon-emotsmile',
				label: 'Orders',
				to: '/orders',
			},
		],
	},
	{
		id: 'notification',
		icon: 'simple-icon-bell',
		label: 'Push Notification',
		to: '/push',
	},
	{
		id: 'App Informations',
		icon: 'iconsminds-monitor---phone',
		label: 'App Informations',
		to: '/app-information',
	},
];
export default data;
