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
	import(/* webpackChunkName: "shops" */ './Farmer/')
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
	import(/* webpackChunkName: "add-shop" */ './Users/AddUser')
);
const Profile = React.lazy(() =>
	import(/* webpackChunkName: "add-shop" */ './profile')
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
								path={`/farmers`}
								render={(props) => <Farmer {...props} />}
							/>
							<Route
								path={`/add-farmer`}
								render={(props) => <AddFarmer {...props} />}
							/>
							<Route path={`/push`} render={(props) => <Push {...props} />} />
							<Route
								path={`/orders`}
								render={(props) => <Orders {...props} />}
							/>
							<Route path={`/add-user`} component={AddUser} />} />
							<Route path={`/profile`} component={Profile} />} />
							<Route
								path={`/app-information`}
								render={(props) => <AppInformation {...props} />}
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
