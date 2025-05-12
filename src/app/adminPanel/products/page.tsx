"use client";
import { ImageModal } from "@/app/components/ImageModal";
import { Dialog, Transition } from "@headlessui/react";
import React, { useEffect, useState, Fragment, ReactNode } from "react";
import { toast, ToastContainer } from "react-toastify";

type Products = {
  description_en: any;
  description_ru: any;
  description_de: any;

  title_en: any;
  title_ru: any;
  title_de: any;

  id: number;
  images: any;
  title: string;
  description: string;
  price: string;
  category: {
    name_en: string;
  };
  colors: any;
  min_sell: any;
  sizes: Array<{ size: string }>;
  discount: {
    discount: number;
  };
  materials: {
    [key: string]: number;
  };
};

const ProductsPage: React.FC = () => {
  const [data, setData] = useState<Products[]>([]);

  const [isOpen, setIsOpen] = useState(false);

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editProduct, setEditProduct] = useState<Products | null>(null);

  const [imageModal, setImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");

  const [imagePreview, setImagePreview] = useState<string>("");

  const [token, setToken] = useState<string | null>(null);
  const [image, setImage] = useState<File | null>(null);

  const [titleEn, setTitleEn] = useState("");
  const [titleRu, setTitleRu] = useState("");
  const [titleDe, setTitleDe] = useState("");

  const [descriptionEn, setDescriptionEn] = useState("");
  const [descriptionRu, setDescriptionRu] = useState("");
  const [descriptionDe, setDescriptionDe] = useState("");

  const [minSell, setMinSell] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [colors, setColors] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<number[]>([]);
  const [discount, setDiscount] = useState("");
  const [materials, setMaterials] = useState<{ [key: string]: number }>({});

  const [clickId, setClickId] = useState<number | null>(null);

  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    const accessToken = localStorage.getItem("access_token");
    setToken(accessToken);
  }, []);

  const getProducts = () => {
    setLoadingData(true);

    fetch("https://testaoron.limsa.uz/api/product")
      .then((response) => response.json())
      .then((item) => {
        setData(item?.data?.products);
        setLoadingData(false);
      })
      .catch((err) => {
        console.error("Ошибка при получении данных:", err);
        setLoadingData(false);
      });
  };

  useEffect(() => {
    getProducts();
  }, []);

  const createProduct = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData();
    if (image) formData.append("file", image);
    formData.append("title_en", titleEn);
    formData.append("description_en", descriptionEn);
    formData.append("price", String(Number(price)));
    formData.append("category_id", category);
    formData.append("colors_id", JSON.stringify(colors));
    formData.append("sizes_id[]", String(selectedSizes));
    formData.append("discount", String(Number(discount)));
    formData.append("materials", JSON.stringify(materials));

    if (!token) {
      toast.error("Token not found. Please log in.");
      return;
    }

    fetch("https://testaoron.limsa.uz/api/product", {
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
    if (image) formData.append("image", image);
    formData.append("title_en", titleEn);
    formData.append("description_en", descriptionEn);
    formData.append("price", String(Number(price)));
    formData.append("category_id", category);
    formData.append("colors_id", JSON.stringify(colors));
    formData.append("sizes_id[]", String(selectedSizes));
    formData.append("discount", String(Number(discount)));
    formData.append("materials", JSON.stringify(materials));

    if (!token) {
      toast.error("Token not found. Please log in.");
      return;
    }

    fetch(`https://testaoron.limsa.uz/api/product/${clickId}`, {
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
    fetch(`https://testaoron.limsa.uz/api/product/${id}`, {
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
    setTitleEn("");
    setTitleRu("");
    setTitleDe("");
    setDescriptionEn("");
    setDescriptionRu("");
    setDescriptionDe("");
    setMinSell("");
    setPrice("");
    setCategory("");
    setColors([]);
    setSelectedSizes([]);
    setDiscount("");
    setMaterials({});
  }

  function closeModal() {
    setIsOpen(false);
  }

  useEffect(() => {
    if (editProduct) {
      setImagePreview(editProduct.images);
      setImage(null);

      setTitleEn(editProduct.title_en);
      setTitleRu(editProduct.title_ru);
      setTitleDe(editProduct.title_de);

      setDescriptionEn(editProduct.description_en);
      setDescriptionRu(editProduct.description_ru);
      setDescriptionDe(editProduct.description_de);

      setMinSell(editProduct.min_sell);

      setPrice(editProduct.price);
      setCategory(editProduct.category.name_en);
      setSelectedSizes(
        editProduct.sizes.map((size) => parseInt(size.size, 10))
      );
      setColors(editProduct.colors);
      setMaterials(editProduct.materials);
      setDiscount(String(editProduct.discount?.discount || "—"));
    }
  }, [editProduct]);

  const openImageModal = (url: string) => {
    setSelectedImage(url);
    setImageModal(true);
  };

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;

    if (checked) {
      setColors((prev) => [...prev, value]);
    } else {
      setColors((prev) => prev.filter((color) => color !== value));
    }
  };

  const handleSizeChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    size: number
  ) => {
    if (e.target.checked) {
      setSelectedSizes((prev) => [...prev, size]);
    } else {
      setSelectedSizes((prev) => prev.filter((s) => s !== size));
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
                  <th className="py-2 px-4 border">Discount (%)</th>
                  <th className="py-2 px-4 border">Materials</th>
                  <th className="py-2 px-4 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data?.map((element, index) => (
                  <tr key={element.id} className="text-center">
                    <td className="py-2 px-4 border">{index + 1}</td>
                    <td className="py-2 px-4 border">
                      {element.images ? (
                        <img
                          src={`https://testaoron.limsa.uz/${element.images}`}
                          alt={"Изображение товара"}
                          className="rounded w-full h-40 object-cover cursor-pointer hover:opacity-80"
                          onClick={() =>
                            openImageModal(
                              `https://testaoron.limsa.uz/${element.images}`
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
                    <td className="py-2 px-4 border">
                      {element.description_en}
                    </td>
                    <td className="py-2 px-4 border">{element.price}</td>
                    <td className="py-2 px-4 border">
                      {element.category?.name_en}
                    </td>
                    <td className="py-2 px-4 border">
                      {element.colors?.[0]?.color_en ?? "—"}
                    </td>
                    {element.sizes.map((el: any, index: any) => (
                      <td className="py-2 px-4 border" key={index}>
                        {el.size}
                      </td>
                    ))}
                    <td className="py-2 px-4 border">
                      {element.discount?.discount || "—"}
                    </td>
                    <td className="py-2 px-4 border">
                      {element.materials &&
                      Object.keys(element.materials).length > 0 ? (
                        Object.entries(element.materials).map(
                          ([key, value]) => (
                            <div key={key}>
                              {key}: {value}
                            </div>
                          )
                        )
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
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
                <Dialog.Panel className="w-full max-w-3xl h-[90vh] transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-xl font-semibold leading-6 text-gray-900"
                  >
                    Add New Product
                  </Dialog.Title>
                  <form
                    className="flex flex-col space-y-3 overflow-y-auto h-[calc(90vh-3rem)] pr-2"
                    onSubmit={createProduct}
                  >
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
                    <label className="font-semibold">Product Title (EN)</label>
                    <input
                      type="text"
                      onChange={(e) => setTitleEn(e.target.value)}
                      value={titleEn}
                      className="w-full border border-gray-400 p-2 rounded mb-3"
                      required
                    />
                    <label className="font-semibold">Product Title (RU)</label>
                    <input
                      type="text"
                      onChange={(e) => setTitleRu(e.target.value)}
                      value={titleRu}
                      className="w-full border border-gray-400 p-2 rounded mb-3"
                      required
                    />
                    <label className="font-semibold">Product Title (DE)</label>
                    <input
                      type="text"
                      onChange={(e) => setTitleDe(e.target.value)}
                      value={titleDe}
                      className="w-full border border-gray-400 p-2 rounded mb-3"
                      required
                    />
                    <label className="font-semibold">
                      Product Description (EN)
                    </label>
                    <input
                      type="text"
                      onChange={(e) => setDescriptionEn(e.target.value)}
                      value={descriptionEn}
                      className="w-full border border-gray-400 p-2 rounded mb-3"
                      required
                    />
                    <label className="font-semibold">
                      Product Description (RU)
                    </label>
                    <input
                      type="text"
                      onChange={(e) => setDescriptionRu(e.target.value)}
                      value={descriptionRu}
                      className="w-full border border-gray-400 p-2 rounded mb-3"
                      required
                    />
                    <label className="font-semibold">
                      Product Description (DE)
                    </label>
                    <input
                      type="text"
                      onChange={(e) => setDescriptionDe(e.target.value)}
                      value={descriptionDe}
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
                    <label className="font-semibold">Minimum Sell</label>
                    <input
                      type="number"
                      onChange={(e) => setMinSell(e.target.value)}
                      value={minSell}
                      className="w-full border border-gray-400 p-2 rounded mb-3"
                      required
                    />
                    <label className="font-semibold">Category</label>
                    <select
                      onChange={(e) => setCategory(e.target.value)}
                      value={category}
                      className="w-full border border-gray-400 p-2 rounded mb-3"
                      required
                    >
                      <option value="" disabled>
                        Select
                      </option>
                      <option value="option1">Yozgi fasil</option>
                      <option value="option2">Qishgi fasil</option>
                    </select>
                    <label className="font-semibold">Colors</label>
                    <div className="flex gap-2 mb-3">
                      {["Red", "Green", "Blue", "Black"].map((color) => (
                        <label key={color} className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            value={color}
                            className="appearance-none w-5 h-5 border border-gray-400 rounded-full checked:bg-blue-500 checked:border-transparent focus:outline-none transition-all"
                            checked={colors.includes(color)}
                            onChange={handleColorChange}
                          />
                          {color}
                        </label>
                      ))}
                    </div>
                    <label className="font-semibold">Sizes</label>
                    <div className="flex gap-2 mb-3">
                      {[20, 15, 12, 11].map((size) => (
                        <label key={size} className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            value={size}
                            className="appearance-none w-5 h-5 border border-gray-400 rounded-full checked:bg-blue-500 checked:border-transparent focus:outline-none transition-all"
                            checked={selectedSizes.includes(size)}
                            onChange={(e) => handleSizeChange(e, size)}
                          />
                          {size}
                        </label>
                      ))}
                    </div>

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
                      placeholder="Material name"
                      className="w-full border border-gray-400 p-2 rounded mb-3"
                      onChange={(e) =>
                        setMaterials({ ...materials, [e.target.value]: 0 })
                      }
                    />

                    <div className="mt-4 mb-2 flex justify-end space-x-2">
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
                  <form
                    className="flex flex-col space-y-3 overflow-y-auto h-[calc(90vh-3rem)] pr-2"
                    onSubmit={updateProduct}
                  >
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
                    <label className="font-semibold">Product Title (EN)</label>
                    <input
                      type="text"
                      onChange={(e) => setTitleEn(e.target.value)}
                      value={titleEn}
                      className="w-full border border-gray-400 p-2 rounded mb-3"
                      required
                    />
                    <label className="font-semibold">Product Title (RU)</label>
                    <input
                      type="text"
                      onChange={(e) => setTitleRu(e.target.value)}
                      value={titleRu}
                      className="w-full border border-gray-400 p-2 rounded mb-3"
                      required
                    />
                    <label className="font-semibold">Product Title (DE)</label>
                    <input
                      type="text"
                      onChange={(e) => setTitleDe(e.target.value)}
                      value={titleDe}
                      className="w-full border border-gray-400 p-2 rounded mb-3"
                      required
                    />
                    <label className="font-semibold">
                      Product Description (EN)
                    </label>
                    <input
                      type="text"
                      onChange={(e) => setDescriptionEn(e.target.value)}
                      value={descriptionEn}
                      className="w-full border border-gray-400 p-2 rounded mb-3"
                      required
                    />
                    <label className="font-semibold">
                      Product Description (RU)
                    </label>
                    <input
                      type="text"
                      onChange={(e) => setDescriptionRu(e.target.value)}
                      value={descriptionRu}
                      className="w-full border border-gray-400 p-2 rounded mb-3"
                      required
                    />
                    <label className="font-semibold">
                      Product Description (DE)
                    </label>
                    <input
                      type="text"
                      onChange={(e) => setDescriptionDe(e.target.value)}
                      value={descriptionDe}
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
                    <label className="font-semibold">Minimum Sell</label>
                    <input
                      type="number"
                      onChange={(e) => setMinSell(e.target.value)}
                      value={minSell}
                      className="w-full border border-gray-400 p-2 rounded mb-3"
                      required
                    />
                    <label className="font-semibold">Category</label>
                    <select
                      onChange={(e) => setCategory(e.target.value)}
                      value={category}
                      className="w-full border border-gray-400 p-2 rounded mb-3"
                      required
                    >
                      <option value="" disabled>
                        Select
                      </option>
                      <option value="option1">Yozgi fasil</option>
                      <option value="option2">Qishgi fasil</option>
                    </select>
                    <label className="font-semibold">Colors</label>
                    <div className="flex gap-2 mb-3">
                      {["Red", "Green", "Blue", "Black"].map((color) => (
                        <label key={color} className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            value={color}
                            className="appearance-none w-5 h-5 border border-gray-400 rounded-full checked:bg-blue-500 checked:border-transparent focus:outline-none transition-all"
                            checked={colors.includes(color)}
                            onChange={handleColorChange}
                          />
                          {color}
                        </label>
                      ))}
                    </div>
                    <label className="font-semibold">Sizes</label>
                    <div className="flex gap-2 mb-3">
                      {[20, 15, 12, 11].map((size) => (
                        <label key={size} className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            value={size}
                            className="appearance-none w-5 h-5 border border-gray-400 rounded-full checked:bg-blue-500 checked:border-transparent focus:outline-none transition-all"
                            checked={selectedSizes.includes(size)}
                            onChange={(e) => handleSizeChange(e, size)}
                          />
                          {size}
                        </label>
                      ))}
                    </div>

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
                      placeholder="Material name"
                      className="w-full border border-gray-400 p-2 rounded mb-3"
                      onChange={(e) =>
                        setMaterials({ ...materials, [e.target.value]: 0 })
                      }
                    />

                    <div className="mt-4 mb-2 flex justify-end space-x-2">
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
