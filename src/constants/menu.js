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
		id: 'Driver',
		icon: 'iconsminds-scooter',
		label: 'Drivers',
		to: '/drivers',
		subs: [
			{
				icon: 'iconsminds-scooter',
				label: 'Drivers List',
				to: '/drivers',
			},
			{
				icon: 'iconsminds-add',
				label: 'Add Driver',
				to: '/add-driver',
			},
		],
	},
	{
		id: 'Category',
		icon: 'iconsminds-switch',
		label: 'Category',
		to: '/orders',
		subs: [
			{
				icon: 'simple-icon-direction',
				label: 'Fruit Category',
				to: '/categories',
			},
			{
				icon: 'iconsminds-add-basket',
				label: 'Add Fruit Category',
				to: '/add-category',
			},
			{
				icon: 'simple-icon-directions',
				label: 'Fruit Sub Category',
				to: '/sub-categories',
			},
			{
				icon: 'iconsminds-add-cart',
				label: 'Add Sub Category',
				to: '/add-sub-category',
			},
		],
	},
	{
		id: 'Products',
		icon: 'iconsminds-add-cart',
		label: 'Products',
		to: '/products',
		subs: [
			{
				icon: 'iconsminds-add-cart',
				label: 'Products',
				to: '/products',
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
		label: 'App Settings',
		to: '/app-information',
		subs: [
			{
				icon: 'simple-icon-settings',
				label: 'App Infomation',
				to: '/app-information',
			},
			{
				icon: 'iconsminds-coins',
				label: 'Payment Methods',
				to: '/payment-methods',
			},
			{
				icon: 'iconsminds-wallet',
				label: 'coupon',
				to: '/coupens',
			},
			{
				icon: 'iconsminds-gift-box',
				label: 'Gifts',
				to: '/gifts',
			},
			{
				icon: 'iconsminds-financial',
				label: 'Membership Plan',
				to: '/membership-plans',
			},
		],
	},
];
export default data;
