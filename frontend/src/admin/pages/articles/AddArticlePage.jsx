import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import apiClient from "../../../hooks/apiClient";

// TAMBAHKAN import untuk DatePicker
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

// TAMBAHKAN Calendar untuk ikon
import {
  Type,
  User,
  Image as ImageIcon,
  Plus,
  Trash2,
  X,
  Upload,
  Calendar,
} from "lucide-react";
import RichTextEditor from "../../components/RichTextEditor";
import API_BASE from "../../../lib/apiBase";

const InputField = ({
  label,
  name,
  value,
  onChange,
  type = "text",
  placeholder,
  icon,
  required = false,
}) => (
  <div className="mb-6">
    <label className="block mb-2 font-medium text-cream/80 transition-colors duration-300 focus-within:text-brand-400">
      {label}
    </label>
    <div className="relative">
      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-cream/60">
        {icon}
      </span>
      {type === "textarea" ? (
        <textarea
          name={name}
          value={value || ""}
          onChange={onChange}
          rows="8"
          placeholder={placeholder}
          required={required}
          className="w-full min-h-11 p-2 pl-10 bg-brand-800 border border-border rounded-md transition duration-300 ease-in-out focus:outline-none focus:border-brand-400"
        />
      ) : (
        <input
          type={type}
          name={name}
          value={value || ""}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className="w-full min-h-11 p-2 pl-10 bg-brand-800 border border-border rounded-md transition duration-300 ease-in-out focus:outline-none focus:border-brand-400"
        />
      )}
    </div>
  </div>
);

