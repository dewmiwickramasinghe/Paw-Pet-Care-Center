import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import AOS from 'aos';
import 'aos/dist/aos.css';

function ManagerHeader() {
	const [searchQuery, setSearchQuery] = useState('');
	const navigate = useNavigate();
	const location = useLocation();

	useEffect(() => {
		AOS.init({
			duration: 800,
			once: true,
		});
	}, []);

	const handleSearch = (e) => {
		e.preventDefault();
		if (searchQuery.trim()) {
			navigate(`/items?search=${searchQuery}`);
		}
	};

	// Check if the current path matches the link path
	const isActive = (path) => {
		return location.pathname === path;
	};

	// Sidebar item animation variants
	const itemVariants = {
		hover: {
			backgroundColor: 'rgba(255, 255, 255, 0.1)',
			scale: 1.02,
			transition: { duration: 0.2 },
		},
	};

	return (
		<div className='d-flex'>
			{/* Sidebar Navigation */}
			<motion.nav
				className='position-fixed top-0 start-0 vh-100 shadow-lg'
				style={{
					width: '16rem',
					background: 'linear-gradient(to bottom, #1a1a2e, #16213e)',
					zIndex: 1000,
				}}
				initial={{ x: -50, opacity: 0 }}
				animate={{ x: 0, opacity: 1 }}
				transition={{ duration: 0.5 }}>
				<div
					className='text-center py-4 mb-3'
					style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
					<h4 className='fw-bold text-white mb-0'>
						<i className='fas fa-paw me-2'></i>
						PawCare
					</h4>
					<small className='text-light opacity-75'>Manager Dashboard</small>
				</div>

				{/* Search Bar */}
				<div className="search-container p-3">
					<form onSubmit={handleSearch}>
						<input
							type="text"
							className="form-control"
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							placeholder="Search items"
						/>
						<button type="submit" className="btn btn-primary mt-2 w-100">
							Search
						</button>
					</form>
				</div>

				<div className='d-flex flex-column gap-1 px-3'>
					<motion.div
						whileHover='hover'
						variants={itemVariants}
						data-aos='fade-right'
						data-aos-delay='100'>
						<Link
							className={`text-decoration-none d-flex align-items-center p-3 rounded ${
								isActive('/dashboard/shashini') ? 'bg-primary text-white' : 'text-light'
							}`}
							to='/dashboard/shashini'>
							<i className='fas fa-boxes me-3'></i>
							<span className='fw-medium'>Inventory</span>
						</Link>
					</motion.div>

					<motion.div
						whileHover='hover'
						variants={itemVariants}
						data-aos='fade-right'
						data-aos-delay='200'>
						<Link
							className={`text-decoration-none d-flex align-items-center p-3 rounded ${
								isActive('/dashboard/catagory') ? 'bg-primary text-white' : 'text-light'
							}`}
							to='/dashboard/catagory'>
							<i className='fas fa-tags me-3'></i>
							<span className='fw-medium'>Category</span>
						</Link>
					</motion.div>

					<motion.div
						whileHover='hover'
						variants={itemVariants}
						data-aos='fade-right'
						data-aos-delay='300'>
						<Link
							className={`text-decoration-none d-flex align-items-center p-3 rounded ${
								isActive('/dashboard/addcatagory') ? 'bg-primary text-white' : 'text-light'
							}`}
							to='/dashboard/addcatagory'>
							<i className='fas fa-plus-circle me-3'></i>
							<span className='fw-medium'>Add Category</span>
						</Link>
					</motion.div>

					<motion.div
						whileHover='hover'
						variants={itemVariants}
						data-aos='fade-right'
						data-aos-delay='400'>
						<Link
							className={`text-decoration-none d-flex align-items-center p-3 rounded ${
								isActive('/dashboard/summery') ? 'bg-primary text-white' : 'text-light'
							}`}
							to='/dashboard/summery'>
							<i className='fas fa-chart-bar me-3'></i>
							<span className='fw-medium'>Report</span>
						</Link>
					</motion.div>

					<motion.div
						whileHover='hover'
						variants={itemVariants}
						data-aos='fade-right'
						data-aos-delay='500'>
						<Link
							className={`text-decoration-none d-flex align-items-center p-3 rounded ${
								isActive('/dashboard/additem') ? 'bg-primary text-white' : 'text-light'
							}`}
							to='/dashboard/additem'>
							<i className='fas fa-plus me-3'></i>
							<span className='fw-medium'>Add Item</span>
						</Link>
					</motion.div>

					<motion.div
						whileHover='hover'
						variants={itemVariants}
						data-aos='fade-right'
						data-aos-delay='600'>
						<Link
							className={`text-decoration-none d-flex align-items-center p-3 rounded ${
								isActive('/Store') ? 'bg-primary text-white' : 'text-light'
							}`}
							to='/Store'>
							<i className='fas fa-store me-3'></i>
							<span className='fw-medium'>Store</span>
						</Link>
					</motion.div>
				</div>

				<div
					className='position-absolute bottom-0 start-0 w-100 p-3'
					style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
					<motion.button
						className='btn btn-outline-light w-100'
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.95 }}
						onClick={() => navigate('/login')}>
						<i className='fas fa-sign-out-alt me-2'></i> Logout
					</motion.button>
				</div>
			</motion.nav>

			{/* Content Area */}
			<div
				className='flex-grow-1 ms-5 ps-5 pt-4'
				style={{ marginLeft: '16rem' }}>
				{/* Other content of your page goes here */}
			</div>
		</div>
	);
}

export default ManagerHeader;
