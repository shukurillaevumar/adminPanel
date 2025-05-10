"use client";
import { Dialog, Transition } from "@headlessui/react";
import React, { useEffect, useState, Fragment } from "react";
import { toast, ToastContainer } from "react-toastify";
import noData from "../../../../public/noData.png";
import Image from "next/image";

type Faq = {
  id: number;
  phone_number: number;
  email: string;
  address_en: string;
  address_ru: string;
  address_de: string;
};

const ContactPage: React.FC = () => {
  const [data, setData] = useState<Faq[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editContact, setEditContact] = useState<Faq | null>(null);

  const [token, setToken] = useState<string | null>(null);
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [email, setEmail] = useState("");
  const [addressEn, setAddressEn] = useState("");
  const [addressRu, setAddressRu] = useState("");
  const [addressDe, setAddressDe] = useState("");

  const [clickId, setClickId] = useState<number | null>(null);

  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    const accessToken = localStorage.getItem("access_token");
    setToken(accessToken);
  }, []);

  const getCategory = () => {
    setLoadingData(true);

    fetch("https://testaoron.limsa.uz/api/contact")
      .then((response) => response.json())
      .then((item) => setData(item?.data));
    setLoadingData(false);
  };

  useEffect(() => {
    getCategory();
  }, []);

  const createContact = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const isPhoneValid = /^\+\d{1,15}$/.test(phoneNumber);
    if (!isPhoneValid) {
      toast.error(
        "Invalid phone number. It must start with '+' and be up to 16 characters."
      );
      return;
    }

    fetch("https://testaoron.limsa.uz/api/contact", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        phone_number: phoneNumber,
        email: email,
        address_en: addressEn,
        address_ru: addressRu,
        address_de: addressDe,
      }),
    })
      .then((res) => res.json())
      .then((item) => {
        if (item?.success) {
          toast.success("Successfully Added");
          getCategory();
        } else {
          toast.error("Failed to add");
        }
        closeModal();
      })
      .catch((err) => {
        console.error("Ошибка при создании категории:", err);
      });
  };

  const updateContact = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const isPhoneValid = /^\+\d{1,15}$/.test(phoneNumber);
    if (!isPhoneValid) {
      toast.error(
        "Invalid phone number. It must start with '+' and be up to 16 characters."
      );
      return;
    }

    fetch(`https://testaoron.limsa.uz/api/contact/${clickId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        phone_number: phoneNumber,
        email: email,
        address_en: addressEn,
        address_ru: addressRu,
        address_de: addressDe,
      }),
    })
      .then((res) => res.json())
      .then((item) => {
        if (item?.success) {
          toast.success("Successfully Updated");
          getCategory();
        } else {
          toast.error("Failed to update");
        }
        setEditModalOpen(false);
      })
      .catch((err) => console.error("Ошибка при обновлении категории:", err));
  };

  const deleteContact = (id: number) => {
    fetch(`https://testaoron.limsa.uz/api/contact/${id}`, {
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
          getCategory();
        } else {
          toast.error(elem?.message);
        }
      });
  };

  function openModal() {
    setIsOpen(true);
    setPhoneNumber("");
    setEmail("");
    setAddressEn("");
    setAddressRu("");
    setAddressDe("");
  }

  function closeModal() {
    setIsOpen(false);
  }

  useEffect(() => {
    if (editContact) {
      setPhoneNumber(String(editContact.phone_number));
      setEmail(editContact.email);
      setAddressEn(editContact.address_en);
      setAddressRu(editContact.address_ru);
      setAddressDe(editContact.address_de);
    }
  }, [editContact]);

  const preventNumbers = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (/\d/.test(e.key)) {
      e.preventDefault();
    }
  };

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
            <h2 className="text-xl font-bold">Contacts</h2>
            <button
              onClick={openModal}
              className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded cursor-pointer"
            >
              Add Contact
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200 rounded">
              <thead className="bg-gray-200">
                <tr>
                  <th className="py-2 px-4 border">№</th>
                  <th className="py-2 px-4 border">Phone Number</th>
                  <th className="py-2 px-4 border">Email</th>
                  <th className="py-2 px-4 border">Address (EN)</th>
                  <th className="py-2 px-4 border">Address (RU)</th>
                  <th className="py-2 px-4 border">Address (DE)</th>
                  <th className="py-2 px-4 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data && data.length > 0 ? (
                  data?.map((element) => (
                    <tr key={element.id} className="text-center">
                      <td className="py-2 px-4 border">{element.id}</td>
                      <td className="py-2 px-4 border">
                        {element.phone_number}
                      </td>
                      <td className="py-2 px-4 border">{element.email}</td>
                      <td className="py-2 px-4 border">{element.address_en}</td>
                      <td className="py-2 px-4 border">{element.address_ru}</td>
                      <td className="py-2 px-4 border">{element.address_de}</td>

                      <td className="py-2 px-4 border space-x-2">
                        <button
                          onClick={() => {
                            setEditContact(element);
                            setEditModalOpen(true);
                            setClickId(element?.id);
                          }}
                          className="bg-yellow-400 hover:bg-yellow-500 text-white py-1 px-3 rounded cursor-pointer"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteContact(element.id)}
                          className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded cursor-pointer"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={10} className="py-6 px-4 text-center">
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
                    Add New Contact
                  </Dialog.Title>
                  <form className="mt-4" onSubmit={createContact}>
                    <label className="font-semibold">Phone Number</label>
                    <input
                      type="text"
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      value={phoneNumber}
                      pattern="^\+\d{1,15}$"
                      maxLength={16}
                      className="w-full border border-gray-400 p-2 rounded mb-3"
                      required
                    />

                    <label className="font-semibold">Email</label>
                    <input
                      type="email"
                      onChange={(e) => setEmail(e.target.value)}
                      value={email}
                      className="w-full border border-gray-400 p-2 rounded mb-3"
                      required
                    />
                    <label className="font-semibold">Address (EN)</label>
                    <input
                      type="text"
                      onChange={(e) => setAddressEn(e.target.value)}
                      value={addressEn}
                      onKeyDown={preventNumbers}
                      className="w-full border border-gray-400 p-2 rounded mb-3"
                      required
                    />
                    <label className="font-semibold">Address (RU)</label>
                    <input
                      type="text"
                      onChange={(e) => setAddressRu(e.target.value)}
                      value={addressRu}
                      onKeyDown={preventNumbers}
                      className="w-full border border-gray-400 p-2 rounded mb-3"
                      required
                    />
                    <label className="font-semibold">Address (DE)</label>
                    <input
                      type="text"
                      onChange={(e) => setAddressDe(e.target.value)}
                      value={addressDe}
                      onKeyDown={preventNumbers}
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
                  <form className="mt-4" onSubmit={updateContact}>
                    <label className="font-semibold">Phone Number</label>
                    <input
                      type="text"
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      value={phoneNumber}
                      pattern="^\+\d{1,15}$"
                      maxLength={16}
                      className="w-full border border-gray-400 p-2 rounded mb-3"
                      required
                    />

                    <label className="font-semibold">Email</label>
                    <input
                      type="email"
                      onChange={(e) => setEmail(e.target.value)}
                      value={email}
                      className="w-full border border-gray-400 p-2 rounded mb-3"
                      required
                    />
                    <label className="font-semibold">Address (EN)</label>
                    <input
                      type="text"
                      onChange={(e) => setAddressEn(e.target.value)}
                      value={addressEn}
                      onKeyDown={preventNumbers}
                      className="w-full border border-gray-400 p-2 rounded mb-3"
                      required
                    />
                    <label className="font-semibold">Address (RU)</label>
                    <input
                      type="text"
                      onChange={(e) => setAddressRu(e.target.value)}
                      value={addressRu}
                      onKeyDown={preventNumbers}
                      className="w-full border border-gray-400 p-2 rounded mb-3"
                      required
                    />
                    <label className="font-semibold">Address (DE)</label>
                    <input
                      type="text"
                      onChange={(e) => setAddressDe(e.target.value)}
                      value={addressDe}
                      onKeyDown={preventNumbers}
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

export default ContactPage;