const AddArticlePage = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  // UBAH: Tambahkan `publishedAt` ke state awal
  const [article, setArticle] = useState({
    title: "",
    author: "",
    mainDescription: "",
    publishedAt: new Date(),
  });

  const [contents, setContents] = useState([
    { topic: "", description: "", images: [], previews: [] },
  ]);
  const [featuredImage, setFeaturedImage] = useState(null);
  const [previewFeaturedImage, setPreviewFeaturedImage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const isEditMode = Boolean(id);

  useEffect(() => {
    if (isEditMode) {
      setIsLoading(true);
      apiClient
        .get(`/api/articles/${id}`)
        .then((response) => {
          const fetchedArticle = response.data.data;
          setArticle({
            title: fetchedArticle.title,
            author: fetchedArticle.author,
            mainDescription: fetchedArticle.mainDescription,
            // UBAH: Tambahkan `publishedAt` dari data fetch
            publishedAt: fetchedArticle.publishedAt
              ? new Date(fetchedArticle.publishedAt)
              : new Date(),
          });
          if (fetchedArticle.featuredImageUrl) {
            setPreviewFeaturedImage(
              `${API_BASE}${fetchedArticle.featuredImageUrl}`,
            );
          }
          if (
            fetchedArticle.ArticleContents &&
            fetchedArticle.ArticleContents.length > 0
          ) {
            const fetchedContents = fetchedArticle.ArticleContents.map(
              (content) => {
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
                  previews: imageUrls.map((url) => `${API_BASE}${url}`),
                };
              },
            );
            setContents(fetchedContents);
          }
        })
        .catch((error) => {
          console.error("Gagal mengambil detail artikel:", error);
        })
        .finally(() => setIsLoading(false));
    }
  }, [id, isEditMode]);

  const handleArticleChange = (e) =>
    setArticle((prev) => ({ ...prev, [e.target.name]: e.target.value }));

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
      const newPreviews = newImages.map((img) =>
        typeof img === "string"
          ? `${API_BASE}${img}`
          : URL.createObjectURL(img),
      );

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

  const addContentSection = () =>
    setContents([
      ...contents,
      { topic: "", description: "", images: [], previews: [] },
    ]);
  const removeContentSection = (index) =>
    setContents(contents.filter((_, i) => i !== index));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const submissionData = new FormData();
    // Semua state di `article` otomatis ter-append, termasuk `publishedAt`
    Object.keys(article).forEach((key) =>
      submissionData.append(key, article[key]),
    );

    if (featuredImage) {
      submissionData.append("featuredImage", featuredImage);
    }

    const contentData = contents.map((c) => {
      const newImageFiles = c.images.filter((img) => typeof img !== "string");
      const existingImageUrls = c.images.filter(
        (img) => typeof img === "string",
      );
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
        await apiClient.put(`/api/articles/${id}`, submissionData, config);
      } else {
        await apiClient.post("/api/articles", submissionData, config);
      }
      navigate("/admin/articles");
    } catch (error) {
      console.error(
        "Gagal menyimpan artikel:",
        error.response?.data || error.message,
      );
      alert("Gagal menyimpan. Pastikan semua kolom wajib diisi.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto text-cream">
      <header className="flex flex-col items-start gap-4 sm:flex-row sm:justify-between sm:items-center mb-8">
        <h1 className="text-3xl font-bold">
          {isEditMode ? "Edit Article" : "Add New Article"}
        </h1>
        <Link
          to="/admin/articles"
          className="bg-red-600 hover:bg-red-700 px-5 py-2 min-h-11 inline-flex items-center rounded-md font-semibold text-cream no-underline"
        >
          BACK
        </Link>
      </header>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-brand-800/50 p-4 sm:p-8 rounded-lg ">
          <h2 className="text-2xl font-semibold mb-6 border-b border-border pb-4">
            Main Article Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <InputField
                label="Article Title"
                name="title"
                value={article.title}
                onChange={handleArticleChange}
                required={true}
                placeholder="Judul utama artikel..."
                icon={<Type aria-hidden="true" className="w-5 h-5" />}
              />
              <InputField
                label="Author"
                name="author"
                value={article.author}
                onChange={handleArticleChange}
                required={true}
                placeholder="Nama penulis..."
                icon={<User aria-hidden="true" className="w-5 h-5" />}
              />

              {/* TAMBAHKAN: Komponen DatePicker */}
              <div className="mb-6">
                <label className="block mb-2 font-medium text-cream/80 transition-colors duration-300 focus-within:text-brand-400">
                  Publication Date
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-cream/60">
                    <Calendar aria-hidden="true" className="w-5 h-5" />
                  </span>
                  <DatePicker
                    selected={
                      article.publishedAt
                        ? new Date(article.publishedAt)
                        : new Date()
                    }
                    onChange={(date) =>
                      setArticle((prev) => ({ ...prev, publishedAt: date }))
                    }
                    dateFormat="MMMM d, yyyy h:mm aa"
                    showTimeSelect
                    className="w-full min-h-11 p-2 pl-10 bg-brand-800 border border-border rounded-md transition duration-300 ease-in-out focus:outline-none focus:border-brand-400"
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="block mb-2 font-medium text-cream/80 transition-colors duration-300 focus-within:text-brand-400">
                  Main Description
                </label>
                <RichTextEditor
                  content={article.mainDescription}
                  onUpdate={(value) =>
                    setArticle((prev) => ({ ...prev, mainDescription: value }))
                  }
                  placeholder="Deskripsi pembuka artikel..."
                  maxLength={5000}
                />
              </div>
            </div>
            <div>
              <label className="mb-2 font-medium text-cream/80 flex items-center gap-2">
                <ImageIcon
                  aria-hidden="true"
                  className="w-5 h-5 text-brand-400"
                />
                Featured Image
              </label>
              <div className="relative group">
                <input
                  type="file"
                  id="featured-upload"
                  name="featuredImage"
                  onChange={handleFeaturedImageChange}
                  className="hidden"
                  accept="image/*"
                  required={!isEditMode}
                />
                <label
                  htmlFor="featured-upload"
                  className="flex flex-col justify-center items-center w-full h-64 border-2 border-dashed border-border rounded-xl bg-brand-800 cursor-pointer hover:border-brand-400 hover:bg-brand-900 transition-all duration-300 overflow-hidden"
                >
                  {previewFeaturedImage ? (
                    <div className="relative w-full h-full">
                      <img
                        src={previewFeaturedImage}
                        alt="Featured Preview"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center">
                        <Upload
                          aria-hidden="true"
                          className="w-10 h-10 text-cream mb-2"
                        />
                        <span className="text-cream font-semibold">
                          Click to change image
                        </span>
                        <span className="text-cream/80 text-sm mt-1">
                          PNG, JPG up to 10MB
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center p-6">
                      <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-brand-800 flex items-center justify-center">
                        <Upload
                          aria-hidden="true"
                          className="w-10 h-10 text-brand-400"
                        />
                      </div>
                      <span className="block text-cream/80 font-semibold mb-1">
                        Click to upload featured image
                      </span>
                      <span className="text-cream/60 text-sm">
                        or drag and drop
                      </span>
                      <p className="text-cream/70 text-xs mt-2">
                        PNG, JPG up to 10MB
                      </p>
                    </div>
                  )}
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-brand-800/50 p-4 sm:p-8 rounded-lg ">
          <h2 className="text-2xl font-semibold mb-6 border-b border-border pb-4">
            Content Sections
          </h2>
          <div className="space-y-6">
            {contents.map((content, index) => (
              <div
                key={index}
                className="bg-brand-800 border border-border rounded-lg p-6 relative"
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-brand-400 text-lg">
                    Section {index + 1}
                  </h3>
                  <button
                    type="button"
                    onClick={() => removeContentSection(index)}
                    className="min-h-11 min-w-11 grid place-items-center p-1 text-red-500 text-red-400 bg-red-500/10 rounded-full"
                    aria-label={`Hapus section ${index + 1}`}
                  >
                    <Trash2 aria-hidden="true" className="w-5 h-5" />
                  </button>
                </div>
                <InputField
                  label="Topic"
                  name="topic"
                  value={content.topic}
                  onChange={(e) => handleContentChange(index, e)}
                  required={true}
                  placeholder="Judul sub-konten..."
                  icon={<Type aria-hidden="true" className="w-5 h-5" />}
                />
                <div className="mb-6">
                  <label className="block mb-2 font-medium text-cream/80">
                    Description
                  </label>
                  <RichTextEditor
                    content={content.description}
                    onUpdate={(value) => {
                      const newContents = [...contents];
                      newContents[index].description = value;
                      setContents(newContents);
                    }}
                    placeholder="Isi sub-konten..."
                    maxLength={10000}
                  />
                </div>
                <div className="mb-2">
                  <label className="block mb-2 font-medium text-cream/80">
                    Images
                  </label>
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4 min-h-[7rem] bg-brand-800/70 p-4 rounded-md">
                    {content.previews.map((previewUrl, i) => (
                      <div key={i} className="relative group aspect-square">
                        <img
                          src={previewUrl}
                          alt={`Preview ${i}`}
                          className="h-full w-full object-cover rounded-md border-2 border-border"
                        />
                        <button
                          type="button"
                          onClick={() => removeContentImage(index, i)}
                          className="absolute -top-2 -right-2 min-h-11 min-w-11 grid place-items-center p-1 bg-red-600 text-cream rounded-full opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity"
                          aria-label="Hapus gambar"
                        >
                          <X aria-hidden="true" className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    <label className="flex flex-col justify-center items-center w-full h-full border-2 border-dashed border-border rounded-md cursor-pointer hover:border-brand-400 bg-brand-700/50 transition-colors">
                      <Upload
                        aria-hidden="true"
                        className="w-5 h-5 text-cream/60"
                      />
                      <span className="text-xs text-cream/60 mt-1">
                        Add more
                      </span>
                      <input
                        type="file"
                        name="contentImages"
                        onChange={(e) => handleContentImageChange(index, e)}
                        multiple
                        className="opacity-0 w-0 h-0"
                      />
                    </label>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={addContentSection}
            className="w-full mt-6 border-2 border-dashed border-border border-brand-500 text-cream/80 text-brand-400 py-3 rounded-md font-semibold flex items-center justify-center transition-colors"
          >
            <Plus aria-hidden="true" className="w-5 h-5 mr-2" /> Add Content
            Section
          </button>
        </div>

        <div className="mt-8">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-brand-600 hover:bg-brand-500 disabled:bg-brand-800 disabled:cursor-not-allowed py-3 rounded-md font-bold text-lg flex items-center justify-center transition-colors duration-300"
          >
            {isLoading
              ? "Saving..."
              : isEditMode
                ? "SAVE CHANGES"
                : "PUBLISH ARTICLE"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddArticlePage;
