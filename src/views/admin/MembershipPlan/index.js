import React, { Fragment, useState, useEffect } from 'react';
import ListPageHeading from 'containers/pages/ListPageHeading';
import Pagination from 'containers/pages/Pagination';
import { getMemberShipPlan } from 'Apis/admin';
import { NotificationManager } from 'components/common/react-notifications';
import { Link } from 'react-router-dom';
import StatusUpdate from 'components/UpdateStatus';
import DeleteData from 'components/DeleteData';
import { convertDate } from 'constants/defaultValues';
import { additional } from './Constants';
const planTypes = {
	1: 'Montly',
	2: 'Yearly',
	3: 'Life Time',
};
const MemberShipPlan = React.memo(({ match, history }) => {
	const [pageInfo, setPageInfo] = useState(additional);
	const [memberShipPlanList, setMemberShipPlanList] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [selectedPageSize, setSelectedPageSize] = useState(10);
	const [currentPage, setCurrentPage] = useState(1);
	const [searchText, setSearchtext] = useState(undefined);
	useEffect(() => {
		getMemberShipPlan(currentPage, selectedPageSize, searchText)
			.then((res) => {
				const { data } = res;
				const { result, pagination } = data.data;
				setIsLoading(false);
				setMemberShipPlanList(result);
				additional.totalItemCount = pagination.totalRecord;
				additional.selectedPageSize = pagination.limit;
				additional.totalPage = pagination.totalPage;
				setPageInfo({ ...additional });
			})
			.catch((err) => {
				setIsLoading(false);
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
	}, [selectedPageSize, currentPage, searchText]);
	const onSearchKey = (event) => {
		setSearchtext(event.target.value);
	};
	const changePageSize = (value) => {
		setIsLoading(true);
		setSelectedPageSize(value);
	};
	const onChangePage = (value) => {
		setCurrentPage(value);
	};
	const DeleteDataLocal = (key) => {
		memberShipPlanList.splice(key, 1);
		setMemberShipPlanList([...memberShipPlanList]);
	};
	const updateLocal = (value, key) => {
		memberShipPlanList[key] = value;
		setMemberShipPlanList([...memberShipPlanList]);
	};
	const startIndex = (currentPage - 1) * selectedPageSize;
	const endIndex = currentPage * selectedPageSize;
	return isLoading ? (
		<div className='loading' />
	) : (
		<Fragment>
			<ListPageHeading
				match={match}
				heading='MemberShip Plan'
				addShow
				Addname='+ Add New Plan'
				onClick={() => history.push('/add-membership-plan')}
				changePageSize={changePageSize}
				selectedPageSize={selectedPageSize}
				totalItemCount={pageInfo.totalItemCount}
				startIndex={startIndex}
				endIndex={endIndex}
				onSearchKey={onSearchKey}
				orderOptions={pageInfo.orderOptions}
				pageSizes={pageInfo.pageSizes}
			/>
			<table className='table table-striped'>
				<thead>
					<tr>
						<th>#</th>
						<th>Name</th>
						<th>Amount</th>
						<th>Plan Type</th>
						<th>Status</th>
						<th>Created Date</th>
						<th>Action</th>
					</tr>
				</thead>
				<tbody>
					{memberShipPlanList.map((plans, key) => (
						<>
							<tr>
								<td>{key + 1}</td>
								<td>
									<Link
										to={{
											pathname: '/edit-membership-plan',
											state: { plans },
										}}
										className='d-flex'
									>
										{' '}
										{plans.name}
									</Link>
								</td>
								<td>
									<Link
										to={{
											pathname: '/edit-membership-plan',
											state: { plans },
										}}
										className='d-flex'
									>
										{plans.amount}
									</Link>
								</td>
								<td>{planTypes[plans.type]}</td>
								<td>
									<StatusUpdate
										table='memberships'
										onUpdate={(data) => updateLocal(data, key)}
										data={plans}
									/>
								</td>
								<td>{convertDate(plans.created)}</td>
								<td>
									<Link
										to={{
											pathname: '/edit-membership-plan',
											state: { plans },
										}}
										className='btn btn-info btn-sm'
									>
										Edit
									</Link>{' '}
									<DeleteData
										classes='btn-sm'
										table='memberships'
										view='Membership Plan'
										data={plans.id}
										ondelete={() => DeleteDataLocal(key)}
									>
										Delete
									</DeleteData>
								</td>
							</tr>
						</>
					))}
				</tbody>
			</table>
			<Pagination
				currentPage={currentPage}
				totalPage={pageInfo.totalPage}
				onChangePage={(i) => onChangePage(i)}
			/>
		</Fragment>
	);
});

export default MemberShipPlan;
