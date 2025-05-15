import { useApi } from "./useApi";



export const useCreateReviewUser  = () => {
    const { createData, isLoading, error } = useApi();

    const createReviewUser = async (reviewInfo: {textReview: string, rating: number, homestayId: string, userId: string}) => {
        const response = await createData<any>('/reviews', reviewInfo);
        return response;
      };

      return {
        createReviewUser,
        isLoading,
        error,
      };
}
