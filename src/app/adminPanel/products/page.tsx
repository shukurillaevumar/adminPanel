"use client";
import { Dialog, Transition } from "@headlessui/react";
import React, { useEffect, useState, Fragment } from "react";
import { toast, ToastContainer } from "react-toastify";

type Products = {
  id: number;
  image: any;
  title: string;
  description: string;
  price: string;
  category: string;
  colors: string;
  sizes: number;
  discount: number;
  materials: string;
};

const ProductsPage: React.FC = () => {
  const [data, setData] = useState<Products[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editProduct, setEditProduct] = useState<Products | null>(null);

  const [imagePreview, setImagePreview] = useState<string>("");

  const [token, setToken] = useState<string | null>(null);
  const [image, setImage] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [colors, setColors] = useState("");
  const [sizes, setSizes] = useState("");
  const [discount, setDiscount] = useState("");
  const [materials, setMaterials] = useState("");

  const [clickId, setClickId] = useState<number | null>(null);

  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    const accessToken = localStorage.getItem("access_token");
    setToken(accessToken);
  }, []);

  const getProducts = () => {
    console.log(data);
    setLoadingData(true);

    fetch("https://back.ifly.com.uz/api/product")
      .then((response) => response.json())
      .then((item) => {
        setData(item?.data?.products);
        setLoadingData(false);
        console.log(item.data.products);
      })
      .catch((err) => {
        console.error("Ошибка при получении данных:", err);
        setLoadingData(false); // даже при ошибке убираем загрузку
      });
  };

  useEffect(() => {
    getProducts();
  }, []);

  const createProduct = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData();
    if (image) formData.append("images", image);
    formData.append("title_en", title);
    formData.append("description_en", description);
    formData.append("price", String(Number(price)));
    formData.append("category_id", category);
    formData.append("colors_id", colors);
    formData.append("sizes_id", String(Number(sizes)));
    formData.append("discount", String(Number(discount)));
    formData.append("materials", materials);

    if (!token) {
      toast.error("Token not found. Please log in.");
      return;
    }

    fetch("https://back.ifly.com.uz/api/product", {
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
          getProducts();
        } else {
          toast.error("Failed to add");
        }
        closeModal();
      })
      .catch((err) => console.error("Ошибка при создании:", err));
  };

  const updateProduct = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData();
    if (image) formData.append("images", image);
    formData.append("title_en", title);
    formData.append("description_en", description);
    formData.append("price", String(Number(price)));
    formData.append("category_id", category);
    formData.append("colors_id", colors);
    formData.append("sizes_id", String(Number(sizes)));
    formData.append("discount", String(Number(discount)));
    formData.append("materials", materials);

    if (!token) {
      toast.error("Token not found. Please log in.");
      return;
    }

    fetch(`https://back.ifly.com.uz/api/product/${clickId}`, {
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
          getProducts();
        } else {
          toast.error("Failed to update");
        }
        setEditModalOpen(false);
      })
      .catch((err) => console.error("Ошибка при обновлении:", err));
  };

  const deleteProduct = (id: number) => {
    fetch(`https://back.ifly.com.uz/api/product/${id}`, {
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
          getProducts();
        } else {
          toast.error(elem?.message);
        }
      });
  };

  function openModal() {
    setIsOpen(true);
    setImage(null);
    setImagePreview("");
    setTitle("");
    setDescription("");
    setPrice("");
    setCategory("");
    setColors("");
    setSizes("");
    setDiscount("");
    setMaterials("");
  }

  function closeModal() {
    setIsOpen(false);
  }

  useEffect(() => {
    if (editProduct) {
      setImagePreview(editProduct.image);
      setImage(null);
      setTitle(editProduct.title);
      setDescription(editProduct.description);
      setPrice(editProduct.price);
      setCategory(editProduct.category);
      setSizes(String(editProduct.sizes));
      setColors(editProduct.colors);
      setMaterials(editProduct.materials);
      setDiscount(String(editProduct.discount));
    }
  }, [editProduct]);

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
            <h2 className="text-xl font-bold">Products</h2>
            <button
              onClick={openModal}
              className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded cursor-pointer"
            >
              Add Product
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200 rounded">
              <thead className="bg-gray-200">
                <tr>
                  <th className="py-2 px-4 border">№</th>
                  <th className="py-2 px-4 border">Image</th>
                  <th className="py-2 px-4 border">Title</th>
                  <th className="py-2 px-4 border">Description</th>
                  <th className="py-2 px-4 border">Price</th>
                  <th className="py-2 px-4 border">Category</th>
                  <th className="py-2 px-4 border">Colors</th>
                  <th className="py-2 px-4 border">Sizes</th>
                  <th className="py-2 px-4 border">Discount</th>
                  <th className="py-2 px-4 border">Materials</th>
                  <th className="py-2 px-4 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data?.map((element) => (
                  <tr key={element.id} className="text-center">
                    <td className="py-2 px-4 border">{element.id}</td>
                    <td className="py-2 px-4 border">
                      {element.image && (
                        <img
                          src={
                            typeof element.image === "string"
                              ? `https://back.ifly.com.uz/${element.image}`
                              : URL.createObjectURL(element.image)
                          }
                          alt="image"
                          className="rounded w-full h-40 object-cover"
                        />
                      )}
                    </td>
                    <td className="py-2 px-4 border">{element.title}</td>
                    <td className="py-2 px-4 border">{element.description}</td>
                    <td className="py-2 px-4 border">{element.price}</td>
                    <td className="py-2 px-4 border">{element.category}</td>
                    <td className="py-2 px-4 border">
                      {Array.isArray(element.colors)
                        ? element.colors.join(", ")
                        : element.colors}
                    </td>
                    <td className="py-2 px-4 border">
                      {Array.isArray(element.sizes)
                        ? element.sizes.join(", ")
                        : element.sizes}
                    </td>
                    <td className="py-2 px-4 border">{element.discount}</td>
                    <td className="py-2 px-4 border">
                      {Array.isArray(element.materials)
                        ? element.materials.join(", ")
                        : element.materials}
                    </td>
                    <td className="py-2 px-4 border space-x-2">
                      <button
                        onClick={() => {
                          setEditProduct(element);
                          setEditModalOpen(true);
                          setClickId(element.id);
                        }}
                        className="bg-yellow-400 hover:bg-yellow-500 text-white py-1 px-3 rounded cursor-pointer"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteProduct(element.id)}
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
                    Add New Product
                  </Dialog.Title>
                  <form className="mt-4 flex flex-col" onSubmit={createProduct}>
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
                    <label className="font-semibold">Title</label>
                    <input
                      type="text"
                      onChange={(e) => setTitle(e.target.value)}
                      value={title}
                      className="w-full border border-gray-400 p-2 rounded mb-3"
                      required
                    />
                    <label className="font-semibold">Description</label>
                    <input
                      type="text"
                      onChange={(e) => setDescription(e.target.value)}
                      value={description}
                      className="w-full border border-gray-400 p-2 rounded mb-3"
                      required
                    />
                    <label className="font-semibold">Price</label>
                    <input
                      type="number"
                      onChange={(e) => setPrice(e.target.value)}
                      value={price}
                      className="w-full border border-gray-400 p-2 rounded mb-3"
                      required
                    />
                    <label className="font-semibold">Category</label>
                    <input
                      type="text"
                      onChange={(e) => setCategory(e.target.value)}
                      value={category}
                      className="w-full border border-gray-400 p-2 rounded mb-3"
                      required
                    />
                    <label className="font-semibold">Colors</label>
                    <input
                      type="text"
                      onChange={(e) => setColors(e.target.value)}
                      value={colors}
                      className="w-full border border-gray-400 p-2 rounded mb-3"
                      required
                    />
                    <label className="font-semibold">Sizes</label>
                    <input
                      type="number"
                      onChange={(e) => setSizes(e.target.value)}
                      value={sizes}
                      className="w-full border border-gray-400 p-2 rounded mb-3"
                      required
                    />
                    <label className="font-semibold">Discount</label>
                    <input
                      type="text"
                      onChange={(e) => setDiscount(e.target.value)}
                      value={discount}
                      className="w-full border border-gray-400 p-2 rounded mb-3"
                      required
                    />
                    <label className="font-semibold">Materials</label>
                    <input
                      type="text"
                      onChange={(e) => setMaterials(e.target.value)}
                      value={materials}
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
                    Edit Product
                  </Dialog.Title>
                  <form className="mt-4 flex flex-col" onSubmit={updateProduct}>
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
                    <label className="font-semibold">Title</label>
                    <input
                      type="text"
                      onChange={(e) => setTitle(e.target.value)}
                      value={title}
                      className="w-full border border-gray-400 p-2 rounded mb-3"
                      required
                    />
                    <label className="font-semibold">Description</label>
                    <input
                      type="text"
                      onChange={(e) => setDescription(e.target.value)}
                      value={description}
                      className="w-full border border-gray-400 p-2 rounded mb-3"
                      required
                    />
                    <label className="font-semibold">Price</label>
                    <input
                      type="number"
                      onChange={(e) => setPrice(e.target.value)}
                      value={price}
                      className="w-full border border-gray-400 p-2 rounded mb-3"
                      required
                    />
                    <label className="font-semibold">Category</label>
                    <input
                      type="text"
                      onChange={(e) => setCategory(e.target.value)}
                      value={category}
                      className="w-full border border-gray-400 p-2 rounded mb-3"
                      required
                    />
                    <label className="font-semibold">Colors</label>
                    <input
                      type="text"
                      onChange={(e) => setColors(e.target.value)}
                      value={colors}
                      className="w-full border border-gray-400 p-2 rounded mb-3"
                      required
                    />
                    <label className="font-semibold">Sizes</label>
                    <input
                      type="number"
                      onChange={(e) => setSizes(e.target.value)}
                      value={sizes}
                      className="w-full border border-gray-400 p-2 rounded mb-3"
                      required
                    />
                    <label className="font-semibold">Discount</label>
                    <input
                      type="text"
                      onChange={(e) => setDiscount(e.target.value)}
                      value={discount}
                      className="w-full border border-gray-400 p-2 rounded mb-3"
                      required
                    />
                    <label className="font-semibold">Materials</label>
                    <input
                      type="text"
                      onChange={(e) => setMaterials(e.target.value)}
                      value={materials}
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

export default ProductsPage;
