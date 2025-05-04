"use client";
import { Dialog, Transition } from "@headlessui/react";
import React, { useEffect, useState, Fragment } from "react";
import { toast, ToastContainer } from "react-toastify";

type Team = {
  id: number;
  image: any;
  full_name: string;
  position_en: string;
  position_ru: string;
  position_de: string;
};

const TeamPage: React.FC = () => {
  const [data, setData] = useState<Team[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editTeam, setEditTeam] = useState<Team | null>(null);

  const [imagePreview, setImagePreview] = useState<string>("");

  const [token, setToken] = useState<string | null>(null);
  const [image, setImage] = useState<File | null>(null);
  const [fullName, setFullName] = useState("");
  const [positionEn, setPositionEn] = useState("");
  const [positionRu, setPositionRu] = useState("");
  const [positionDe, setPositionDe] = useState("");

  const [clickId, setClickId] = useState<number | null>(null);

  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    const accessToken = localStorage.getItem("access_token");
    setToken(accessToken);
  }, []);

  const getTeam = () => {
    setLoadingData(true);

    fetch("https://back.ifly.com.uz/api/team-section")
      .then((response) => response.json())
      .then((item) => setData(item?.data));
    setLoadingData(false);
  };

  useEffect(() => {
    getTeam();
  }, []);

  const createTeam = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData();
    if (image) formData.append("file", image);
    formData.append("full_name", fullName);
    formData.append("position_en", positionEn);
    formData.append("position_ru", positionRu);
    formData.append("position_de", positionDe);

    fetch("https://back.ifly.com.uz/api/team-section", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    })
      .then((res) => res.json())
      .then((item) => {
        if (item?.success) {
          toast.success("Successfully Added");
          getTeam();
        } else {
          toast.error("Failed to add");
        }
        closeModal();
      })
      .catch((err) => console.error("Ошибка при создании:", err));
  };

  const updateTeam = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData();
    if (image) formData.append("file", image);
    formData.append("full_name", fullName);
    formData.append("position_en", positionEn);
    formData.append("position_ru", positionRu);
    formData.append("position_de", positionDe);

    fetch(`https://back.ifly.com.uz/api/team-section/${clickId}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    })
      .then((res) => res.json())
      .then((item) => {
        if (item?.success) {
          toast.success("Successfully Updated");
          getTeam();
        } else {
          toast.error("Failed to update");
        }
        setEditModalOpen(false);
      })
      .catch((err) => console.error("Ошибка при обновлении:", err));
  };

  const deleteTeam = (id: number) => {
    fetch(`https://back.ifly.com.uz/api/team-section/${id}`, {
      method: "DELETE",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((elem) => {
        if (elem.success) {
          toast.success(elem?.data?.message);
          getTeam();
        } else {
          toast.error(elem?.message);
        }
      });
  };

  function openModal() {
    setIsOpen(true);
    setImage(null);
    setImagePreview("");
    setFullName("");
    setPositionEn("");
    setPositionRu("");
    setPositionDe("");
  }

  function closeModal() {
    setIsOpen(false);
  }

  useEffect(() => {
    if (editTeam) {
      setImagePreview(editTeam.image);
      setImage(null);
      setFullName(editTeam.full_name);
      setPositionEn(editTeam.position_en);
      setPositionRu(editTeam.position_ru);
      setPositionDe(editTeam.position_de);
    }
  }, [editTeam]);

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      {loadingData ? (
        <div className="flex justify-center items-center h-64">
          <svg
            className="animate-spin h-8 w-8 text-blue-500"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8z"
            />
          </svg>
        </div>
      ) : (
        <>
          {/* Контакты */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Team</h2>
            <button
              onClick={openModal}
              className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded cursor-pointer"
            >
              Add Team Member
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200 rounded">
              <thead className="bg-gray-200">
                <tr>
                  <th className="py-2 px-4 border">№</th>
                  <th className="py-2 px-4 border">Image</th>
                  <th className="py-2 px-4 border">Full Name</th>
                  <th className="py-2 px-4 border">Postion (EN)</th>
                  <th className="py-2 px-4 border">Postion (RU)</th>
                  <th className="py-2 px-4 border">Postion (DE)</th>
                  <th className="py-2 px-4 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data?.map((element) => (
                  <tr key={element.id} className="text-center">
                    <td className="py-2 px-4 border">{element.id}</td>
                    <td className="py-2 px-4 border">
                      <img
                        src={`https://back.ifly.com.uz/${element.image}`}
                        alt="image"
                        className="rounded w-full h-40 object-cover"
                      />
                    </td>
                    <td className="py-2 px-4 border">{element.full_name}</td>
                    <td className="py-2 px-4 border">{element.position_en}</td>
                    <td className="py-2 px-4 border">{element.position_ru}</td>
                    <td className="py-2 px-4 border">{element.position_de}</td>

                    <td className="py-2 px-4 border space-x-2">
                      <button
                        onClick={() => {
                          setEditTeam(element);
                          setEditModalOpen(true);
                          setClickId(element?.id);
                        }}
                        className="bg-yellow-400 hover:bg-yellow-500 text-white py-1 px-3 rounded cursor-pointer"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteTeam(element.id)}
                        className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded cursor-pointer"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Add Modal */}
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div className="fixed inset-0 bg-black/50 bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-3xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-xl font-semibold leading-6 text-gray-900"
                  >
                    Add New Team
                  </Dialog.Title>
                  <form className="mt-4 flex flex-col" onSubmit={createTeam}>
                    <label className="font-semibold">Image</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setImage(file); // File
                          setImagePreview(URL.createObjectURL(file)); // string
                        }
                      }}
                    />

                    {imagePreview && (
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-[50%] object-cover rounded"
                      />
                    )}

                    <label className="font-semibold">Full Name</label>
                    <input
                      type="text"
                      onChange={(e) => setFullName(e.target.value)}
                      value={fullName}
                      className="w-full border border-gray-400 p-2 rounded mb-3"
                      required
                    />
                    <label className="font-semibold">Position (EN)</label>
                    <input
                      type="text"
                      onChange={(e) => setPositionEn(e.target.value)}
                      value={positionEn}
                      className="w-full border border-gray-400 p-2 rounded mb-3"
                      required
                    />
                    <label className="font-semibold">Position (RU)</label>
                    <input
                      type="text"
                      onChange={(e) => setPositionRu(e.target.value)}
                      value={positionRu}
                      className="w-full border border-gray-400 p-2 rounded mb-3"
                      required
                    />
                    <label className="font-semibold">Position (DE)</label>
                    <input
                      type="text"
                      onChange={(e) => setPositionDe(e.target.value)}
                      value={positionDe}
                      className="w-full border border-gray-400 p-2 rounded mb-3"
                      required
                    />
                    <div className="mt-4 flex justify-end space-x-2">
                      <button
                        type="submit"
                        className="bg-green-500 px-4 py-2 text-white rounded hover:bg-green-600"
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
                        onClick={closeModal}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/* Edit Modal */}
      <Transition appear show={editModalOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={() => setEditModalOpen(false)}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div className="fixed inset-0 bg-black/50 bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-3xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-xl font-semibold leading-6 text-gray-900"
                  >
                    Edit Contact
                  </Dialog.Title>
                  <form className="mt-4 flex flex-col" onSubmit={updateTeam}>
                    <label className="font-semibold">Image</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setImage(file); // File
                          setImagePreview(URL.createObjectURL(file)); // string
                        }
                      }}
                    />

                    {imagePreview && (
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-[50%] object-cover rounded"
                      />
                    )}

                    <label className="font-semibold">Full Name</label>
                    <input
                      type="text"
                      onChange={(e) => setFullName(e.target.value)}
                      value={fullName}
                      className="w-full border border-gray-400 p-2 rounded mb-3"
                      required
                    />
                    <label className="font-semibold">Position (EN)</label>
                    <input
                      type="text"
                      onChange={(e) => setPositionEn(e.target.value)}
                      value={positionEn}
                      className="w-full border border-gray-400 p-2 rounded mb-3"
                      required
                    />
                    <label className="font-semibold">Position (RU)</label>
                    <input
                      type="text"
                      onChange={(e) => setPositionRu(e.target.value)}
                      value={positionRu}
                      className="w-full border border-gray-400 p-2 rounded mb-3"
                      required
                    />
                    <label className="font-semibold">Position (DE)</label>
                    <input
                      type="text"
                      onChange={(e) => setPositionDe(e.target.value)}
                      value={positionDe}
                      className="w-full border border-gray-400 p-2 rounded mb-3"
                      required
                    />
                    <div className="mt-4 flex justify-end space-x-2">
                      <button
                        type="submit"
                        className="bg-green-500 px-4 py-2 text-white rounded hover:bg-green-600"
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
                        onClick={closeModal}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      <ToastContainer />
    </div>
  );
};

export default TeamPage;
