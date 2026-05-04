export type ApiFetchResult<T = unknown> = {
  ok: boolean;
  status: number;
  data?: T;
  error?: string;
};

export async function apiFetch<T = unknown>(url: string, options?: RequestInit): Promise<ApiFetchResult<T>> {
  try {
    const response = await fetch(url, options);
    const text = await response.text();
    let data: any = null;

    try {
      data = text ? JSON.parse(text) : null;
    } catch {
      data = text;
    }

    if (response.ok) {
      return {
        ok: true,
        status: response.status,
        data,
      };
    }

    return {
      ok: false,
      status: response.status,
      data,
      error: typeof data === 'object' && data?.error ? data.error : 'Error en la petición',
    };
  } catch (error: any) {
    return {
      ok: false,
      status: 0,
      error: error?.message || 'Error de red',
    };
  }
}
