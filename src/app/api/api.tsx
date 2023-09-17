import axios from "axios";

const saavnApi = axios.create({
  baseURL: "https://saavn.me",
  headers: {
    "Content-Type": "application/json",
  },
});

export async function searchAlbums(query: string) {
  const response = await saavnApi.get("/search/albums?query=" + query);
  return response.data;
}
export async function getAlbumDetails(id: number) {
  const response = await saavnApi.get("/albums?id=" + id);
  return response.data;
}

export async function searchArtists(query: string) {
  const response = await saavnApi.get("/search/artists?query=" + query);
  return response.data;
}

export async function getArtistDetails(id: number, pageNo: number) {
  const response = await saavnApi.get(`/artists/${id}/songs?page=${pageNo}`);
  return response.data;
}

export async function SearchSong(query: string) {
  const response = await saavnApi.get(
    `/search/songs?query=${query}&page=1&limit=5`
  );
  return response.data;
}
