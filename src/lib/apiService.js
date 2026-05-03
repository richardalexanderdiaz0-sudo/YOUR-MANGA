import axios from 'axios';

const BASE_URL = 'https://x8ki-letl-twmt.n7.xano.io/api:manga-reader';

// Usamos interceptors para manejar posibles errores o inyectar headers futuros (como auth token de xano si existiera, pero usaremos email de firebase para validación según requerido)
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// GET /manga_work
export const fetchObras = async (params = {}) => {
  try {
    const response = await api.get('/manga_work', { params });
    // Aseguramos que retorne un arreglo, si Xano retorna objeto con items usar eso.
    return Array.isArray(response.data) ? response.data : response.data?.items || [];
  } catch (error) {
    console.error("Error fetching obras from Xano:", error);
    return []; // Retornar vacío en vez de romper la app
  }
};

// GET /manga_work/{id}
export const fetchObraById = async (id) => {
  try {
    const response = await api.get(`/manga_work/${id}`);
    return response.data;
  } catch (err) {
    console.warn("Direct /manga_work/{id} failed, trying filter", err);
    const all = await fetchObras();
    return all.find(o => String(o.id) === String(id)) || null;
  }
};

// GET /manga_chapter 
export const fetchChapters = async (work_id) => {
  try {
    const response = await api.get(`/manga_chapter`, { params: { work_id } });
    return Array.isArray(response.data) ? response.data : response.data?.items || [];
  } catch (error) {
    console.error("Error fetching chapters:", error);
    return [];
  }
};

// GET /manga_library
export const fetchLibrary = async (userEmail) => {
  if (!userEmail) return [];
  try {
    const response = await api.get('/manga_library', { params: { user_identifier: userEmail } });
    return Array.isArray(response.data) ? response.data : response.data?.items || [];
  } catch (error) {
    console.error("Error fetching library:", error);
    return [];
  }
};

// POST /manga_library - add to library
export const addToLibrary = async (work_id, userEmail) => {
  if (!userEmail) return;
  try {
    await api.post('/manga_library', { work_id, user_identifier: userEmail });
  } catch (error) {
    console.error("Error adding to library:", error);
  }
};

// POST /manga_interaction
export const postInteraction = async (data) => {
  try {
    const response = await api.post('/manga_interaction', data);
    return response.data;
  } catch (error) {
    console.error("Error posting interaction:", error);
    throw error;
  }
};

// POST /admin/publish-work
export const publishWork = async (data, adminEmail) => {
  try {
    const response = await api.post('/admin/publish-work', { ...data, admin_email: adminEmail });
    return response.data;
  } catch (error) {
    console.error("Error publishing work:", error);
    throw error;
  }
};

// POST /admin/add-chapter
export const addChapter = async (data, adminEmail) => {
  try {
    const response = await api.post('/admin/add-chapter', { ...data, admin_email: adminEmail });
    return response.data;
  } catch (error) {
    console.error("Error adding chapter:", error);
    throw error;
  }
};
