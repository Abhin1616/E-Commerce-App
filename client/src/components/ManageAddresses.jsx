import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { PlusIcon } from "@heroicons/react/24/outline";
import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";
import axios from 'axios';
import { enqueueSnackbar } from 'notistack';



const ManageAddresses = ({ address, setRefresh }) => {
    const [isOpen, setIsOpen] = useState(null);
    const location = useLocation()
    const navigate = useNavigate()
    const deleteAddress = (addressId) => {
        axios.delete(`http://localhost:3000/shoppingApp/customer/profile/address/${addressId}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        })
            .then((res) => {
                enqueueSnackbar(res.data.message, {
                    variant: 'success', autoHideDuration: 1800, anchorOrigin: {
                        vertical: 'top',
                        horizontal: 'center'
                    }
                })
                setRefresh({ rfrsh: (prevValue) => (!prevValue), loc: "address" })
            })
            .catch((err) => {
                enqueueSnackbar(err.response.data.error, {
                    variant: 'error', autoHideDuration: 1800, anchorOrigin: {
                        vertical: 'top',
                        horizontal: 'center'
                    }
                })
            })
    }
    return (
        <div className="ml-5 rounded-lg col-span-7 bg-white p-6 shadow-md flex flex-col" >
            <div className='text-2xl font-semibold mb-6' >
                Manage Addresses
            </div>

            <div className='flex justify-center'>
                <div className='text-left w-[95%]'>
                    <div className='flex items-center p-2 border border-gray-300 hover:bg-stone-100 cursor-pointer mb-10' onClick={() => (navigate("/shoppingApp/profile/add-address", { state: { from: location.pathname } }))}>
                        <PlusIcon className="h-5 w-5 text-blue-500" />
                        <h3 className='text-blue-600 ml-3 font-semibold'>ADD NEW ADDRESS</h3>
                    </div>
                    {address.map((adrs, idx) => (
                        <div className='mb-4 p-3 border border-gray-300 flex justify-between' key={idx}>
                            <div>
                                <label className='text-lg' value={adrs} htmlFor={idx}><small className='bg-gray-300 text-xs p-1 rounded-xl text-gray-600'>{adrs.addressType}</small><br /><span className='font-medium'>Phone: {adrs.phone}</span><br />{adrs.buildingName}, {adrs.street}, {adrs.district}, {adrs.state}, {adrs.pincode}<br />{adrs.landmark && adrs.landmark}</label>
                            </div>
                            <div className='cursor-pointer relative' onMouseEnter={() => { setIsOpen(idx) }} onMouseLeave={() => { setIsOpen(null) }}>
                                <EllipsisVerticalIcon className="h-6 w-6 text-gray-500" />
                                {isOpen === idx && (
                                    <div className=" absolute w-20 right-0 top-0 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                                        <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                                            <div onClick={() => {
                                                navigate(`/shoppingApp/profile/edit-address/${adrs._id}`, { state: { from: location.pathname } })
                                            }} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900" role="menuitem">Edit</div>
                                            <div className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900" role="menuitem" onClick={() => { deleteAddress(adrs._id) }}>Delete</div>
                                        </div>
                                    </div>
                                )}
                            </div>

                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default ManageAddresses