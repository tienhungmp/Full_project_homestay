import { useQuery } from "@tanstack/react-query";
import { useApi } from "./useApi";
import { useState } from "react";



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


export const useGetReviewsByHostId = () => {
  const { fetchData, isLoading, error } = useApi();

  const getGetReviewsByHostId = async () => {
    const response = await fetchData<any>(`/reviews/getReviewByHostId`);
    return response;
  };

  return {
    getGetReviewsByHostId,
    isLoading,
    error,
  };
};