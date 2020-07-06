require('dotenv').config();
const ApiError = require('../../Exceptions/ApiError');
const stripKey = process.env.STRIP_KEY || 'sk_test_ECkTAGXSlMXkohlMVHgAXBNG';
const stripe = require('stripe')(stripKey);
const Db = require('../../../libary/sqlBulider');
const DB = new Db();
module.exports = {
	createAccount: async (user_id, email, bankAccountDetails = null) => {
		stripe.account.create(
			{
				type: 'custom',
				country: 'US',
				email: email,
				business_type: 'individual',
				requested_capabilities: ['card_payments', 'transfers'],
			},
			function (err, account) {
				if (err) {
					DB.save('strips_fail_logs', {
						user_id,
						informations: JSON.stringify(err),
					});
				} else {
					DB.save('users', {
						id: user_id,
						strip_id: account.id,
						strip_info: JSON.stringify(account),
					});
					if (bankAccountDetails) {
						createBankAccount(
							account.id,
							JSON.parse(bankAccountDetails),
							user_id
						);
					}
				}
			}
		);
	},
	payoutBalance: async (amount, stripeAccount, userID) => {
		try {
			const result = await stripe.payouts.create(
				{
					amount: amount,
					currency: 'usd',
					method: 'instant',
				},
				{ stripeAccount }
			);
			return result;
		} catch (err) {
			DB.save('strips_fail_logs', {
				informations: JSON.stringify(err),
				user_id: userID,
				type: 1,
			});
			return false;
		}
	},
	stripeHook: async (Request, Response) => {
		const {
			query,
			query: { stripe_id },
			body,
			params: { user_id },
		} = Request;
		if (query.type === 'success') {
			const accountInfo = await stripe.accounts.retrieve(stripe_id);
			const {
				capabilities: { card_payments, transfers },
			} = accountInfo;
			if (card_payments === 'active' && transfers === 'active') {
				await DB.save('users', {
					id: user_id,
					stripe_connect: 1,
				});
			}
			// apis.sendPush(user_id, {
			// 	message:
			// 		'Your account successfully link with stripe now you will add your product',
			// 	data: [],
			// 	notification_code: 10,
			// });
			return Response.render('AddBankDetails', { user_id });
		}
		await DB.save('strips_fail_logs', {
			informations: JSON.stringify({ query, body }),
			user_id: user_id,
			type: 5, // strinp hook log
		});
		return Response.render('error', {
			message: 'Something went wrong try later',
			error: {
				status: 400,
			},
		});
	},
	stripeAccountActive: async (Request) => {
		const { stripe_id, id } = Request.body.userInfo;
		const accountInfo = await stripe.accounts.retrieve(stripe_id);
		const {
			capabilities: { card_payments, transfers },
		} = accountInfo;
		let account = false;
		if (card_payments === 'active' && transfers === 'active') {
			await DB.save('users', {
				id,
				stripe_connect: true,
			});
			account = true;
		}
		return {
			message: 'Account info',
			data: {
				account,
				accountInfo,
			},
		};
	},
	stripeAccountLink: async (Request) => {
		const {
			user_id,
			userInfo: { strip_id = '' },
		} = Request.body;
		if (!strip_id)
			throw new ApiError(
				'Your have not register in the stripe. First create a strip account',
				400
			);
		try {
			const Links = await new Promise((Resolve, Reject) => {
				stripe.accountLinks.create(
					{
						account: strip_id,
						failure_url: `${appURL}apis/v1/stripe-integration/${user_id}?type=fail&stripe_id=${strip_id}`,
						success_url: `${appURL}apis/v1/stripe-integration/${user_id}?type=success&stripe_id=${strip_id}`,
						type: 'custom_account_verification',
					},
					function (err, accountLink) {
						if (err) Reject(err);
						Resolve(accountLink);
					}
				);
			});
			return {
				message: 'Account link url',
				data: Links,
			};
		} catch (error) {
			throw new ApiError(error);
		}
	},
	oauthConnect: async (Request) => {
		const { code, state } = Request.query;
		const result = await stripe.oauth.token({
			grant_type: 'authorization_code',
			code,
		});
		if (result.stripe_user_id) {
			await DB.save('users', {
				id: state,
				stripe_id: result.stripe_user_id,
			});
		}
		return {
			message: 'Connceted successfully',
			stripe_id: result.stripe_user_id,
		};
	},
	createStripeSecert: async (Request) => {
		const {
			amount = 0,
			order_id,
			shop_id,
			application_fee_amount = 10,
		} = Request.body;
		if (amount === 0) throw new ApiError('Amount field is required', 400);
		const { stripe_id, user_type } = await DB.find('users', 'first', {
			conditions: {
				id: shop_id,
			},
			fields: ['stripe_id', 'user_type'],
		});
		try {
			const paymentIntent = await stripe.paymentIntents.create({
				amount,
				currency: 'usd',
				transfer_group: order_id,
				application_fee_amount,
				transfer_data: {
					destination: stripe_id,
				},
			});
			const clientSecret = paymentIntent.client_secret;
			await DB.save('amount_transfers', {
				user_id: shop_id,
				user_type,
				checkout_status: 1,
				order_id,
				amount: amount - application_fee_amount,
			});
			return {
				message: 'Stripe Secert Key',
				data: {
					secret: clientSecret,
				},
			};
		} catch (err) {
			throw new ApiError(err);
		}
	},
	getStripBalance: async (stripe_account) => {
		try {
			return await stripe.balance.retrieve({
				stripe_account,
			});
		} catch (err) {
			return false;
		}
	},
	updateBank: async ({
		bankDetails,
		strip_id,
		stripe_bank_account_id,
		userID,
	}) => {
		try {
			await createBankAccount(strip_id, bankDetails, userID);
			if (stripe_bank_account_id) {
				await new Promise((Resolve, Reject) => {
					stripe.accounts.deleteExternalAccount(
						strip_id,
						stripe_bank_account_id,
						function (err, confirmation) {
							if (err) {
								Reject(err);
							} else {
								Resolve(confirmation);
							}
						}
					);
				});
			}
			return true;
		} catch (err) {
			throw new ApiError(err, 400);
		}
	},
	transfersAmount: (destination, amount, orderID) => {
		return new Promise((Resolved, Reject) => {
			stripe.transfers.create(
				{
					amount,
					currency: 'usd',
					destination,
					transfer_group: orderID,
				},
				function (err, transfer) {
					if (err) {
						DB.save('strips_fail_logs', {
							informations: JSON.stringify(err),
							user_id: orderID,
							type: 6,
						});
						Reject(err);
					} else {
						Resolved(transfer);
					}
				}
			);
		});
	},
};
const createBankAccount = async (stripID, bankAccountDetails, userID) => {
	const bank_account = {
		country: 'US',
		currency: 'usd',
		account_holder_type: 'individual',
		...bankAccountDetails,
	};
	return new Promise((Resolve, reject) => {
		stripe.tokens.create(
			{
				bank_account,
			},
			function (err, token) {
				if (err) {
					DB.save('strips_fail_logs', {
						informations: JSON.stringify(err),
						user_id: userID,
						type: 3,
					});
					reject(err);
				} else {
					stripe.accounts.createExternalAccount(
						stripID,
						{ external_account: token.id },
						function (err, bank_account) {
							if (err) {
								DB.save('strips_fail_logs', {
									informations: JSON.stringify(err),
									user_id: userID,
									type: 1,
								});
								reject(err);
							} else {
								DB.save('users', {
									id: userID,
									stripe_bank_account_id: bank_account.id,
									bank_account: JSON.stringify(bank_account),
								});
								Resolve(true);
							}
						}
					);
				}
			}
		);
	});
};
