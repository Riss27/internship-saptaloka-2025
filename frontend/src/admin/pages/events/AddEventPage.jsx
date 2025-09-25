import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FiPlus, FiTrash2, FiSave, FiType, FiUsers, FiMapPin, FiDollarSign, FiCalendar, FiImage, FiX, FiUploadCloud } from "react-icons/fi";

// Reusable InputField
const InputField = ({ label, name, value, onChange, icon, ...props }) => (
  <div className="mb-6">
    <label className="block mb-2 font-medium text-slate-300">{label}</label>
    <div className="relative">
      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">{icon}</span>
      <input {...props} name={name} value={value || ""} onChange={onChange} className="w-full p-2 pl-10 bg-slate-800 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500" />
    </div>
  </div>
);

// Reusable TiptapEditor
const TiptapEditor = ({ content, onUpdate }) => {
  const editor = useEditor({
    extensions: [StarterKit],
    content: content || "",
    onUpdate: ({ editor }) => onUpdate(editor.getHTML()),
    editorProps: { attributes: { class: "prose prose-invert max-w-none p-4 min-h-[150px] focus:outline-none" } },
  });

  if (!editor) return null;

  return (
    <div className="bg-slate-800 border border-slate-600 rounded-md">
      <EditorContent editor={editor} />
    </div>
  );
};

const AddEventPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);

  const [isLoading, setIsLoading] = useState(false);
  const [event, setEvent] = useState({ title: "", quota: 1, location: "", fee: 0, description: "", startDateTime: new Date(), endDateTime: new Date() });
  const [imageBanner, setImageBanner] = useState(null);
  const [previewBanner, setPreviewBanner] = useState("");
  const [roles, setRoles] = useState(["Umum"]);
  const [newRole, setNewRole] = useState("");
  const [contents, setContents] = useState([]);

  // Fetch data if edit mode
  useEffect(() => {
    if (!isEditMode) return;
    setIsLoading(true);
    axios
      .get(`http://localhost:3000/api/events/${id}`)
      .then((res) => {
        const fetched = res.data.data || {};
        setEvent({
          title: fetched.title || "",
          quota: fetched.quota || 1,
          location: fetched.location || "",
          fee: fetched.fee || 0,
          description: fetched.description || "",
          startDateTime: fetched.startDateTime ? new Date(fetched.startDateTime) : new Date(),
          endDateTime: fetched.endDateTime ? new Date(fetched.endDateTime) : new Date(),
        });
        if (fetched.imageBannerUrl) setPreviewBanner(`http://localhost:3000${fetched.imageBannerUrl}`);
        if (fetched.participantRoles) {
          try {
            const parsedRoles = Array.isArray(fetched.participantRoles) ? fetched.participantRoles : JSON.parse(fetched.participantRoles);
            setRoles(parsedRoles);
          } catch {
            setRoles(["Umum"]);
          }
        }
        if (Array.isArray(fetched.EventContents)) {
          const fetchedContents = fetched.EventContents.map((c) => {
            let imageUrls = [];
            try {
              if (c.imageUrls) imageUrls = Array.isArray(c.imageUrls) ? c.imageUrls : JSON.parse(c.imageUrls);
            } catch {
              imageUrls = [];
            }
            return {
              header: c.header || "",
              content: c.content || "",
              images: imageUrls,
              previews: imageUrls.map((url) => `http://localhost:3000${url}`),
            };
          });
          setContents(fetchedContents);
        }
      })
      .catch((err) => console.error("Gagal mengambil data event:", err))
      .finally(() => setIsLoading(false));
  }, [id, isEditMode]);

  // Handlers
  const handleEventChange = (e) => setEvent((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  const handleDescriptionChange = (value) => setEvent((prev) => ({ ...prev, description: value }));
  const handleBannerChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageBanner(file);
      setPreviewBanner(URL.createObjectURL(file));
    }
  };
  const addRole = () => {
    if (newRole && !roles.includes(newRole)) {
      setRoles([...roles, newRole]);
      setNewRole("");
    }
  };
  const removeRole = (index) => setRoles(roles.filter((_, i) => i !== index));
  const addContentSection = () => setContents([...contents, { header: "", content: "", images: [], previews: [] }]);
  const removeContentSection = (index) => setContents(contents.filter((_, i) => i !== index));
  const handleContentTextChange = (index, field, value) => {
    const newContents = [...contents];
    newContents[index][field] = value;
    setContents(newContents);
  };
  const handleContentImageChange = (index, e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    const newContents = [...contents];
    newContents[index].images.push(...files);
    newContents[index].previews = newContents[index].images.map((f) => (typeof f === "string" ? f : URL.createObjectURL(f)));
    setContents(newContents);
  };
  const removeContentImage = (cIndex, iIndex) => {
    const newContents = [...contents];
    newContents[cIndex].images.splice(iIndex, 1);
    newContents[cIndex].previews.splice(iIndex, 1);
    setContents(newContents);
  };

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData();
    Object.keys(event).forEach((key) => formData.append(key, event[key]));
    if (imageBanner) formData.append("imageBanner", imageBanner);
    formData.append("participantRoles", JSON.stringify(roles));
    const contentData = contents.map((c) => {
      const newFiles = c.images.filter((img) => typeof img !== "string");
      const existingUrls = c.images.filter((img) => typeof img === "string").map((url) => url.replace("http://localhost:3000", ""));
      return { header: c.header, content: c.content, imageCount: newFiles.length, existingImageUrls: existingUrls };
    });
    formData.append("contents", JSON.stringify(contentData));
    contents.forEach((c) =>
      c.images.forEach((img) => {
        if (typeof img !== "string") formData.append("contentImages", img);
      })
    );

    try {
      if (isEditMode) {
        await axios.put(`http://localhost:3000/api/events/${id}`, formData, { headers: { "Content-Type": "multipart/form-data" } });
      } else {
        await axios.post("http://localhost:3000/api/events", formData, { headers: { "Content-Type": "multipart/form-data" } });
      }
      navigate("/events");
    } catch (err) {
      console.error("Gagal menyimpan event:", err.response?.data || err);
      alert("Gagal menyimpan event. Periksa semua kolom wajib.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto text-white">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">{isEditMode ? "Edit Event" : "Create New Event"}</h1>
        <Link to="/events" className="bg-red-600 hover:bg-red-700 px-5 py-2 rounded-md font-semibold no-underline">
          BACK
        </Link>
      </header>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Event Details */}
        <div className="bg-slate-800/50 p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-6 border-b border-slate-700 pb-4">Event Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <InputField label="Event Title" name="title" value={event.title} onChange={handleEventChange} icon={<FiType />} required placeholder="Judul event..." />
              <InputField label="Location" name="location" value={event.location} onChange={handleEventChange} icon={<FiMapPin />} required placeholder="Lokasi event..." />
              <div className="grid grid-cols-2 gap-4">
                <InputField label="Quota" name="quota" type="number" min="1" value={event.quota} onChange={handleEventChange} icon={<FiUsers />} required />
                <InputField label="Fee" name="fee" type="number" min="0" value={event.fee} onChange={handleEventChange} icon={<FiDollarSign />} required />
              </div>
            </div>
            <div>
              <label className="block mb-2 font-medium text-slate-300">Image Banner</label>
              <div className="mt-2 flex justify-center items-center w-full h-48 border-2 border-dashed border-slate-600 rounded-lg bg-slate-900/50 hover:border-cyan-500 transition-colors">
                {previewBanner ? (
                  <img src={previewBanner} alt="Banner Preview" className="h-full w-full object-contain p-1 rounded-lg" />
                ) : (
                  <div className="text-center text-slate-400">
                    <FiImage className="mx-auto h-12 w-12" />
                    <span className="mt-2 block">Banner Preview</span>
                  </div>
                )}
              </div>
              <input
                type="file"
                name="imageBanner"
                onChange={handleBannerChange}
                className="w-full mt-4 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-cyan-600 file:text-white hover:file:bg-cyan-700"
                required={!isEditMode}
              />
            </div>
          </div>
          <div className="mt-6">
            <label className="block mb-2 font-medium text-slate-300">Description</label>
            <TiptapEditor content={event.description} onUpdate={handleDescriptionChange} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
            <div>
              <label className="block mb-2 font-medium text-slate-300 flex items-center">
                <FiCalendar className="mr-2" /> Start Date & Time
              </label>
              <DatePicker
                selected={event.startDateTime}
                onChange={(date) => setEvent((prev) => ({ ...prev, startDateTime: date }))}
                showTimeSelect
                dateFormat="MMMM d, yyyy h:mm aa"
                className="w-full p-2 bg-slate-800 border border-slate-600 rounded-md"
              />
            </div>
            <div>
              <label className="block mb-2 font-medium text-slate-300 items-center">
                <FiCalendar className="mr-2" /> End Date & Time
              </label>
              <DatePicker
                selected={event.endDateTime}
                onChange={(date) => setEvent((prev) => ({ ...prev, endDateTime: date }))}
                showTimeSelect
                dateFormat="MMMM d, yyyy h:mm aa"
                className="w-full p-2 bg-slate-800 border border-slate-600 rounded-md"
              />
            </div>
          </div>
        </div>

        {/* Participant Roles */}
        <div className="bg-slate-800/50 p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-6 border-b border-slate-700 pb-4">Participant Roles</h2>
          <div className="flex items-center gap-4 mb-4">
            <input
              type="text"
              value={newRole}
              onChange={(e) => setNewRole(e.target.value)}
              placeholder="Contoh: Mahasiswa"
              className="flex-grow p-2 bg-slate-800 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
            <button type="button" onClick={addRole} className="bg-cyan-600 hover:bg-cyan-700 px-4 py-2 rounded-md font-semibold transition-colors">
              Add Role
            </button>
          </div>
          <div className="flex flex-wrap gap-2 min-h-[2.5rem]">
            {roles.map((role, index) => (
              <span key={index} className="flex items-center bg-slate-700 px-3 py-1 rounded-full text-sm">
                {role}{" "}
                <button type="button" onClick={() => removeRole(index)} className="ml-2 text-red-400 hover:text-white">
                  <FiX size={16} />
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Content Sections */}
        <div className="bg-slate-800/50 p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-6 border-b border-slate-700 pb-4">Content Sections</h2>
          <div className="space-y-6">
            {contents.map((content, index) => (
              <div key={index} className="bg-slate-900/50 border border-slate-700 rounded-lg p-6 relative">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-cyan-400 text-lg">Section {index + 1}</h3>
                  <button type="button" onClick={() => removeContentSection(index)} className="p-1 text-red-500 hover:text-red-400 hover:bg-red-500/10 rounded-full">
                    <FiTrash2 size={18} />
                  </button>
                </div>
                <InputField label="Header" name="header" value={content.header} onChange={(e) => handleContentTextChange(index, "header", e.target.value)} icon={<FiType />} placeholder="Judul section..." />
                <div>
                  <label className="block mb-2 font-medium text-slate-300">Content</label>
                  <TiptapEditor content={content.content} onUpdate={(value) => handleContentTextChange(index, "content", value)} />
                </div>
                <div className="mt-6">
                  <label className="block mb-2 font-medium text-slate-300">Images</label>
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4 min-h-[7rem] bg-slate-800/70 p-4 rounded-md">
                    {content.previews.map((p, i) => (
                      <div key={i} className="relative group aspect-square">
                        <img src={p} className="h-full w-full object-cover rounded-md border-2 border-slate-600" />
                        <button type="button" onClick={() => removeContentImage(index, i)} className="absolute -top-2 -right-2 p-1 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100">
                          <FiX size={14} />
                        </button>
                      </div>
                    ))}
                    <label className="flex flex-col justify-center items-center w-full h-full border-2 border-dashed border-slate-600 rounded-md cursor-pointer hover:border-cyan-500 hover:bg-slate-700/50 transition-colors">
                      <FiUploadCloud className="h-8 w-8 text-slate-400" />
                      <span className="text-xs text-slate-400 mt-1">Add more</span>
                      <input type="file" multiple onChange={(e) => handleContentImageChange(index, e)} className="opacity-0 w-0 h-0" />
                    </label>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={addContentSection}
            className="w-full mt-6 border-2 border-dashed border-slate-600 hover:border-cyan-500 text-slate-300 hover:text-cyan-400 py-3 rounded-md font-semibold flex items-center justify-center transition-colors"
          >
            <FiPlus className="mr-2" /> Add Content Section
          </button>
        </div>

        {/* Submit */}
        <div className="mt-8">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-cyan-600 hover:bg-cyan-700 disabled:bg-cyan-800 disabled:cursor-not-allowed py-3 rounded-md font-bold text-lg flex items-center justify-center transition-colors duration-300"
          >
            {isLoading ? (
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <FiSave className="mr-2" />
            )}
            {isLoading ? "Saving..." : isEditMode ? "SAVE CHANGES" : "CREATE EVENT"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddEventPage;
