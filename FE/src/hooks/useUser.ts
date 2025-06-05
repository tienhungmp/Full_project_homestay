import { useQuery } from "@tanstack/react-query";
import { useApi } from "./useApi";


export const useChangePassword = () => {
const { updateData, isLoading, error } = useApi();

const changePassword = async (id: string , infoPassword: {currentPassword: string, newPassword: string}) => {
    const response = await updateData<any>(`users/${id}/change-password`, infoPassword);
    return response;
};

return {
    changePassword,
    isLoading,
    error,
};
}


export const useUpdateUser = () => {
const { updateData, isLoading, error } = useApi();

const updateUser = async (id: string , infoUpdate: {name: string, address?: string, phone?:string}) => {
    const response = await updateData<any>(`users/${id}`, infoUpdate);
    return response;
};

return {
    updateUser,
    isLoading,
    error,
};
}

export const useGetUserIsLogin = () => {
const { fetchData, isLoading, error } = useApi();

const getUserIsLogin = async () => {
    const response = await fetchData<any>(`auth/me`);
    return response;
}
return {
    getUserIsLogin,
    isLoading,
    error,
}
}


export const useUpdateStatusUser = () => {
    const { updateData, isLoading, error } = useApi();
  
    const updateStatusUser = async (infoUpdate: {status: string, idUser: string}) => {
      const response = await updateData<any>(
        `users/update-status`,
         infoUpdate,
      );
      return response;
    };
  
    return {
      updateStatusUser,
      isLoading,
      error,
    };
  };
