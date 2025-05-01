"use client";

import { Dialog, Transition } from "@headlessui/react";
import React, { useEffect, useState, Fragment } from "react";
import { toast, ToastContainer } from "react-toastify";

type Discounts = {
  id: number;
  discount: number;
  createdAt: string;
  updatedAt: string;
  started_at: string;
  finished_at: string;
  status: boolean;
};

const DiscountsPage: React.FC = () => {
  const [data, setData] = useState<Discounts[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editDiscount, setEditDiscount] = useState<Discounts | null>(null);

  const [token, setToken] = useState<string | null>(null);
  const [discount, setDiscount] = useState<string>("");
  const [started_at, setStartedAt] = useState("");
  const [finished_at, setFinishiedAt] = useState("");
  const [status, setStatus] = useState<boolean | string>();
  const [clickId, setClickId] = useState<number | null>(null);

  useEffect(() => {
    const accessToken = localStorage.getItem("access_token");
    setToken(accessToken);
  }, []);

  const getDiscounts = () => {
    fetch("https://back.ifly.com.uz/api/discount")
      .then((response) => response.json())
      .then((item) => setData(item?.data));
  };

  useEffect(() => {
    getDiscounts();
  }, []);

  function openModal() {
    setIsOpen(true);
    setDiscount("");
    setStartedAt("");
    setFinishiedAt("");
    setStatus(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

  const createDiscount = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    fetch("https://back.ifly.com.uz/api/discount", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        discount: Number(discount),
        started_at: started_at,
        finished_at: finished_at,
        status: status,
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

  const updateDiscount = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    fetch(`https://back.ifly.com.uz/api/discount/${clickId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        discount: Number(discount),
        started_at: started_at,
        finished_at: finished_at,
        status: status,
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

  const deleteDiscount = (id: number) => {
    fetch(`https://back.ifly.com.uz/api/discount/${id}`, {
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
    if (editDiscount) {
      setDiscount(String(editDiscount.discount));
      setStartedAt(editDiscount.started_at);
      setFinishiedAt(editDiscount.finished_at);
      setStatus(editDiscount.status);
    }
  }, [editDiscount]);

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Discount</h2>
        <button
          onClick={openModal}
          className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded cursor-pointer"
        >
          Add Discount
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 rounded">
          <thead className="bg-gray-200">
            <tr>
              <th className="py-2 px-4 border">№</th>
              <th className="py-2 px-4 border">Discount (%)</th>
              <th className="py-2 px-4 border">Created Date</th>
              <th className="py-2 px-4 border">Finished Date</th>
              <th className="py-2 px-4 border">Status</th>
              <th className="py-2 px-4 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data?.map((element) => (
              <tr key={element.id} className="text-center">
                <td className="py-2 px-4 border">{element.id}</td>
                <td className="py-2 px-4 border">{element.discount}</td>
                <td className="py-2 px-4 border">{element.started_at}</td>
                <td className="py-2 px-4 border">{element.finished_at}</td>
                <td className="py-2 px-4 border">
                  <span
                    className={`px-2 py-1 rounded text-white ${
                      element.status ? "bg-green-500" : "bg-red-500"
                    }`}
                  >
                    {element.status ? "Active" : "Inactive"}
                  </span>
                </td>

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
                    onClick={() => deleteDiscount(element.id)}
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
                    Add New Discount
                  </Dialog.Title>
                  <form className="mt-4" onSubmit={createDiscount}>
                    <label className="font-semibold">Discount(%)</label>
                    <input
                      type="number"
                      onChange={(e) => setDiscount(e.target.value)}
                      value={discount}
                      className="w-full border border-gray-400 p-2 rounded mb-3"
                      required
                    />
                    <label className="font-semibold">Start Date</label>
                    <input
                      type="date"
                      onChange={(e) => setStartedAt(e.target.value)}
                      value={started_at}
                      className="w-full border border-gray-400 p-2 rounded mb-3"
                      required
                    />
                    <label className="font-semibold">End Date</label>
                    <input
                      type="date"
                      onChange={(e) => setFinishiedAt(e.target.value)}
                      value={finished_at}
                      className="w-full border border-gray-400 p-2 rounded mb-3"
                      required
                    />
                    <label className="font-semibold">Active</label>
                    <input
                      type="checkbox"
                      checked={!!status}
                      onChange={(e) => setStatus(e.target.checked)}
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
                    Edit Category
                  </Dialog.Title>
                  <form className="mt-4" onSubmit={updateDiscount}>
                    <label className="font-semibold">Discount(%)</label>
                    <input
                      type="number"
                      onChange={(e) => setDiscount(e.target.value)}
                      value={discount}
                      className="w-full border border-gray-400 p-2 rounded mb-3"
                      required
                    />
                    <label className="font-semibold">Start Date</label>
                    <input
                      type="date"
                      onChange={(e) => setStartedAt(e.target.value)}
                      value={started_at}
                      className="w-full border border-gray-400 p-2 rounded mb-3"
                      required
                    />
                    <label className="font-semibold">End Date</label>
                    <input
                      type="date"
                      onChange={(e) => setFinishiedAt(e.target.value)}
                      value={finished_at}
                      className="w-full border border-gray-400 p-2 rounded mb-3"
                      required
                    />
                    <label className="font-semibold">Active</label>
                    <input
                      type="checkbox"
                      checked={!!status}
                      onChange={(e) => setStatus(e.target.checked)}
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
export default DiscountsPage;
