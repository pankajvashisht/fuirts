import React, { Component, Suspense } from 'react';
import { Route, withRouter, Switch, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import AppLayout from '../../layout/AppLayout';

const Default = React.lazy(() =>
	import(/* webpackChunkName: "dashboards" */ './dashboards/default')
);
const Users = React.lazy(() =>
	import(/* webpackChunkName: "users" */ './users')
);
const Farmer = React.lazy(() =>
	import(/* webpackChunkName: "shops" */ './Farmer')
);
const FarmerDetails = React.lazy(() =>
	import(/* webpackChunkName: "shops-details" */ './Farmer/farmerDetails')
);
const Push = React.lazy(() =>
	import(/* webpackChunkName: "add class" */ './push')
);
const UserDetails = React.lazy(() =>
	import(/* webpackChunkName: "user Details" */ './userDetails')
);
const Orders = React.lazy(() =>
	import(/* webpackChunkName: "order" */ './Orders')
);
const AppInformation = React.lazy(() =>
	import(/* webpackChunkName: "app-info" */ './AppInformations')
);
const AddFarmer = React.lazy(() =>
	import(/* webpackChunkName: "add-farmer" */ './Farmer/AddFarmer')
);
const AddUser = React.lazy(() =>
	import(/* webpackChunkName: "add-user" */ './Users/AddUser')
);
const Profile = React.lazy(() =>
	import(/* webpackChunkName: "admin-profile" */ './profile')
);
const Driver = React.lazy(() =>
	import(/* webpackChunkName: "driver" */ './Drivers')
);
const AddDriver = React.lazy(() =>
	import(/* webpackChunkName: "add-driver" */ './Drivers/AddDriver')
);
const DriverDetails = React.lazy(() =>
	import(/* webpackChunkName: "driver-details" */ './Drivers/driverDetails')
);
const PaymentTypes = React.lazy(() =>
	import(/* webpackChunkName: "payment-types" */ './PaymentMethod')
);
const AddPaymentTypes = React.lazy(() =>
	import(
		/* webpackChunkName: "add-payment-types" */ './PaymentMethod/AddPaymentMethod'
	)
);
const EditPaymentTypes = React.lazy(() =>
	import(
		/* webpackChunkName: "edit-payment-types" */ './PaymentMethod/EditPaymentMethod'
	)
);
const Gifts = React.lazy(() =>
	import(/* webpackChunkName: "gifts" */ './Gifts')
);
const AddGifts = React.lazy(() =>
	import(/* webpackChunkName: "add-gift" */ './Gifts/AddGift')
);
const EditGifts = React.lazy(() =>
	import(/* webpackChunkName: "edit-gifts" */ './Gifts/EditGift')
);
const MemberShipPlan = React.lazy(() =>
	import(/* webpackChunkName: "membershipplane" */ './MembershipPlan')
);
const AddMemberShipPlan = React.lazy(() =>
	import(
		/* webpackChunkName: "add-plan" */ './MembershipPlan/AddMembershipPlan'
	)
);
const EditMemberShipPlan = React.lazy(() =>
	import(
		/* webpackChunkName: "edit-plan" */ './MembershipPlan/EditMembershipPlan'
	)
);
const Coupens = React.lazy(() =>
	import(/* webpackChunkName: "coupens" */ './Coupens')
);
const AddCoupen = React.lazy(() =>
	import(/* webpackChunkName: "add-coupen" */ './Coupens/AddCoupen')
);
const EditCoupens = React.lazy(() =>
	import(/* webpackChunkName: "edit-coupens" */ './Coupens/EditCoupen')
);
const Category = React.lazy(() =>
	import(/* webpackChunkName: "category" */ './Category')
);
const AddCategory = React.lazy(() =>
	import(/* webpackChunkName: "add-category" */ './Category/AddCategory')
);
const EditCategory = React.lazy(() =>
	import(/* webpackChunkName: "edit-category" */ './Category/EditCategory')
);

const SubCategory = React.lazy(() =>
	import(/* webpackChunkName: "sub-category" */ './SubCategory')
);
const AddSubCategory = React.lazy(() =>
	import(
		/* webpackChunkName: "sub-add-category" */ './SubCategory/AddSubCategory'
	)
);
const EditSubCategory = React.lazy(() =>
	import(
		/* webpackChunkName: "edit-sub-category" */ './SubCategory/EditSubCategory'
	)
);

const Products = React.lazy(() =>
	import(/* webpackChunkName: "products" */ './Products')
);

const ProductDetails = React.lazy(() =>
	import(/* webpackChunkName: "product-details" */ './Products/ProductDetails')
);
class App extends Component {
	render() {
		return (
			<AppLayout>
				<div className='dashboard-wrapper'>
					<Suspense fallback={<div className='loading' />}>
						<Switch>
							<Redirect exact from={`/`} to={`/dashboards`} />
							<Route
								exact
								path={`/dashboards`}
								render={(props) => <Default {...props} />}
							/>
							<Route path={`/users`} render={(props) => <Users {...props} />} />
							<Route
								path={`/user-details`}
								render={(props) => <UserDetails {...props} />}
							/>
							<Route
								path={`/farmer-details`}
								render={(props) => <FarmerDetails {...props} />}
							/>
							<Route
								path='/farmers'
								render={(props) => <Farmer {...props} />}
							/>
							<Route path='/drivers' component={Driver} />
							<Route path='/add-driver' component={AddDriver} />
							<Route path='/driver-details' component={DriverDetails} />
							<Route
								path='/add-farmer'
								render={(props) => <AddFarmer {...props} />}
							/>
							<Route path='/push' render={(props) => <Push {...props} />} />
							<Route path='/orders' render={(props) => <Orders {...props} />} />
							<Route path='/add-user' component={AddUser} />} />
							<Route path='/profile' component={Profile} />} />
							<Route
								path='/app-information'
								render={(props) => <AppInformation {...props} />}
							/>
							<Route path='/payment-methods' component={PaymentTypes} />
							<Route path='/add-payment-method' component={AddPaymentTypes} />
							<Route path='/edit-payment-type' component={EditPaymentTypes} />
							<Route path='/gifts' component={Gifts} />
							<Route path='/add-gift' component={AddGifts} />
							<Route path='/edit-gifts' component={EditGifts} />
							<Route path='/membership-plans' component={MemberShipPlan} />
							<Route path='/add-coupen' component={AddCoupen} />
							<Route path='/edit-coupens' component={EditCoupens} />
							<Route path='/coupens' component={Coupens} />
							<Route path='/categories' component={Category} />
							<Route path='/edit-category' component={EditCategory} />
							<Route path='/add-category' component={AddCategory} />
							<Route path='/sub-categories' component={SubCategory} />
							<Route path='/edit-sub-category' component={EditSubCategory} />
							<Route path='/add-sub-category' component={AddSubCategory} />
							<Route path='/products' component={Products} />
							<Route path='/product-details' component={ProductDetails} />
							<Route
								path='/add-membership-plan'
								component={AddMemberShipPlan}
							/>
							<Route
								path='/edit-membership-plan'
								component={EditMemberShipPlan}
							/>
							<Redirect to='/error' />
						</Switch>
					</Suspense>
				</div>
			</AppLayout>
		);
	}
}
const mapStateToProps = ({ menu }) => {
	const { containerClassnames } = menu;
	return { containerClassnames };
};

export default withRouter(connect(mapStateToProps, {})(App));
