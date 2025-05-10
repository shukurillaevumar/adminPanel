"use client";
import { Dialog, Transition } from "@headlessui/react";
import React, { useEffect, useState, Fragment } from "react";
import { toast, ToastContainer } from "react-toastify";

type Faq = {
  id: number;
  question_en: string;
  question_ru: string;
  question_de: string;
  answer_en: string;
  answer_ru: string;
  answer_de: string;
};

const FaqPage: React.FC = () => {
  const [data, setData] = useState<Faq[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editQuestion, setEditQuestion] = useState<Faq | null>(null);

  const [token, setToken] = useState<string | null>(null);
  const [questionEn, setQuestionEn] = useState("");
  const [questionRu, setQuestionRu] = useState("");
  const [questionDe, setQuestionDe] = useState("");

  const [answerEn, setAnswerEn] = useState("");
  const [answerRu, setAnswerRu] = useState("");
  const [answerDe, setAnswerDe] = useState("");

  const [clickId, setClickId] = useState<number | null>(null);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    const accessToken = localStorage.getItem("access_token");
    setToken(accessToken);
  }, []);

  const getCategory = () => {
    setLoadingData(true);
    fetch("https://testaoron.limsa.uz/api/faq")
      .then((response) => response.json())
      .then((item) => setData(item?.data));
    setLoadingData(false);
  };

  useEffect(() => {
    getCategory();
  }, []);

  const createFaq = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    fetch("https://testaoron.limsa.uz/api/faq", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        question_en: questionEn,
        question_ru: questionRu,
        question_de: questionDe,
        answer_en: answerEn,
        answer_ru: answerRu,
        answer_de: answerDe,
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

  const updateFaq = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    fetch(`https://testaoron.limsa.uz/api/faq/${clickId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        question_en: questionEn,
        question_ru: questionRu,
        question_de: questionDe,
        answer_en: answerEn,
        answer_ru: answerRu,
        answer_de: answerDe,
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

  const deleteFaq = (id: number) => {
    fetch(`https://testaoron.limsa.uz/api/faq/${id}`, {
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
    setQuestionEn("");
    setQuestionRu("");
    setQuestionDe("");
    setAnswerEn("");
    setAnswerRu("");
    setAnswerDe("");
  }

  function closeModal() {
    setIsOpen(false);
  }

  useEffect(() => {
    if (editQuestion) {
      setQuestionEn(editQuestion.question_en);
      setQuestionRu(editQuestion.question_ru);
      setQuestionDe(editQuestion.question_de);
      setAnswerEn(editQuestion.answer_en);
      setAnswerRu(editQuestion.answer_ru);
      setAnswerDe(editQuestion.answer_de);
    }
  }, [editQuestion]);

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
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Faq</h2>
            <button
              onClick={openModal}
              className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded cursor-pointer"
            >
              Add Faq
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200 rounded">
              <thead className="bg-gray-200">
                <tr>
                  <th className="py-2 px-4 border">№</th>
                  <th className="py-2 px-4 border">Question ENG</th>
                  <th className="py-2 px-4 border">Question RU</th>
                  <th className="py-2 px-4 border">Question DE</th>
                  <th className="py-2 px-4 border">Answer ENG</th>
                  <th className="py-2 px-4 border">Answer RU</th>
                  <th className="py-2 px-4 border">Answer DE</th>
                  <th className="py-2 px-4 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data?.map((element) => (
                  <tr key={element.id} className="text-center">
                    <td className="py-2 px-4 border">{element.id}</td>
                    <td className="py-2 px-4 border">{element.question_en}</td>
                    <td className="py-2 px-4 border">{element.question_ru}</td>
                    <td className="py-2 px-4 border">{element.question_de}</td>
                    <td className="py-2 px-4 border">{element.answer_en}</td>
                    <td className="py-2 px-4 border">{element.answer_ru}</td>
                    <td className="py-2 px-4 border">{element.answer_de}</td>
                    <td className="py-2 px-4 border space-x-2">
                      <button
                        onClick={() => {
                          setEditQuestion(element);
                          setEditModalOpen(true);
                          setClickId(element?.id);
                        }}
                        className="bg-yellow-400 hover:bg-yellow-500 text-white py-1 px-3 rounded cursor-pointer"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteFaq(element.id)}
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
                    Add New Faq
                  </Dialog.Title>
                  <form className="mt-4" onSubmit={createFaq}>
                    <label className="font-semibold">Question (EN)</label>
                    <input
                      type="text"
                      onChange={(e) => setQuestionEn(e.target.value)}
                      value={questionEn}
                      onKeyDown={preventNumbers}
                      className="w-full border border-gray-400 p-2 rounded mb-3"
                      required
                    />
                    <label className="font-semibold">Question (RU)</label>
                    <input
                      type="text"
                      onChange={(e) => setQuestionRu(e.target.value)}
                      value={questionRu}
                      onKeyDown={preventNumbers}
                      className="w-full border border-gray-400 p-2 rounded mb-3"
                      required
                    />
                    <label className="font-semibold">Question (DE)</label>
                    <input
                      type="text"
                      onChange={(e) => setQuestionDe(e.target.value)}
                      value={questionDe}
                      onKeyDown={preventNumbers}
                      className="w-full border border-gray-400 p-2 rounded mb-3"
                      required
                    />
                    <label className="font-semibold">Answer (EN)</label>
                    <input
                      type="text"
                      onChange={(e) => setAnswerEn(e.target.value)}
                      value={answerEn}
                      onKeyDown={preventNumbers}
                      className="w-full border border-gray-400 p-2 rounded mb-3"
                      required
                    />
                    <label className="font-semibold">Answer (RU)</label>
                    <input
                      type="text"
                      onChange={(e) => setAnswerRu(e.target.value)}
                      value={answerRu}
                      onKeyDown={preventNumbers}
                      className="w-full border border-gray-400 p-2 rounded mb-3"
                      required
                    />
                    <label className="font-semibold">Answer (DE)</label>
                    <input
                      type="text"
                      onChange={(e) => setAnswerDe(e.target.value)}
                      value={answerDe}
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
                    Edit Faq
                  </Dialog.Title>
                  <form className="mt-4" onSubmit={updateFaq}>
                    <label className="font-semibold">Question Name (EN)</label>
                    <input
                      type="text"
                      onChange={(e) => setQuestionEn(e.target.value)}
                      value={questionEn}
                      onKeyDown={preventNumbers}
                      className="w-full border border-gray-400 p-2 rounded mb-3"
                      required
                    />
                    <label className="font-semibold">Question Name (RU)</label>
                    <input
                      type="text"
                      onChange={(e) => setQuestionRu(e.target.value)}
                      value={questionRu}
                      onKeyDown={preventNumbers}
                      className="w-full border border-gray-400 p-2 rounded mb-3"
                      required
                    />
                    <label className="font-semibold">Question Name (DE)</label>
                    <input
                      type="text"
                      onChange={(e) => setQuestionDe(e.target.value)}
                      value={questionDe}
                      onKeyDown={preventNumbers}
                      className="w-full border border-gray-400 p-2 rounded mb-3"
                      required
                    />
                    <label className="font-semibold">Answer Name (EN)</label>
                    <input
                      type="text"
                      onChange={(e) => setAnswerEn(e.target.value)}
                      value={answerEn}
                      onKeyDown={preventNumbers}
                      className="w-full border border-gray-400 p-2 rounded mb-3"
                      required
                    />
                    <label className="font-semibold">Answer Name (RU)</label>
                    <input
                      type="text"
                      onChange={(e) => setAnswerRu(e.target.value)}
                      value={answerRu}
                      onKeyDown={preventNumbers}
                      className="w-full border border-gray-400 p-2 rounded mb-3"
                      required
                    />
                    <label className="font-semibold">Answer Name (DE)</label>
                    <input
                      type="text"
                      onChange={(e) => setAnswerDe(e.target.value)}
                      value={answerDe}
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

export default FaqPage;
