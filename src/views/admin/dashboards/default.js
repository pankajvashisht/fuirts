import React, { Fragment, useState, useEffect } from 'react';
import { injectIntl } from 'react-intl';
import { Row } from 'reactstrap';
import { NavLink } from 'react-router-dom';
import { Colxx, Separator } from '../../../components/common/CustomBootstrap';
import GradientWithRadialProgressCard from '../../../components/cards/GradientWithRadialProgressCard';
import { dashBoard } from '../../../Apis/admin';
import { NotificationManager } from '../../../components/common/react-notifications';
const DefaultDashboard = React.memo((props) => {
	const [dashBoardData, setDashboardData] = useState({
		total_users: 0,
		total_farmer: 0,
		total_orders: 0,
		total_driver: 0,
		total_coupens: 0,
		total_memberships: 0,
		total_gifts: 0,
		total_payment_methods: 0,
		total_category: 0,
		total_sub_category: 0,
	});
	useEffect(() => {
		dashBoard()
			.then((res) => {
				const { data } = res;
				updateData(data.data);
			})
			.catch((err) => {
				if (err.response) {
					const { data } = err.response;
					NotificationManager.warning(
						data.error_message,
						'Something went wrong',
						3000,
						null,
						null,
						''
					);
				}
			});
	}, []);
	const updateData = (data) => {
		setDashboardData({ ...data });
	};
	return (
		<Fragment>
			<Row>
				<Colxx xxs='12'>
					<h1>Dashboard</h1>
					<Separator className='mb-5' />
				</Colxx>
			</Row>
			<Row>
				<Colxx lg='12' md='12'>
					<Row>
						<Colxx lg='4' xl='4' className='mb-4'>
							<NavLink to='/users'>
								<GradientWithRadialProgressCard
									icon='iconsminds-male'
									title={`${dashBoardData.total_users} Users`}
									detail=''
								/>
							</NavLink>
						</Colxx>
						<Colxx lg='4' xl='4' className='mb-4'>
							<NavLink to='/farmers'>
								<GradientWithRadialProgressCard
									icon='iconsminds-environmental-3'
									title={`${dashBoardData.total_farmer} Farmer`}
									detail=''
								/>
							</NavLink>
						</Colxx>
						<Colxx lg='4' xl='4' className='mb-4'>
							<NavLink to='/drivers'>
								<GradientWithRadialProgressCard
									icon='iconsminds-scooter'
									title={`${dashBoardData.total_driver} Drivers`}
									detail=''
								/>
							</NavLink>
						</Colxx>
						<Colxx lg='4' xl='4' className='mb-4'>
							<NavLink to='/categories'>
								<GradientWithRadialProgressCard
									icon='simple-icon-direction'
									title={`${dashBoardData.total_category} Categoires`}
									detail=''
								/>
							</NavLink>
						</Colxx>
						<Colxx lg='4' xl='4' className='mb-4'>
							<NavLink to='/sub-categories'>
								<GradientWithRadialProgressCard
									icon='simple-icon-directions'
									title={`${dashBoardData.total_sub_category} Sub Categoires`}
									detail=''
								/>
							</NavLink>
						</Colxx>
						<Colxx lg='4' xl='4' className='mb-4'>
							<NavLink to='/gifts'>
								<GradientWithRadialProgressCard
									icon='iconsminds-gift-box'
									title={`${dashBoardData.total_gifts} Gifts`}
									detail=''
								/>
							</NavLink>
						</Colxx>
						<Colxx lg='4' xl='4' className='mb-4'>
							<NavLink to='/coupens'>
								<GradientWithRadialProgressCard
									icon='iconsminds-wallet'
									title={`${dashBoardData.total_coupens} Coupens`}
									detail=''
								/>
							</NavLink>
						</Colxx>
						<Colxx lg='4' xl='4' className='mb-4'>
							<NavLink to='/membership-plans'>
								<GradientWithRadialProgressCard
									icon='iconsminds-financial'
									title={`${dashBoardData.total_memberships} Membership Plans`}
									detail=''
								/>
							</NavLink>
						</Colxx>
						<Colxx lg='4' xl='4' className='mb-4'>
							<NavLink to='/payment-methods'>
								<GradientWithRadialProgressCard
									icon='iconsminds-coins'
									title={`${dashBoardData.total_payment_methods} Payment Methods`}
									detail=''
								/>
							</NavLink>
						</Colxx>
						<Colxx lg='4' xl='4' className='mb-4'></Colxx>
						<Colxx lg='4' xl='4' className='mb-4'>
							<NavLink to='/orders'>
								<GradientWithRadialProgressCard
									icon='simple-icon-emotsmile'
									title={`${dashBoardData.total_orders} Orders`}
									detail=''
								/>
							</NavLink>
						</Colxx>
					</Row>
				</Colxx>
			</Row>
		</Fragment>
	);
});
export default injectIntl(DefaultDashboard);
