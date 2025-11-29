import { fetchUtils } from "react-admin";
import simpleRestProvider from "ra-data-simple-rest";

const API_URL = import.meta.env.VITE_API_URL;

const httpClient = (url: string, options: any = {}) => {
    if (!options.headers) {
        options.headers = new Headers({ Accept: "application/json" });
    }

    // ✅ Додаємо токен до заголовків
    const token = localStorage.getItem("token");
    if (token) {
        options.headers.set("Authorization", `Bearer ${token}`);
    }

    return fetchUtils.fetchJson(url, options).then(response => {
        const { status, headers, body, json } = response;

        return {
            status,
            headers,
            body,
            json,
            data: json,
            total: headers.has("content-range")
                ? parseInt(headers.get("content-range")?.split("/")?.pop() || "0", 10)
                : json.length,
        };
    });
};

//const dataProvider = simpleRestProvider(API_URL, httpClient);

const dataProvider = {
    ...simpleRestProvider(API_URL, httpClient),

    update: async (resource, params) => {
        if (resource === 'product' && 'images' in params.data) {
            const response = await httpClient(`${API_URL}/product/${params.id}/images`, {
                method: 'PATCH',
                body: JSON.stringify({ images: params.data.images }),
            });
            console.log("update resp - " + JSON.stringify(response.json))
            return {
                data: response.json.data // тепер response.json.data містить об'єкт з id
            };
        }

        // Стандартний update для інших ресурсів
        const response = await httpClient(`${API_URL}/${resource}/${params.id}`, {
            method: 'PUT',
            body: JSON.stringify(params.data),
        });
        return { data: response.json };
    },

    // Видалення зображення
    delete: async (resource, params) => {
        if (resource === 'product' && 'image' in params.data) {
            const response = await httpClient(
                `${API_URL}/product/${params.id}/image?image=${encodeURIComponent(params.data.image)}`,
                { method: 'DELETE' }
            );
            return { data: response.json };
        }

        // Стандартний delete для інших ресурсів
        const response = await httpClient(`${API_URL}/${resource}/${params.id}`, {
            method: 'DELETE',
        });
        return { data: response.json };
    },
};


export default dataProvider;
