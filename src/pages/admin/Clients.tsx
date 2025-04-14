import { useEffect, useState } from "react";
import { FaArrowLeft, FaEdit, FaTrash, FaCheck, FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Typewriter from "typewriter-effect";
import {
  useDeleteClientMutation,
  useGetAllClientsQuery,
  useUpdateClientMutation,
} from "../../store/apiSlice/AuthSlice";
import Snipper from "../../components/global/Snipper";
import toast from "react-hot-toast";
import { Card, Client, SoldService } from "../../types/types";

const Clients = () => {
  const navigate = useNavigate();
  const [shouldFetchClients, setShouldFetchClients] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingClient, setEditingClient] = useState(null);
  const [editedData, setEditedData] = useState<any>({});

  // Get all clients
  const { data, isLoading, isError } = useGetAllClientsQuery({
    skip: !shouldFetchClients,
  });

  console.log(data);

  useEffect(() => {
    setShouldFetchClients(true);
  }, []);

  // Handle deleting client
  const [deleting, { data: deleteClientData }] = useDeleteClientMutation();

  const handleDeleteClient = (email: string) => {
    try {
      deleting(email);
      console.log("Delete client with ID:", email);
    } catch (error) {
      console.log("Error Error");
    }
  };
  console.log(deleteClientData);

  // Enable editing by show keys as a input
  const startEditing = (client: Client) => {
    setEditingClient(client?.id);
    setEditedData({ ...client });
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditingClient(null);
    setEditedData({});
  };

  // Hande save changing
  const [updateClient, { data: response, error, isSuccess }] =
    useUpdateClientMutation();
  console.log(isSuccess);

  const saveChanges = async (email: string) => {
    try {
      await updateClient({ data: editedData, email }).unwrap();
      setEditingClient(null);
      setEditedData({});
    } catch (error) {
      console.log("there an ERROR while update client");
    }
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success(`${response?.message}`);
      console.log(response);
    } else if (isError) {
      // toast.success(`${error?.message}`);
    }
  }, [error, isSuccess]);

  // Handle input changing
  const handleInputChange = (e: any, field: any) => {
    setEditedData((prev: any) => ({ ...prev, [field]: e.target.value }));
  };

  // Filtered client count
  const filteredClients = data?.clients?.filter((client: any) => {
    const fullName = `${client.first_name} ${client.last_name}`.toLowerCase();
    return (
      fullName.includes(searchTerm.toLowerCase()) ||
      client?.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client?.phone.includes(searchTerm)
    );
  });

  return (
    <div className="">
      {/* Header */}
      <div className="flex flex-col sm:flex-row-reverse items-center justify-between mb-8 space-y-4 sm:space-y-0">
        <button
          onClick={() => navigate("/admin-dashboard")}
          className="p-2 bg-green-950 rounded-full absolute top-8 right-6 flex items-center cursor-pointer space-x-2 text-gray-400 hover:text-white transition"
        >
          <FaArrowLeft color="white" />
        </button>

        <h1 className="text-xl font-bold text-center sm:text-left">
          <Typewriter
            options={{
              strings: ["Manage Clients", "View & Edit"],
              autoStart: true,
              loop: true,
            }}
          />
        </h1>
      </div>

      {/* Search Input */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by name, email, or phone..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-lg p-3 rounded-xl bg-gray-800 text-white placeholder-gray-400 focus:ring-2 focus:ring-green-600 outline-none"
        />
      </div>

      {isLoading ? (
        <Snipper />
      ) : isError ? (
        <p className="text-center text-red-500">Error</p>
      ) : (
        <>
          <div className="text-sm text-gray-300 mb-4">
            Total Clients: {filteredClients?.length || 0}
          </div>

          {filteredClients?.length > 0 ? (
            <div className="overflow-auto max-h-[505]">
              <table className="w-full border-collapse border border-gray-700 rounded-2xl shadow-lg overflow-hidden">
                <thead className="bg-gray-800 text-gray-300">
                  <tr>
                    <th className="px-8 py-4 text-left">#</th>
                    <th className="px-8 py-4 text-left">Name</th>
                    <th className="px-8 py-4 text-left">Email</th>
                    <th className="px-8 py-4 text-left">Phone</th>
                    <th className="px-8 py-4 text-left">City</th>
                    <th className="px-8 py-4 text-left">Job</th>
                    <th className="px-8 py-4 text-left">Age</th>
                    <th className="px-8 py-4 text-left">Role</th>
                    <th className="px-8 py-4 text-left">Cards</th>
                    <th className="px-8 py-4 text-left">Services</th>
                    <th className="px-8 py-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredClients.map((client: any, i: number) => (
                    <tr
                      key={client.id}
                      className="border-t border-gray-700 hover:bg-gray-800 transition"
                    >
                      <td className="px-8 py-4">{i + 1}</td>

                      {editingClient === client.id ? (
                        <>
                          <td className="px-8 py-4">
                            <input
                              value={editedData?.first_name}
                              onChange={(e) =>
                                handleInputChange(e, "first_name")
                              }
                              className="bg-gray-700 text-white p-2 rounded-md"
                            />
                            <input
                              value={editedData.last_name}
                              onChange={(e) =>
                                handleInputChange(e, "last_name")
                              }
                              className="bg-gray-700 text-white p-2 rounded-md ml-2"
                            />
                          </td>
                          <td className="px-8 py-4">
                            <input
                              value={editedData.email}
                              onChange={(e) => handleInputChange(e, "email")}
                              className="bg-gray-700 text-white p-2 rounded-md"
                            />
                          </td>
                          <td className="px-8 py-4">
                            <input
                              value={editedData.phone}
                              onChange={(e) => handleInputChange(e, "phone")}
                              className="bg-gray-700 text-white p-2 rounded-md"
                            />
                          </td>
                          <td className="px-8 py-4">
                            <input
                              value={editedData.city}
                              onChange={(e) => handleInputChange(e, "city")}
                              className="bg-gray-700 text-white p-2 rounded-md"
                            />
                          </td>
                          <td className="px-8 py-4">
                            <input
                              value={editedData.job}
                              onChange={(e) => handleInputChange(e, "job")}
                              className="bg-gray-700 text-white p-2 rounded-md"
                            />
                          </td>
                          <td className="px-8 py-4">
                            <input
                              value={editedData.birthday}
                              onChange={(e) => handleInputChange(e, "birthday")}
                              className="bg-gray-700 text-white p-2 rounded-md"
                            />
                          </td>
                          <td className="px-8 py-4">
                            <input
                              value={editedData.role}
                              onChange={(e) => handleInputChange(e, "role")}
                              className="bg-gray-700 text-white p-2 rounded-md"
                            />
                          </td>
                          <td className="px-8 py-4">
                            <input
                              value={
                                editedData?.cards?.type
                                  ? editedData?.cards?.type
                                  : "Empty"
                              }
                              readOnly
                              className="bg-gray-700 text-white p-2 rounded-md"
                            />
                          </td>
                          <td className="px-8 py-4">
                            <input
                              value={
                                editedData?.soldServices?.type
                                  ? editedData?.soldServices?.type
                                  : "Empty"
                              }
                              readOnly
                              className="bg-gray-700 text-white p-2 rounded-md"
                            />
                          </td>
                        </>
                      ) : (
                        <>
                          <td className="px-8 py-4 whitespace-nowrap">{`${client?.first_name} ${client?.last_name}`}</td>
                          <td className="px-8 py-4">{client?.email}</td>
                          <td className="px-8 py-4">{client?.phone}</td>
                          <td className="px-8 py-4">{client?.city}</td>
                          <td className="px-8 py-4 whitespace-nowrap">
                            {client?.job}
                          </td>
                          <td className="px-8 py-4">
                            {new Date().getFullYear() -
                              new Date(client?.birthday).getFullYear()}
                          </td>
                          <td className="px-8 py-4">{client?.role}</td>

                          <td className="px-8 py-4 text-center">
                            {client?.cards?.length > 0
                              ? client.cards
                                  .map((card: Card) => card?.nfc_shap)
                                  .join(" ")
                              : "Empty"}
                          </td>
                          <td className="px-8 py-4 text-center">
                            {client?.soldServices?.length > 0
                              ? client?.soldServices
                                  .map(
                                    (soldServices: SoldService) =>
                                      soldServices?.type
                                  )
                                  .join(" ")
                              : "Empty"}{" "}
                          </td>
                        </>
                      )}

                      <td className="px-8 py-4 flex items-center justify-center space-x-4">
                        {editingClient === client.id ? (
                          <>
                            <button
                              onClick={() => saveChanges(client?.email)}
                              className="text-green-500 hover:text-green-600 cursor-pointer"
                            >
                              <FaCheck />
                            </button>
                            <button
                              onClick={cancelEditing}
                              className="text-red-500 hover:text-red-600 cursor-pointer"
                            >
                              <FaTimes />
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => startEditing(client)}
                            className="text-blue-400 hover:text-blue-500 cursor-pointer"
                          >
                            <FaEdit />
                          </button>
                        )}

                        <button
                          onClick={() => handleDeleteClient(client?.email)}
                          className="text-red-500 hover:text-red-600 cursor-pointer"
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-center text-gray-400 mt-12">No clients found.</p>
          )}
        </>
      )}
    </div>
  );
};

export default Clients;
