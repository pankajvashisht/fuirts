import React, { Fragment, useState, useEffect } from 'react';
import ListPageHeading from '../../../containers/pages/ListPageHeading';
import Pagination from '../../../containers/pages/Pagination';
import { getLocation } from '../../../Apis/admin';
import { NotificationManager } from '../../../components/common/react-notifications';
import { Card } from 'reactstrap';
import { NavLink } from 'react-router-dom';
import classnames from 'classnames';
import { ContextMenuTrigger } from 'react-contextmenu';
import { Colxx } from '../../../components/common/CustomBootstrap';
import StatusUpdate from '../../../components/UpdateStatus';
import DeleteData from '../../../components/DeleteData';
import { convertDate } from '../../../constants/defaultValues';
import AddLocation from '../../../containers/pages/AddLocation';
import './location.css';
const additional = {
	currentPage: 1,
	totalItemCount: 0,
	totalPage: 1,
	search: '',
	pageSizes: [ 10, 20, 50, 100 ]
};
const Locations = React.memo((props) => {
	const [ pageInfo, setPageInfo ] = useState(additional);
	const [ totalPosts, setTotalPost ] = useState([]);
	const [ isLoading, setIsLoading ] = useState(true);
	const [ selectedPageSize, setSelectedPageSize ] = useState(10);
	const [ currentPage, setCurrentPage ] = useState(1);
	const [ searchText, setSearchtext ] = useState(undefined);
	const [ showModel, setShowModel ] = useState(false);
	useEffect(
		() => {
			getLocation(currentPage, selectedPageSize, searchText)
				.then((res) => {
					const { data } = res;
					const { result, pagination } = data.data;
					setIsLoading(false);
					setTotalPost(result);
					additional.totalItemCount = pagination.totalRecord;
					additional.selectedPageSize = pagination.limit;
					additional.totalPage = pagination.totalPage;
					setPageInfo({ ...additional });
				})
				.catch((err) => {
					if (err.response) {
						const { data } = err.response;
						NotificationManager.warning(data.error_message, 'Something went wrong', 3000, null, null, '');
					}
				})
				.finally(() => setIsLoading(false));
		},
		[ selectedPageSize, currentPage, searchText ]
	);
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
	const onCheckItem = (key, value) => {};
	const DeleteDataLocal = (key) => {
		totalPosts.splice(key, 1);
		setTotalPost([ ...totalPosts ]);
	};
	const updateLocal = (value, key) => {
		totalPosts[key] = value;
		setTotalPost([ ...totalPosts ]);
	};
	const returnBack = () => {
		setShowModel(false);
		setIsLoading(true);
		getLocation(currentPage, selectedPageSize, searchText)
			.then((res) => {
				const { data } = res;
				const { result, pagination } = data.data;
				setTotalPost(result);
				additional.totalItemCount = pagination.totalRecord;
				additional.selectedPageSize = pagination.limit;
				additional.totalPage = pagination.totalPage;
				setPageInfo({ ...additional });
			})
			.catch((err) => {
				if (err.response) {
					const { data } = err.response;
					NotificationManager.warning(data.error_message, 'Something went wrong', 3000, null, null, '');
				}
			})
			.finally(() => setIsLoading(false));
	};
	const AddCategoryModel = () => {
		setShowModel(true);
	};
	const HideModel = () => {
		setShowModel(false);
	};
	const startIndex = (currentPage - 1) * selectedPageSize;
	const endIndex = currentPage * selectedPageSize;
	return isLoading ? (
		<div className="loading" />
	) : (
		<Fragment>
			<ListPageHeading
				match={props.match}
				heading="Location"
				addShow={true}
				Addname="Add Location"
				changePageSize={changePageSize}
				selectedPageSize={selectedPageSize}
				totalItemCount={pageInfo.totalItemCount}
				startIndex={startIndex}
				endIndex={endIndex}
				toggleModal={AddCategoryModel}
				onSearchKey={onSearchKey}
				orderOptions={pageInfo.orderOptions}
				pageSizes={pageInfo.pageSizes}
			/>
			<AddLocation modalOpen={showModel} toggleModal={HideModel} onSucess={returnBack} />
			{totalPosts.map((post, key) => (
				<Colxx xxs="12" key={post.id} className="mb-3">
					<ContextMenuTrigger id="menu_id" data={post.id}>
						<Card
							onClick={(event) => onCheckItem(event, post.id)}
							className={classnames('d-flex flex-row', {
								active: 'active'
							})}
						>
							<div className="pl-2 d-flex flex-grow-1 min-width-zero">
								<div className="card-body align-self-center d-flex flex-column flex-lg-row justify-content-between min-width-zero align-items-lg-center">
									<NavLink to={`?p=${post.id}`} className="w-40 w-sm-100">
										<p className="list-item-heading mb-1 truncate">{post.location}</p>
									</NavLink>
									<p className="mb-1 text-muted text-small w-15 w-sm-100">
										{convertDate(post.created)}
									</p>
									<div className="w-15 w-sm-100">
										<StatusUpdate
											table="locations"
											onUpdate={(data) => updateLocal(data, key)}
											data={post}
										/>
									</div>
								</div>
								<div className="custom-control custom-checkbox pl-1 align-self-center pr-4">
									<DeleteData table="locations" data={post.id} ondelete={() => DeleteDataLocal(key)}>
										Delete
									</DeleteData>
								</div>
							</div>
						</Card>
					</ContextMenuTrigger>
				</Colxx>
			))}

			<Pagination
				currentPage={currentPage}
				totalPage={pageInfo.totalPage}
				onChangePage={(i) => onChangePage(i)}
			/>
		</Fragment>
	);
});

export default Locations;
