import api from "./api"

export interface PostItem {
  title?: string
  content?: string
  imageURL?: string
  tags?: string[]
  [key: string]: unknown
}

export interface PostsResponse {
  data: PostItem[]
  totalPages: number
}

export const getAllPost = async (
  page: number,
  limit: number
): Promise<PostsResponse> => {
  const res = await api.get(`/post?page=${page}&limit=${limit}`)
  return res.data as PostsResponse
}
