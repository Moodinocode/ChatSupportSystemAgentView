import React, { useEffect, useState } from 'react';
import { getAgentsForReassign } from '../../Services/agentService';
import { getCategories } from '../../Services/categoryService';
import useTicketStore from '../../Stores/useTicketStore';

const ReassignForm = ({setIsModalOpen, ticketId }) => {
  const [agents, setAgents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedAgent, setSelectedAgent] = useState('');
  const [selectedCategory, setSelectedCategory] = useState();
  const [loading, setLoading] = useState(true);
  const {handleUpdateTicketCategory,handleAssignTicket,getTicketCategory} = useTicketStore()


  useEffect(() => {

    const fetchData = async () => {
      try {
        const agentsData = await getAgentsForReassign(ticketId);
        const categoriesData = await getCategories();


        setAgents(agentsData.data || []);
        setCategories(categoriesData.data || []);
      } catch (error) {
        console.error('Error fetching agents or categories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedAgent && !selectedCategory) {
      alert('Please select either an agent or a category.');
      return;
    }

    try {
      let response;

      if (selectedAgent) {
        const agent = agents.find(a => a.id === Number(selectedAgent));

        console.log(agent)
        response = await handleAssignTicket(ticketId, agent);
      } else if (selectedCategory) {
        response = await handleUpdateTicketCategory(ticketId, selectedCategory);
      }

      console.log('Update response:', response);
      setIsModalOpen(false); // Close modal after successful update
    } catch (error) {
      console.error('Error updating ticket:', error);
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <form onSubmit={handleSubmit} className=" modal-box p-6  max-w-md bg-white rounded-2xl space-y-4">
      <h2 className="text-xl font-semibold text-gray-800">Reassign Ticket</h2>

      {/* Agent Dropdown */}
      <div>
        <label className="block mb-2 text-gray-700">Reassign to Agent:</label>
        <select
          className="w-full border rounded-lg p-2"
          value={selectedAgent}
          onChange={(e) => {
            setSelectedAgent(e.target.value);
            setSelectedCategory(); 
          }}
          disabled={!!selectedCategory}
        >
          <option value="">Select an agent</option>
          {agents.map((agent) => (
            <option key={agent.id} value={agent.id}>
              {agent.username}
            </option>
          ))}
        </select>
      </div>
      <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" onClick={()=> setIsModalOpen(false)}>✕</button>

      <div className="text-center text-gray-500">OR</div>

      {/* Category Dropdown */}
      <div>
        
        <label className="block mb-2 text-gray-700">Change Category:</label>
        <select
          className="w-full border rounded-lg p-2"
          value={selectedCategory}
          onChange={(e) => {
            console.log(e.target.value)
            setSelectedCategory(e.target.value);
            setSelectedAgent(''); // Clear agent if category is chosen
          }}
          disabled={!!selectedAgent}
        >
          <option value="">Select a category</option>
          {categories.map((category) => (
            <option key={category.id} value={category.name}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        className="w-full bg-teal-600 text-white p-2 rounded-xl hover:bg-teal-700 transition"
      >
        Submit
      </button>
    </form>
  );
};

export default ReassignForm;
