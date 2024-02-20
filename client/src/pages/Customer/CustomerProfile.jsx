import React, { useEffect, useState } from 'react'
import defaultMale from '../Profile Pics/maleDefault.png'
import defaultFemale from '../Profile Pics/femaleDefault.png'
import others from '../Profile Pics/default.jpg'
import axios from 'axios'
import { ChevronRightIcon } from "@heroicons/react/24/outline";
import UserDetails from '../../components/UserDetails'
import ManageAddresses from '../../components/manageAddresses'
import { useLocation, useNavigate } from 'react-router-dom'

const CustomerProfile = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const [refresh, setRefresh] = useState({ rfrsh: true, loc: null })
    const [profile, setProfile] = useState()
    const [selectedOpt, setSelectedOpt] = useState(refresh.loc || location.state?.selectedOpt || "Profile")
    useEffect(() => {
        axios.get("http://localhost:3000/shoppingApp/customer/profile", {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        })
            .then((res) => {
                console.log(res)
                setProfile(res.data)
            })
            .catch((err) => {
                console.log(err)
            })
    }, [refresh])
    return (
        <div>
            {profile && <div className="h-full pb-20 min-h-[90vh] bg-gray-100 pt-10">
                <h1 className=" mb-10 text-center text-3xl font-semibold">Profile</h1>
                <div className="mx-auto max-w-6xl justify-center px-6 md:flex md:space-x-6 xl:px-0">

                    <div className="rounded-lg md:w-full">
                        <div className='grid grid-cols-9 gap-4'>
                            <div className='col-span-2'>
                                <div className="rounded-lg bg-white p-3 shadow-md flex">
                                    <div className='text-2xl font-bold mb-3'>
                                        <img style={{ width: "50px", height: "50px", borderRadius: "50%" }} src={profile.gender === "male" && defaultMale || profile.gender === "female" && defaultFemale || profile.gender === "others" && others} alt="" />
                                    </div>
                                    <div className='ml-5'>
                                        <small>
                                            Hello,
                                        </small>
                                        <div className='font-semibold'>
                                            {profile.name}
                                        </div>
                                    </div>
                                </div>
                                <div className="rounded-lg shadow-md flex flex-col mt-10 bg-white py-6">
                                    <div className='text-xl font-bold mb-3 text-gray-500 flex justify-between items-center cursor-pointer hover:text-blue-600 px-6' onClick={() => { navigate("/shoppingApp/view-order-history") }} >
                                        <span>Orders</span>
                                        <ChevronRightIcon className="h-6 w-6 text-gray-500 mt-1" />
                                    </div>
                                    <hr className="my-4" />
                                    <div className='px-6 text-xl font-bold mb-5'>
                                        Account Settings
                                    </div>
                                    <div onClick={() => { setSelectedOpt("Profile") }} className={`cursor-pointer px-6 font-semibold hover:text-blue-600 hover:bg-teal-50 py-2 ${selectedOpt === "Profile" && "text-blue-600 bg-teal-50"}`}>
                                        Profile Information
                                    </div>
                                    <div onClick={() => { setSelectedOpt("Address") }} className={`cursor-pointer px-6 font-semibold hover:text-blue-600 hover:bg-teal-50 py-2 ${selectedOpt === "Address" && "text-blue-600 bg-teal-50"}`}>
                                        Manage Addresses
                                    </div>
                                </div>

                            </div>
                            {selectedOpt === "Profile" && <UserDetails setRefresh={setRefresh} customer={profile} /> || selectedOpt === "Address" && <ManageAddresses address={profile.address} setRefresh={setRefresh} />}
                        </div>

                    </div>
                </div>
            </div>}
        </div>
    )
}

export default CustomerProfile