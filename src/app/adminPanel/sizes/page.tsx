"use client";

import { Dialog, Transition } from "@headlessui/react";
import React, { useEffect, useState, Fragment } from "react";
import { toast, ToastContainer } from "react-toastify";
import noData from "../../../../public/noData.png";
import Image from "next/image";

type Sizes = {
  id: number;
  size: number;
};

const SizePage: React.FC = () => {
  const [data, setData] = useState<Sizes[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editSize, setEditDiscount] = useState<Sizes | null>(null);

  const [token, setToken] = useState<string | null>(null);
  const [size, setSize] = useState("");

  const [clickId, setClickId] = useState<number | null>(null);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    const accessToken = localStorage.getItem("access_token");
    setToken(accessToken);
  }, []);

  const getDiscounts = () => {
    setLoadingData(true);
    fetch("https://testaoron.limsa.uz/api/sizes")
      .then((response) => response.json())
      .then((item) => setData(item?.data));
    setLoadingData(false);
  };

  useEffect(() => {
    getDiscounts();
  }, []);

  function openModal() {
    setIsOpen(true);
    setSize("");
  }

  function closeModal() {
    setIsOpen(false);
  }

  const createDiscount = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    fetch("https://testaoron.limsa.uz/api/sizes", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        size: size,
      }),
    })
      .then((res) => res.json())
      .then((item) => {
        if (item?.success) {
          toast.success("Successfully Added");
          getDiscounts();
        } else {
          toast.error("Failed to add");
        }
        closeModal();
      })
      .catch((err) => {
        console.error("Ошибка при создании дисконта:", err);
      });
  };

  const updateSize = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    fetch(`https://testaoron.limsa.uz/api/sizes/${clickId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        size: size,
      }),
    })
      .then((res) => res.json())
      .then((item) => {
        if (item?.success) {
          toast.success("Successfully Updated");
          getDiscounts();
        } else {
          toast.error("Failed to update");
        }
        setEditModalOpen(false);
      })
      .catch((err) => console.error("Ошибка при обновлении категории:", err));
  };

  const deleteSize = (id: number) => {
    fetch(`https://testaoron.limsa.uz/api/sizes/${id}`, {
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
          getDiscounts();
        } else {
          toast.error(elem?.message);
        }
      });
  };

  useEffect(() => {
    if (editSize) {
      setSize(String(editSize.size));
    }
  }, [editSize]);

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
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Sizes</h2>
            <button
              onClick={openModal}
              className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded cursor-pointer"
            >
              Add Size
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200 rounded">
              <thead className="bg-gray-200">
                <tr>
                  <th className="py-2 px-4 border">№</th>
                  <th className="py-2 px-4 border">Size</th>
                  <th className="py-2 px-4 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data && data.length > 0 ? (
                  data.map((element) => (
                    <tr key={element.id} className="text-center">
                      <td className="py-2 px-4 border">{element.id}</td>
                      <td className="py-2 px-4 border">{element.size}</td>

                      <td className="py-2 px-4 border space-x-2">
                        <button
                          onClick={() => {
                            setEditDiscount(element);
                            setEditModalOpen(true);
                            setClickId(element?.id);
                          }}
                          className="bg-yellow-400 hover:bg-yellow-500 text-white py-1 px-3 rounded cursor-pointer"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteSize(element.id)}
                          className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded cursor-pointer"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-6 px-4 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <Image
                          src={noData}
                          alt="No data"
                          className="w-48 h-48 mb-4"
                        />
                        <p className="text-gray-500 text-lg">
                          Данные отсутствуют
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
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
                    Add New Size
                  </Dialog.Title>
                  <form className="mt-4" onSubmit={createDiscount}>
                    <label className="font-semibold">Size</label>
                    <input
                      type="number"
                      onChange={(e) => setSize(e.target.value)}
                      value={size}
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
                    Edit Size
                  </Dialog.Title>
                  <form className="mt-4" onSubmit={updateSize}>
                    <label className="font-semibold">Sizes</label>
                    <input
                      type="number"
                      onChange={(e) => setSize(e.target.value)}
                      value={size}
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
export default SizePage;
