import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";

// TAMBAHKAN import untuk DatePicker
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

// TAMBAHKAN FiCalendar untuk ikon
import { FiType, FiUser, FiFileText, FiImage, FiSave, FiPlus, FiTrash2, FiX, FiUploadCloud, FiCalendar } from "react-icons/fi";

const InputField = ({ label, name, value, onChange, type = "text", placeholder, icon, required = false }) => (
  <div className="mb-6">
    <label className="block mb-2 font-medium text-slate-300 transition-colors duration-300 focus-within:text-cyan-400">{label}</label>
    <div className="relative">
      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">{icon}</span>
      {type === "textarea" ? (
        <textarea
          name={name}
          value={value || ""}
          onChange={onChange}
          rows="8"
          placeholder={placeholder}
          required={required}
          className="w-full p-2 pl-10 bg-slate-800 border border-slate-600 rounded-md transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
        />
      ) : (
        <input
          type={type}
          name={name}
          value={value || ""}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className="w-full p-2 pl-10 bg-slate-800 border border-slate-600 rounded-md transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
        />
      )}
    </div>
  </div>
);

const AddArticlePage = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  // UBAH: Tambahkan `publishedAt` ke state awal
  const [article, setArticle] = useState({ title: "", author: "", mainDescription: "", publishedAt: new Date() });

  const [contents, setContents] = useState([{ topic: "", description: "", images: [], previews: [] }]);
  const [featuredImage, setFeaturedImage] = useState(null);
  const [previewFeaturedImage, setPreviewFeaturedImage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const isEditMode = Boolean(id);

  useEffect(() => {
    if (isEditMode) {
      setIsLoading(true);
      axios
        .get(`http://localhost:3000/api/articles/${id}`)
        .then((response) => {
          const fetchedArticle = response.data.data;
          setArticle({
            title: fetchedArticle.title,
            author: fetchedArticle.author,
            mainDescription: fetchedArticle.mainDescription,
            // UBAH: Tambahkan `publishedAt` dari data fetch
            publishedAt: fetchedArticle.publishedAt ? new Date(fetchedArticle.publishedAt) : new Date(),
          });
          if (fetchedArticle.featuredImageUrl) {
            setPreviewFeaturedImage(`http://localhost:3000${fetchedArticle.featuredImageUrl}`);
          }
          if (fetchedArticle.ArticleContents && fetchedArticle.ArticleContents.length > 0) {
            const fetchedContents = fetchedArticle.ArticleContents.map((content) => {
              const parseImageUrls = (data) => {
                if (!data) return [];
                let parsed = data;
                while (typeof parsed === "string") {
                  try {
                    parsed = JSON.parse(parsed);
                  } catch (e) {
                    console.error("Gagal parse imageUrls:", e);
                    return [];
                  }
                }
                return Array.isArray(parsed) ? parsed : [];
              };
              const imageUrls = parseImageUrls(content.imageUrls);
              return {
                topic: content.topic,
                description: content.description,
                images: imageUrls,
                previews: imageUrls.map((url) => `http://localhost:3000${url}`),
              };
            });
            setContents(fetchedContents);
          }
        })
        .catch((error) => {
          console.error("Gagal mengambil detail artikel:", error);
        })
        .finally(() => setIsLoading(false));
    }
  }, [id, isEditMode]);

  const handleArticleChange = (e) => setArticle((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleContentChange = (index, e) => {
    const newContents = [...contents];
    newContents[index][e.target.name] = e.target.value;
    setContents(newContents);
  };

  const handleContentImageChange = (index, e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      const newContents = [...contents];
      const newImages = [...newContents[index].images, ...files];
      const newPreviews = newImages.map((img) => (typeof img === "string" ? `http://localhost:3000${img}` : URL.createObjectURL(img)));

      newContents[index].images = newImages;
      newContents[index].previews = newPreviews;
      setContents(newContents);
    }
  };

  const removeContentImage = (contentIndex, imageIndex) => {
    const newContents = [...contents];
    newContents[contentIndex].images.splice(imageIndex, 1);
    newContents[contentIndex].previews.splice(imageIndex, 1);
    setContents(newContents);
  };

  const handleFeaturedImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFeaturedImage(file);
      setPreviewFeaturedImage(URL.createObjectURL(file));
    }
  };

  const addContentSection = () => setContents([...contents, { topic: "", description: "", images: [], previews: [] }]);
  const removeContentSection = (index) => setContents(contents.filter((_, i) => i !== index));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const submissionData = new FormData();
    // Semua state di `article` otomatis ter-append, termasuk `publishedAt`
    Object.keys(article).forEach((key) => submissionData.append(key, article[key]));

    if (featuredImage) {
      submissionData.append("featuredImage", featuredImage);
    }

    const contentData = contents.map((c) => {
      const newImageFiles = c.images.filter((img) => typeof img !== "string");
      const existingImageUrls = c.images.filter((img) => typeof img === "string");
      return {
        topic: c.topic,
        description: c.description,
        imageCount: newImageFiles.length,
        existingImageUrls: existingImageUrls,
      };
    });
    submissionData.append("contents", JSON.stringify(contentData));

    contents.forEach((c) => {
      c.images.forEach((image) => {
        if (typeof image !== "string") {
          submissionData.append("contentImages", image);
        }
      });
    });

    try {
      const config = { headers: { "Content-Type": "multipart/form-data" } };
      if (isEditMode) {
        await axios.put(`http://localhost:3000/api/articles/${id}`, submissionData, config);
      } else {
        await axios.post("http://localhost:3000/api/articles", submissionData, config);
      }
      navigate("/admin/articles");
    } catch (error) {
      console.error("Gagal menyimpan artikel:", error.response?.data || error.message);
      alert("Gagal menyimpan. Pastikan semua kolom wajib diisi.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto text-white">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">{isEditMode ? "Edit Article" : "Add New Article"}</h1>
        <Link to="/admin/articles" className="bg-red-600 hover:bg-red-700 px-5 py-2 rounded-md font-semibold text-white no-underline">
          BACK
        </Link>
      </header>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-slate-800/50 p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-6 border-b border-slate-700 pb-4">Main Article Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <InputField label="Article Title" name="title" value={article.title} onChange={handleArticleChange} required={true} placeholder="Judul utama artikel..." icon={<FiType />} />
              <InputField label="Author" name="author" value={article.author} onChange={handleArticleChange} required={true} placeholder="Nama penulis..." icon={<FiUser />} />

              {/* TAMBAHKAN: Komponen DatePicker */}
              <div className="mb-6">
                <label className="block mb-2 font-medium text-slate-300 transition-colors duration-300 focus-within:text-cyan-400">Publication Date</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                    <FiCalendar />
                  </span>
                  <DatePicker
                    selected={article.publishedAt ? new Date(article.publishedAt) : new Date()}
                    onChange={(date) => setArticle((prev) => ({ ...prev, publishedAt: date }))}
                    dateFormat="MMMM d, yyyy h:mm aa"
                    showTimeSelect
                    className="w-full p-2 pl-10 bg-slate-800 border border-slate-600 rounded-md transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                  />
                </div>
              </div>

              <InputField label="Main Description" name="mainDescription" type="textarea" value={article.mainDescription} onChange={handleArticleChange} required={true} placeholder="Deskripsi pembuka artikel..." icon={<FiFileText />} />
            </div>
            <div>
              <label className="block mb-2 font-medium text-slate-300">Featured Image</label>
              <div className="mt-2 flex justify-center items-center w-full h-60 border-2 border-dashed border-slate-600 rounded-lg bg-slate-900/50 hover:border-cyan-500 transition-colors">
                {previewFeaturedImage ? (
                  <img src={previewFeaturedImage} alt="Preview" className="h-full w-full object-contain rounded-lg p-1" />
                ) : (
                  <div className="text-center text-slate-400">
                    <FiImage className="mx-auto h-12 w-12" />
                    <span className="mt-2 block">16:9 Image Preview</span>
                  </div>
                )}
              </div>
              <input
                type="file"
                name="featuredImage"
                onChange={handleFeaturedImageChange}
                className="w-full mt-4 text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-cyan-600 file:text-white hover:file:bg-cyan-700"
                required={!isEditMode}
              />
            </div>
          </div>
        </div>

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
                <InputField label="Topic" name="topic" value={content.topic} onChange={(e) => handleContentChange(index, e)} required={true} placeholder="Judul sub-konten..." icon={<FiType />} />
                <InputField label="Description" name="description" type="textarea" value={content.description} onChange={(e) => handleContentChange(index, e)} required={true} placeholder="Isi sub-konten..." icon={<FiFileText />} />
                <div className="mb-2">
                  <label className="block mb-2 font-medium text-slate-300">Images</label>
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4 min-h-[7rem] bg-slate-800/70 p-4 rounded-md">
                    {content.previews.map((previewUrl, i) => (
                      <div key={i} className="relative group aspect-square">
                        <img src={previewUrl} alt={`Preview ${i}`} className="h-full w-full object-cover rounded-md border-2 border-slate-600" />
                        <button type="button" onClick={() => removeContentImage(index, i)} className="absolute -top-2 -right-2 p-1 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                          <FiX size={14} />
                        </button>
                      </div>
                    ))}
                    <label className="flex flex-col justify-center items-center w-full h-full border-2 border-dashed border-slate-600 rounded-md cursor-pointer hover:border-cyan-500 hover:bg-slate-700/50 transition-colors">
                      <FiUploadCloud className="h-8 w-8 text-slate-400" />
                      <span className="text-xs text-slate-400 mt-1">Add more</span>
                      <input type="file" name="contentImages" onChange={(e) => handleContentImageChange(index, e)} multiple className="opacity-0 w-0 h-0" />
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

        <div className="mt-8">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-cyan-600 hover:bg-cyan-700 disabled:bg-cyan-800 disabled:cursor-not-allowed py-3 rounded-md font-bold text-lg flex items-center justify-center transition-colors duration-300"
          >
            {isLoading ? "Saving..." : isEditMode ? "SAVE CHANGES" : "PUBLISH ARTICLE"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddArticlePage;
