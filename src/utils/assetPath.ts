const BASE_PATH = "/ra1461392321024";

export const assetPath = (path: string) => {
  if (/^(https?:)?\/\//.test(path)) return path;
  return `${BASE_PATH}/${path.replace(/^\/+/, "")}`;
};
