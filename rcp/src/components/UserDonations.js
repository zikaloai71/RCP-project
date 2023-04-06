import React, { useState } from "react";
import EditDonation from "./EditDonation";
import useRestfulApi from "../hooks/useRestfulApi";

import { toast } from "react-toastify";

export default function UserDonations(props) {
  const [error, sendReq] = useRestfulApi();
  const [editDonationFormFlag, setEditDonationFormFlag] = useState("");
  const [loading , setLoading] = useState(false)

  function toggleEditDonationFormFlag(id) {
    setEditDonationFormFlag(id);
  }

  async function deleteDonation(id) {
    try {
      setLoading(true);
      let response = await sendReq(
        props.currentUser.user.userType === "seller"
          ? `sellerDonations/deleteDonation/${id}}`
          : `producerDonations/deleteDonation/${id}`,
        "DELETE",
        null,
        props.currentUser.token
      );
      setLoading(false)
      if (!response.apiStatus) {
        toast.error(response.message);
        return;
      }
      toast.info("your donation has been removed");
    } catch (err) {
      toast.error(error);
      setLoading(false)
    }
  }

  return (
    <>
      <p className="w-2/12">{props.charityName}</p>
      <p className="w-2/12">{props.quantity} kg</p>
      <p className="w-2/12">{props.productName}</p>
      {loading ? <button className="bg-gray-500 p-2 rounded">deleting...</button> :
      <>
        <button
        className="bg-yellow-500 p-2 rounded "
        onClick={() => toggleEditDonationFormFlag(props.donationId)}
      >
        edit
      </button>
      <button
        className="bg-red-500 p-2 rounded"
        onClick={() => {
          deleteDonation(props.donationId);
        }}
      >
        delete
      </button>
      {props.donationId === editDonationFormFlag ? (
        <EditDonation
          currentUser={props.currentUser}
          setEditDonationFormFlag={setEditDonationFormFlag}
          url={
            props.currentUser.user.userType === "seller"
              ? `sellerDonations/editDonation/${props.donationId}}`
              : `producerDonations/editDonation/${props.donationId}`
          }
        />
      ) : (
        <></>
      )}
      
      </>
      
    }
    
    </>
  );
}
