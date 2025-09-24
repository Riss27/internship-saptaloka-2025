import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { FiPlus, FiEdit, FiTrash2 } from "react-icons/fi";

const ArticlePage = () => {
  const [articles, setArticles] = useState([]);

  const fetchArticles = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/articles");
      setArticles(response.data.data);
    } catch (error) {
      console.error("Gagal mengambil data artikel:", error);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const deleteArticle = async (id) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus artikel ini?")) {
      try {
        await axios.delete(`http://localhost:3000/api/articles/${id}`);
        fetchArticles();
      } catch (error) {
        console.error("Gagal menghapus artikel:", error);
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <header className="flex flex-col md:flex-row justify-between md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Manage Articles</h1>
          <p className="text-slate-400 mt-1">Buat, edit, atau hapus artikel untuk website.</p>
        </div>
        <Link to="/articles/add" className="bg-cyan-600 hover:bg-cyan-700 px-5 py-2 rounded-md font-semibold text-white no-underline whitespace-nowrap flex items-center justify-center transition-colors duration-300">
          <FiPlus className="mr-2" /> Add New Article
        </Link>
      </header>

      <main>
        <div className="bg-slate-800/50 rounded-lg shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-slate-300">
              <thead className="bg-slate-900/50">
                <tr className="border-b border-slate-700">
                  <th className="p-4 font-semibold">Featured Image</th>
                  <th className="p-4 font-semibold">Title</th>
                  <th className="p-4 font-semibold">Author</th>
                  <th className="p-4 font-semibold text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {articles.map((article) => (
                  <tr key={article.id} className="border-b border-slate-700 hover:bg-slate-800 transition-colors duration-200">
                    <td className="p-4 align-middle">
                      <img src={`http://localhost:3000${article.featuredImageUrl}`} alt={article.title} className="h-16 w-32 object-cover rounded-md border-2 border-slate-600" />
                    </td>
                    <td className="p-4 align-middle font-medium text-white">{article.title}</td>
                    <td className="p-4 align-middle">{article.author}</td>
                    <td className="p-4 align-middle text-center">
                      <Link to={`/articles/edit/${article.id}`} className="inline-block p-2 text-yellow-400 hover:text-yellow-300 hover:bg-yellow-500/10 rounded-full transition-colors duration-200 mr-2">
                        <FiEdit size={18} />
                      </Link>
                      <button onClick={() => deleteArticle(article.id)} className="p-2 text-red-500 hover:text-red-400 hover:bg-red-500/10 rounded-full transition-colors duration-200">
                        <FiTrash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ArticlePage;
