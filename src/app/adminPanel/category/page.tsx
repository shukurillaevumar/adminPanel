"use client";
import { Dialog, Transition } from "@headlessui/react";
import React, { useEffect, useState, Fragment } from "react";
import { toast, ToastContainer } from "react-toastify";

type Category = {
  id: number;
  name_en: string;
  name_ru: string;
  name_de: string;
};

const CategoryPage: React.FC = () => {
  const [data, setData] = useState<Category[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editCategory, setEditCategory] = useState<Category | null>(null);

  const [token, setToken] = useState<string | null>(null);
  const [nameEn, setNameEn] = useState("");
  const [nameRu, setNameRu] = useState("");
  const [nameDe, setNameDe] = useState("");
  const [clickId, setClickId] = useState<number | null>(null);

  useEffect(() => {
    const accessToken = localStorage.getItem("access_token");
    setToken(accessToken);
  }, []);

  const getCategory = () => {
    fetch("https://back.ifly.com.uz/api/category")
      .then((response) => response.json())
      .then((item) => setData(item?.data));
  };

  useEffect(() => {
    getCategory();
  }, []);

  const createCategory = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    fetch("https://back.ifly.com.uz/api/category", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name_en: nameEn,
        name_ru: nameRu,
        name_de: nameDe,
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

  const updateCategory = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    fetch(`https://back.ifly.com.uz/api/category/${clickId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name_en: nameEn,
        name_ru: nameRu,
        name_de: nameDe,
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

  const deleteCategory = (id: number) => {
    fetch(`https://back.ifly.com.uz/api/category/${id}`, {
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
    setNameEn("");
    setNameRu("");
    setNameDe("");
  }

  function closeModal() {
    setIsOpen(false);
  }

  useEffect(() => {
    if (editCategory) {
      setNameEn(editCategory.name_en);
      setNameRu(editCategory.name_ru);
      setNameDe(editCategory.name_de);
    }
  }, [editCategory]);

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Category</h2>
        <button
          onClick={openModal}
          className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded cursor-pointer"
        >
          Add Category
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 rounded">
          <thead className="bg-gray-200">
            <tr>
              <th className="py-2 px-4 border">№</th>
              <th className="py-2 px-4 border">Title ENG</th>
              <th className="py-2 px-4 border">Title RU</th>
              <th className="py-2 px-4 border">Title DE</th>
              <th className="py-2 px-4 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data?.map((element) => (
              <tr key={element.id} className="text-center">
                <td className="py-2 px-4 border">{element.id}</td>
                <td className="py-2 px-4 border">{element.name_en}</td>
                <td className="py-2 px-4 border">{element.name_ru}</td>
                <td className="py-2 px-4 border">{element.name_de}</td>
                <td className="py-2 px-4 border space-x-2">
                  <button
                    onClick={() => {
                      setEditCategory(element);
                      setEditModalOpen(true);
                      setClickId(element?.id);
                    }}
                    className="bg-yellow-400 hover:bg-yellow-500 text-white py-1 px-3 rounded cursor-pointer"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteCategory(element.id)}
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
                    Add New Category
                  </Dialog.Title>
                  <form className="mt-4" onSubmit={createCategory}>
                    <label className="font-semibold">Category Name (EN)</label>
                    <input
                      type="text"
                      onChange={(e) => setNameEn(e.target.value)}
                      value={nameEn}
                      className="w-full border border-gray-400 p-2 rounded mb-3"
                      required
                    />
                    <label className="font-semibold">Category Name (RU)</label>
                    <input
                      type="text"
                      onChange={(e) => setNameRu(e.target.value)}
                      value={nameRu}
                      className="w-full border border-gray-400 p-2 rounded mb-3"
                      required
                    />
                    <label className="font-semibold">Category Name (DE)</label>
                    <input
                      type="text"
                      onChange={(e) => setNameDe(e.target.value)}
                      value={nameDe}
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
                    Edit Category
                  </Dialog.Title>
                  <form className="mt-4" onSubmit={updateCategory}>
                    <label className="font-semibold">Category Name (EN)</label>
                    <input
                      type="text"
                      onChange={(e) => setNameEn(e.target.value)}
                      value={nameEn}
                      className="w-full border border-gray-400 p-2 rounded mb-3"
                      required
                    />
                    <label className="font-semibold">Category Name (RU)</label>
                    <input
                      type="text"
                      onChange={(e) => setNameRu(e.target.value)}
                      value={nameRu}
                      className="w-full border border-gray-400 p-2 rounded mb-3"
                      required
                    />
                    <label className="font-semibold">Category Name (DE)</label>
                    <input
                      type="text"
                      onChange={(e) => setNameDe(e.target.value)}
                      value={nameDe}
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
                        onClick={() => setEditModalOpen(false)}
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

export default CategoryPage;
