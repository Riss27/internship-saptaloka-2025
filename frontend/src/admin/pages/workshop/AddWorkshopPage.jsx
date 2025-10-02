import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { FiSave, FiType, FiFileText, FiImage, FiCheckSquare, FiSquare, FiToggleLeft, FiToggleRight, FiTag } from "react-icons/fi";

// Komponen Reusable (InputField & TiptapEditor)
const InputField = ({ label, name, value, onChange, icon, ...props }) => (
  <div className="mb-6">
    <label className="block mb-2 font-medium text-slate-300">{label}</label>
    <div className="relative">
      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">{icon}</span>
      <input {...props} name={name} value={value || ""} onChange={onChange} className="w-full p-2 pl-10 bg-slate-800 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500" />
    </div>
  </div>
);

const TiptapEditor = ({ content, onUpdate }) => {
  const editor = useEditor({
    extensions: [StarterKit],
    content: content || "",
    onUpdate: ({ editor }) => {
      onUpdate(editor.getHTML());
    },
    editorProps: {
      attributes: { class: "prose prose-invert max-w-none p-4 min-h-[200px] focus:outline-none" },
    },
  });

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);
  return (
    <div className="bg-slate-800 border border-slate-600 rounded-md">
      <div className="flex flex-wrap gap-2 p-2 bg-slate-700/50 rounded-t-md border-b border-slate-600">
        <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className={editor?.isActive("bold") ? "bg-cyan-600 text-white p-2 rounded" : "p-2"}>
          Bold
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className={editor?.isActive("italic") ? "bg-cyan-600 text-white p-2 rounded" : "p-2"}>
          Italic
        </button>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
};

const AddWorkshopPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const [isLoading, setIsLoading] = useState(false);
  const [workshop, setWorkshop] = useState({ title: "", description: "", status: "draft", category: "" });
  const [image, setImage] = useState(null);
  const [previewImage, setPreviewImage] = useState("");
  const [availableEvents, setAvailableEvents] = useState([]);
  const [selectedEventIds, setSelectedEventIds] = useState(new Set());

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/events?search=")
      .then((response) => setAvailableEvents(response.data.data))
      .catch((error) => console.error("Gagal mengambil data events:", error));

    if (isEditMode) {
      axios
        .get(`http://localhost:3000/api/workshops/${id}`)
        .then((response) => {
          const fetched = response.data.data;
          setWorkshop({ title: fetched.title, description: fetched.description, status: fetched.status, category: fetched.category });
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData();
    formData.append("title", workshop.title);
    formData.append("description", workshop.description);
    formData.append("status", workshop.status);
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
        {/* Kolom Kiri: Detail Workshop */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-slate-800/50 p-8 rounded-lg">
            <h2 className="text-2xl font-semibold mb-6 border-b border-slate-700 pb-4">Workshop Details</h2>
            <InputField label="Workshop Title" name="title" value={workshop.title} onChange={handleWorkshopChange} icon={<FiType />} required placeholder="Judul workshop..." />
            <div className="mb-6">
              <label className="block mb-2 font-medium text-slate-300">Category</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                  <FiTag />
                </span>
                <select name="category" value={workshop.category} onChange={handleWorkshopChange} required className="w-full p-2 pl-10 bg-slate-800 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500">
                  <option value="" disabled>
                    -- Pilih Kategori --
                  </option>
                  <option value="Aromaterapi">Aromaterapi</option>
                  <option value="Parfum">Parfum</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block mb-2 font-medium text-slate-300">Workshop Poster</label>
              <div className="mt-2 flex justify-center items-center w-full h-48 border-2 border-dashed border-slate-600 rounded-lg bg-slate-900/50">
                {previewImage ? (
                  <img src={previewImage} alt="Preview" className="h-full w-full object-contain p-1" />
                ) : (
                  <div className="text-center text-slate-400">
                    <FiImage className="mx-auto h-12 w-12" />
                  </div>
                )}
              </div>
              <input type="file" name="imageUrl" onChange={handleImageChange} className="w-full mt-4 text-sm" required={!isEditMode} />
            </div>
            <div className="mt-6">
              <label className="block mb-2 font-medium text-slate-300">Description</label>
              <TiptapEditor content={workshop.description} onUpdate={handleDescriptionChange} />
            </div>
          </div>
        </div>

        {/* Kolom Kanan: Pemilihan Event & Status */}
        <div className="space-y-8">
          <div className="bg-slate-800/50 p-8 rounded-lg">
            <h2 className="text-2xl font-semibold mb-6 border-b border-slate-700 pb-4">Select Events</h2>
            <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
              {availableEvents.map((event) => (
                <div
                  key={event.id}
                  onClick={() => handleEventSelect(event.id)}
                  className={`flex items-center p-3 rounded-lg border-2 cursor-pointer transition-colors ${selectedEventIds.has(event.id) ? "bg-cyan-900/50 border-cyan-500" : "bg-slate-900/50 border-transparent hover:border-slate-600"}`}
                >
                  {selectedEventIds.has(event.id) ? <FiCheckSquare className="text-cyan-400 mr-4 flex-shrink-0" /> : <FiSquare className="text-slate-500 mr-4 flex-shrink-0" />}
                  <img src={`http://localhost:3000${event.imageBannerUrl}`} alt={event.title} className="w-16 h-10 object-cover rounded-md" />
                  <div className="ml-4">
                    <p className="font-semibold text-white text-sm">{event.title}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-slate-800/50 p-8 rounded-lg">
            <h2 className="text-2xl font-semibold mb-6 border-b border-slate-700 pb-4">Status</h2>
            <div className="flex items-center cursor-pointer" onClick={() => setWorkshop((p) => ({ ...p, status: p.status === "draft" ? "published" : "draft" }))}>
              {workshop.status === "published" ? <FiToggleRight className="text-green-400 text-4xl" /> : <FiToggleLeft className="text-slate-500 text-4xl" />}
              <span className="ml-4 text-lg font-semibold">{workshop.status === "published" ? "Published" : "Draft"}</span>
            </div>
          </div>
        </div>

        {/* Tombol Aksi */}
        <div className="lg:col-span-3 mt-8">
          <button type="submit" disabled={isLoading} className="w-full bg-cyan-600 hover:bg-cyan-700 py-3 rounded-md font-bold text-lg flex items-center justify-center">
            <FiSave className="mr-2" />
            {isLoading ? "Saving..." : isEditMode ? "SAVE CHANGES" : "CREATE WORKSHOP"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddWorkshopPage;
