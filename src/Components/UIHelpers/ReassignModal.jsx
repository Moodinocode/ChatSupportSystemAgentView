import React from 'react'
import ReassignForm from './ReassignForm'

const ReassignModal = ({setIsModalOpen,ticketId}) => {
return (
    <dialog id="my_modal_1" className="modal modal-open">
      {/* <div className="modal-box p-6 rounded-2xl shadow-xl "> */}
        <ReassignForm setIsModalOpen={setIsModalOpen} ticketId={ticketId}/>
      {/* </div> */}
      <form method="dialog" className="modal-backdrop">
        <button onClick={()=> setIsModalOpen(false)}>close</button>
      </form>
    </dialog>
  )
}

export default ReassignModal