import { useApi } from "./useApi";


export const useCreateFavorite  = () => {
    const { createData, isLoading, error } = useApi();

    const createFavorite = async (idHomestay: string) => {
        const response = await createData<any>(`/favorites/${idHomestay}`, {});
        return response;
      };

      return {
        createFavorite,
        isLoading,
        error,
      };
}


export const useRemoveFavorite  = () => {
    const { deleteData, isLoading, error } = useApi();

    const removeFavorite = async (idHomestay: string) => {
        const response = await deleteData<any>(`/favorites/${idHomestay}`);
        return response;
      };

      return {
        removeFavorite,
        isLoading,
        error,
      };
}


export const useCheckFavorites = () => {
    const { fetchData, isLoading, error } = useApi();
  
    const checkFavorites = async (idHomestay: string) => {
      const response = await fetchData<any>(`/favorites/${idHomestay}/check`);
      return response;
    };
    
    return {
       checkFavorites
    }
  };


  export const useFavorites = () => {
    const { fetchData, isLoading, error } = useApi();
  
    const getFavorites = async () => {
      const response = await fetchData<any>(`/favorites`);
      return response;
    };
    
    return {
      getFavorites
    }
  };