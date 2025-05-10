"use client";
import { Dialog, Transition } from "@headlessui/react";
import React, { useEffect, useState, Fragment } from "react";
import { toast, ToastContainer } from "react-toastify";
import { ImageModal } from "@/app/components/ImageModal";

type News = {
  id: number;
  image: any;
  title_en: string;
  title_ru: string;
  title_de: string;
  description_en: string;
  description_ru: string;
  description_de: string;
};

const NewsPage: React.FC = () => {
  const [data, setData] = useState<News[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editTeam, setEditTeam] = useState<News | null>(null);

  const [imageModal, setImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");

  const [imagePreview, setImagePreview] = useState<string>("");

  const [token, setToken] = useState<string | null>(null);
  const [image, setImage] = useState<File | null>(null);
  const [title_en, setTitleEn] = useState("");
  const [title_ru, setTitleRu] = useState("");
  const [title_de, setTitleDe] = useState("");
  const [description_en, setDescriptionEn] = useState("");
  const [description_ru, setDescriptionRu] = useState("");
  const [description_de, setDescriptionDe] = useState("");
  const [clickId, setClickId] = useState<number | null>(null);

  const [loadingData, setLoadingData] = useState(true);
  console.log(data);

  useEffect(() => {
    const accessToken = localStorage.getItem("access_token");
    setToken(accessToken);
  }, []);

  const getTeam = () => {
    setLoadingData(true);

    fetch("https://testaoron.limsa.uz/api/news")
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
    formData.append("title_en", title_en);
    formData.append("title_ru", title_ru);
    formData.append("title_de", title_de);
    formData.append("description_en", description_en);
    formData.append("description_ru", description_ru);
    formData.append("description_de", description_de);

    fetch("https://testaoron.limsa.uz/api/news", {
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

  const updateNews = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData();
    if (image) formData.append("file", image);
    formData.append("title_en", title_en);
    formData.append("title_ru", title_ru);
    formData.append("title_de", title_de);
    formData.append("description_en", description_en);
    formData.append("description_ru", description_ru);
    formData.append("description_de", description_de);

    fetch(`https://testaoron.limsa.uz/api/news/${clickId}`, {
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

  const deleteNews = (id: number) => {
    fetch(`https://testaoron.limsa.uz/api/news/${id}`, {
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
    setTitleEn("");
    setTitleRu("");
    setTitleDe("");
    setDescriptionEn("");
    setDescriptionRu("");
    setDescriptionDe("");
  }

  function closeModal() {
    setIsOpen(false);
  }

  useEffect(() => {
    if (editTeam) {
      setImagePreview(editTeam.image);
      setImage(null);
      setTitleEn(editTeam.title_en);
      setTitleRu(editTeam.title_ru);
      setTitleDe(editTeam.title_de);
      setDescriptionRu(editTeam.description_en);
      setDescriptionRu(editTeam.description_ru);
      setDescriptionRu(editTeam.description_de);
    }
  }, [editTeam]);

  const openImageModal = (url: string) => {
    setSelectedImage(url);
    setImageModal(true);
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
            <h2 className="text-xl font-bold">News</h2>
            <button
              onClick={openModal}
              className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded cursor-pointer"
            >
              Add News
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200 rounded">
              <thead className="bg-gray-200">
                <tr>
                  <th className="py-2 px-4 border">№</th>
                  <th className="py-2 px-4 border">Image</th>
                  <th className="py-2 px-4 border">Title (EN)</th>
                  <th className="py-2 px-4 border">Title (RU)</th>
                  <th className="py-2 px-4 border">Title (DE)</th>
                  <th className="py-2 px-4 border">Description (EN)</th>
                  <th className="py-2 px-4 border">Description (RU)</th>
                  <th className="py-2 px-4 border">Description (DE)</th>
                  <th className="py-2 px-4 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data?.map((element) => (
                  <tr key={element.id} className="text-center">
                    <td className="py-2 px-4 border">{element.id}</td>
                    <td className="py-2 px-4 border">
                      {element.image ? (
                        <img
                          src={`https://testaoron.limsa.uz/${element.image}`}
                          alt={"Изображение товара"}
                          className="rounded w-full h-40 object-cover cursor-pointer hover:opacity-80"
                          onClick={() =>
                            openImageModal(
                              `https://testaoron.limsa.uz/${element.image}`
                            )
                          }
                        />
                      ) : (
                        <div className="w-full h-40 bg-gray-100 flex items-center justify-center text-gray-400 italic">
                          Нет изображения
                        </div>
                      )}
                    </td>
                    <td className="py-2 px-4 border">{element.title_en}</td>
                    <td className="py-2 px-4 border">{element.title_ru}</td>
                    <td className="py-2 px-4 border">{element.title_de}</td>
                    <td className="py-2 px-4 border">
                      {element.description_en}
                    </td>
                    <td className="py-2 px-4 border">
                      {element.description_ru}
                    </td>
                    <td className="py-2 px-4 border">
                      {element.description_de}
                    </td>
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
                        onClick={() => deleteNews(element.id)}
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

      <ImageModal
        isOpen={imageModal}
        onClose={() => setImageModal(false)}
        imageUrl={selectedImage}
      />

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
                    Add New News
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
                    <label className="font-semibold">Title (EN)</label>
                    <input
                      type="text"
                      onChange={(e) => setTitleEn(e.target.value)}
                      value={title_en}
                      className="w-full border border-gray-400 p-2 rounded mb-3"
                      required
                    />
                    <label className="font-semibold">Title (RU)</label>
                    <input
                      type="text"
                      onChange={(e) => setTitleRu(e.target.value)}
                      value={title_ru}
                      className="w-full border border-gray-400 p-2 rounded mb-3"
                      required
                    />
                    <label className="font-semibold">Title (DE)</label>
                    <input
                      type="text"
                      onChange={(e) => setTitleDe(e.target.value)}
                      value={title_de}
                      className="w-full border border-gray-400 p-2 rounded mb-3"
                      required
                    />
                    <label className="font-semibold">Desctiption (EN)</label>
                    <input
                      type="text"
                      onChange={(e) => setDescriptionEn(e.target.value)}
                      value={description_en}
                      className="w-full border border-gray-400 p-2 rounded mb-3"
                      required
                    />
                    <label className="font-semibold">Desctiption (RU)</label>
                    <input
                      type="text"
                      onChange={(e) => setDescriptionRu(e.target.value)}
                      value={description_ru}
                      className="w-full border border-gray-400 p-2 rounded mb-3"
                      required
                    />
                    <label className="font-semibold">Desctiption (DE)</label>
                    <input
                      type="text"
                      onChange={(e) => setDescriptionDe(e.target.value)}
                      value={description_de}
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
                  <form className="mt-4 flex flex-col" onSubmit={updateNews}>
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
                    <label className="font-semibold">Title (EN)</label>
                    <input
                      type="text"
                      onChange={(e) => setTitleEn(e.target.value)}
                      value={title_en}
                      className="w-full border border-gray-400 p-2 rounded mb-3"
                      required
                    />
                    <label className="font-semibold">Title (RU)</label>
                    <input
                      type="text"
                      onChange={(e) => setTitleRu(e.target.value)}
                      value={title_ru}
                      className="w-full border border-gray-400 p-2 rounded mb-3"
                      required
                    />
                    <label className="font-semibold">Title (DE)</label>
                    <input
                      type="text"
                      onChange={(e) => setTitleDe(e.target.value)}
                      value={title_de}
                      className="w-full border border-gray-400 p-2 rounded mb-3"
                      required
                    />
                    <label className="font-semibold">Desctiption (EN)</label>
                    <input
                      type="text"
                      onChange={(e) => setDescriptionEn(e.target.value)}
                      value={description_en}
                      className="w-full border border-gray-400 p-2 rounded mb-3"
                      required
                    />
                    <label className="font-semibold">Desctiption (RU)</label>
                    <input
                      type="text"
                      onChange={(e) => setDescriptionRu(e.target.value)}
                      value={description_ru}
                      className="w-full border border-gray-400 p-2 rounded mb-3"
                      required
                    />
                    <label className="font-semibold">Desctiption (DE)</label>
                    <input
                      type="text"
                      onChange={(e) => setDescriptionDe(e.target.value)}
                      value={description_de}
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

export default NewsPage;
