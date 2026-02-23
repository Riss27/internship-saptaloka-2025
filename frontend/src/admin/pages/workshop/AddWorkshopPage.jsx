import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { FiSave, FiType, FiFileText, FiImage, FiCheckSquare, FiSquare, FiToggleLeft, FiToggleRight, FiTag, FiPlus, FiX, FiUploadCloud } from "react-icons/fi";
import RichTextEditor from "../../components/RichTextEditor";

const InputField = ({ label, name, value, onChange, icon, ...props }) => (
    <div className="mb-6">
        <label className="block mb-2 font-medium text-slate-300">{label}</label>
        <div className="relative">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">{icon}</span>
        <input {...props} name={name} value={value || ""} onChange={onChange} className="w-full p-2 pl-10 bg-slate-800 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500" />
        </div>
    </div>
);

const AddWorkshopPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const [isLoading, setIsLoading] = useState(false);
  const [workshop, setWorkshop] = useState({ title: "", description: "", category: "" });
  const [image, setImage] = useState(null);
  const [previewImage, setPreviewImage] = useState("");
  const [groupedEvents, setGroupedEvents] = useState({});
  const [selectedEventIds, setSelectedEventIds] = useState(new Set());
  const [categories, setCategories] = useState([]);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [isAddingCategory, setIsAddingCategory] = useState(false);

  const fetchCategories = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/categories");
      setCategories(response.data.data);
    } catch (error) {
      console.error("Gagal mengambil data kategori:", error);
    }
  };

  useEffect(() => {
    fetchCategories();

    axios
      .get("http://localhost:3000/api/events?search=")
      .then((response) => {
        const events = response.data.data;
        const grouped = events.reduce((acc, event) => {
          const category = event.category || "Tanpa Kategori";
          if (!acc[category]) {
            acc[category] = [];
          }
          acc[category].push(event);
          return acc;
        }, {});
        setGroupedEvents(grouped);
      })
      .catch((error) => console.error("Gagal mengambil data events:", error));

    if (isEditMode) {
      axios
        .get(`http://localhost:3000/api/workshops/${id}`)
        .then((response) => {
          const fetched = response.data.data;
          setWorkshop({ title: fetched.title, description: fetched.description, category: fetched.category });
          setPreviewImage(`http://localhost:3000${fetched.imageUrl}`);
          setSelectedEventIds(new Set(fetched.Events.map((e) => e.id)));
        })
        .catch((error) => console.error("Gagal mengambil data workshop:", error));
    }
  }, [id, isEditMode]);

  const handleWorkshopChange = (e) => setWorkshop((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  const handleDescriptionChange = (value) => setWorkshop((prev) => ({ ...prev, description: value }));
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };
  const handleEventSelect = (eventId) => {
    const newSelectedIds = new Set(selectedEventIds);
    if (newSelectedIds.has(eventId)) {
      newSelectedIds.delete(eventId);
    } else {
      newSelectedIds.add(eventId);
    }
    setSelectedEventIds(newSelectedIds);
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCategoryName.trim()) {
      alert("Nama kategori tidak boleh kosong.");
      return;
    }

    setIsAddingCategory(true);
    try {
      const response = await axios.post("http://localhost:3000/api/categories", {
        name: newCategoryName.trim(),
      });
      
      // Refresh categories
      await fetchCategories();
      
      // Set the newly created category as selected
      setWorkshop((prev) => ({ ...prev, category: response.data.data.name }));
      
      // Close modal and reset form
      setShowCategoryModal(false);
      setNewCategoryName("");
      
      alert("Kategori berhasil ditambahkan!");
    } catch (error) {
      console.error("Gagal menambahkan kategori:", error);
      alert(error.response?.data?.message || "Gagal menambahkan kategori.");
    } finally {
      setIsAddingCategory(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData();
    formData.append("title", workshop.title);
    formData.append("description", workshop.description);
    formData.append("category", workshop.category);
    if (image) formData.append("imageUrl", image);
    formData.append("eventIds", JSON.stringify(Array.from(selectedEventIds)));
    try {
      if (isEditMode) {
        await axios.put(`http://localhost:3000/api/workshops/${id}`, formData, { headers: { "Content-Type": "multipart/form-data" } });
      } else {
        await axios.post("http://localhost:3000/api/workshops", formData, { headers: { "Content-Type": "multipart/form-data" } });
      }
      navigate("/admin/workshop");
    } catch (error) {
      console.error("Gagal menyimpan workshop:", error.response?.data || error);
      alert("Gagal menyimpan workshop.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto text-white">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">{isEditMode ? "Edit Workshop" : "Create New Workshop"}</h1>
        <Link to="/admin/workshop" className="bg-red-600 hover:bg-red-700 px-5 py-2 rounded-md font-semibold no-underline">
          BACK
        </Link>
      </header>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-slate-800/50 p-8 rounded-lg">
            <h2 className="text-2xl font-semibold mb-6 border-b border-slate-700 pb-4">Workshop Details</h2>
            <InputField label="Workshop Title" name="title" value={workshop.title} onChange={handleWorkshopChange} icon={<FiType />} required placeholder="Judul workshop..." />
            
            <div className="mb-6">
              <label className="block mb-2 font-medium text-slate-300">Category</label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400"><FiTag /></span>
                  <select 
                    name="category" 
                    value={workshop.category} 
                    onChange={handleWorkshopChange} 
                    required 
                    className="w-full p-2 pl-10 bg-slate-800 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  >
                    <option value="" disabled>-- Pilih Kategori Workshop --</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.name}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  type="button"
                  onClick={() => setShowCategoryModal(true)}
                  className="bg-cyan-600 hover:bg-cyan-700 px-4 py-2 rounded-md font-semibold text-white flex items-center gap-2 transition-colors whitespace-nowrap"
                >
                  <FiPlus /> Tambah Kategori
                </button>
              </div>
            </div>

            <div>
              <label className="mb-2 font-medium text-slate-300 flex items-center gap-2">
                <FiImage className="text-cyan-400" />
                Workshop Poster
              </label>
              <div className="relative group">
                <input type="file" id="poster-upload" name="imageUrl" onChange={handleImageChange} className="hidden" accept="image/*" required={!isEditMode} />
                <label
                  htmlFor="poster-upload"
                  className="flex flex-col justify-center items-center w-full h-64 border-2 border-dashed border-slate-600 rounded-xl bg-slate-900/50 cursor-pointer hover:border-cyan-500 hover:bg-slate-800/70 transition-all duration-300 overflow-hidden"
                >
                  {previewImage ? (
                    <div className="relative w-full h-full">
                      <img src={previewImage} alt="Poster Preview" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center">
                        <FiUploadCloud className="h-12 w-12 text-white mb-2" />
                        <span className="text-white font-semibold">Click to change poster</span>
                        <span className="text-slate-300 text-sm mt-1">PNG, JPG up to 10MB</span>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center p-6">
                      <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-slate-800 flex items-center justify-center">
                        <FiUploadCloud className="h-10 w-10 text-cyan-400" />
                      </div>
                      <span className="block text-slate-200 font-semibold mb-1">Click to upload poster</span>
                      <span className="text-slate-400 text-sm">or drag and drop</span>
                      <p className="text-slate-500 text-xs mt-2">PNG, JPG up to 10MB</p>
                    </div>
                  )}
                </label>
              </div>
            </div>
            <div className="mt-6">
              <label className="block mb-2 font-medium text-slate-300">Description</label>
              <RichTextEditor content={workshop.description} onUpdate={handleDescriptionChange} maxLength={5000} />
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-slate-800/50 p-8 rounded-lg">
            <h2 className="text-2xl font-semibold mb-6 border-b border-slate-700 pb-4">Select Events</h2>
            <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
              {workshop.category ? (
                Object.keys(groupedEvents)
                  .filter(category => category === workshop.category || category === "Tanpa Kategori")
                  .map(category => (
                    <div key={category}>
                      <h3 className="font-semibold text-cyan-400 mb-2 sticky top-0 bg-slate-800/50 py-1">{category}</h3>
                      <div className="space-y-3">
                        {groupedEvents[category].map(event => (
                          <div
                            key={event.id}
                            onClick={() => handleEventSelect(event.id)}
                            className={`flex items-center p-3 rounded-lg border-2 cursor-pointer transition-colors ${selectedEventIds.has(event.id) ? "bg-cyan-900/50 border-cyan-500" : "bg-slate-900/50 border-transparent hover:border-slate-600"}`}
                          >
                            {selectedEventIds.has(event.id) ? <FiCheckSquare className="text-cyan-400 mr-4 flex-shrink-0" /> : <FiSquare className="text-slate-500 mr-4 flex-shrink-0" />}
                            <img src={`http://localhost:3000${event.imageBannerUrl}`} alt={event.title} className="w-16 h-10 object-cover rounded-md" />
                            <div className="ml-4"><p className="font-semibold text-white text-sm">{event.title}</p></div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))
              ) : (
                <div className="text-center text-slate-500 p-8"><p>Pilih kategori workshop terlebih dahulu untuk melihat event yang relevan.</p></div>
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-3 mt-8">
          <button type="submit" disabled={isLoading} className="w-full bg-cyan-600 hover:bg-cyan-700 py-3 rounded-md font-bold text-lg flex items-center justify-center">
            <FiSave className="mr-2" />
            {isLoading ? "Saving..." : isEditMode ? "SAVE CHANGES" : "CREATE WORKSHOP"}
          </button>
        </div>
      </form>

      {/* Modal Tambah Kategori */}
      {showCategoryModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-slate-800 rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-white">Tambah Kategori Baru</h2>
              <button
                onClick={() => {
                  setShowCategoryModal(false);
                  setNewCategoryName("");
                }}
                className="text-slate-400 hover:text-white"
              >
                <FiX size={24} />
              </button>
            </div>
            <form onSubmit={handleAddCategory}>
              <div className="mb-4">
                <label className="block mb-2 font-medium text-slate-300">Nama Kategori</label>
                <input
                  type="text"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  placeholder="Masukkan nama kategori..."
                  className="w-full p-2 bg-slate-900 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white"
                  autoFocus
                />
              </div>
              <div className="flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setShowCategoryModal(false);
                    setNewCategoryName("");
                  }}
                  className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-md font-semibold transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isAddingCategory || !newCategoryName.trim()}
                  className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 disabled:bg-cyan-800 disabled:cursor-not-allowed rounded-md font-semibold transition-colors"
                >
                  {isAddingCategory ? "Menambahkan..." : "Tambah"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddWorkshopPage;