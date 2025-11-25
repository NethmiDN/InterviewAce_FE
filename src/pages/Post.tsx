import { useCallback, useEffect, useState } from "react"
import { getAllPost, type PostsResponse, type PostItem } from "../services/post"

export default function Post() {
  const [page, setPage] = useState(1)
  const [posts, setPosts] = useState<PostItem[]>([])
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(false)

  const fetchPost = useCallback(async () => {
    try {
      setLoading(true)
      const data: PostsResponse = await getAllPost(page, 10)
      setPosts(data.data || [])
      setTotalPages(data.totalPages || 1)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [page])

  useEffect(() => {
    fetchPost()
  }, [fetchPost])

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 text-light_text dark:text-lavender_grey-900">
      <h2 className="text-3xl font-bold text-center mb-8 text-light_text dark:text-brandText drop-shadow-sm">
        All Posts
      </h2>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="w-10 h-10 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
        </div>
      ) : posts.length === 0 ? (
        <p className="text-center text-gray-500">No posts available.</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post, index) => (
            <div
              key={index}
              className="rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden flex flex-col bg-white border border-gray-200 dark:bg-gradient-panel dark:border-twilight_indigo-300/40 backdrop-blur-sm"
            >
              {post?.imageURL && (
                <img
                  src={post.imageURL}
                  alt={post?.title}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-5 flex flex-col flex-grow">
                <h3 className="text-xl font-semibold text-light_text dark:text-brandText mb-2">
                  {post?.title}
                </h3>
                <p className="text-light_text dark:text-blue_slate-800 mb-3 line-clamp-3 flex-grow">
                  {post?.content}
                </p>
                <div className="flex flex-wrap gap-2 mt-auto">
                  {post?.tags?.map((tag: string, i: number) => (
                    <span
                      key={i}
                      className="text-xs tracking-wide bg-smart_blue-600/10 text-smart_blue-700 px-3 py-1 rounded-full border border-smart_blue-600/30 backdrop-blur-sm dark:bg-smart_blue-600/20 dark:text-smart_blue-600 dark:border-smart_blue-600/40"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      <div className="flex justify-center items-center gap-4 mt-10">
        <button
          disabled={page === 1}
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          className={`px-5 py-2 rounded-lg border text-sm font-medium transition ${
            page === 1
              ? "text-gray-400 border-gray-200 cursor-not-allowed"
              : "text-gray-700 border-gray-300 hover:bg-gray-100"
          }`}
        >
          Prev
        </button>

        <span className="text-light_text dark:text-blue_slate-800 text-sm">
          Page <span className="font-semibold">{page}</span> of{" "}
          <span className="font-semibold">{totalPages}</span>
        </span>

        <button
          disabled={page === totalPages}
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          className={`px-5 py-2 rounded-lg border text-sm font-medium transition ${
            page === totalPages
              ? "text-slate_grey-600 border-slate_grey-600/30 cursor-not-allowed"
              : "text-light_text border-gray-300 hover:bg-gray-100 dark:text-light_cyan-900 dark:border-twilight_indigo-300/50 dark:hover:bg-smart_blue-600/20"
          }`}
        >
          Next
        </button>
      </div>
    </div>
  )
}
