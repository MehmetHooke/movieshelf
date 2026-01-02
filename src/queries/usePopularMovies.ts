//queries/usePopularMovies.ts
import { useQuery } from "@tanstack/react-query";
import { getPopularMovies} from "../services/movieService";


export function usePopularMovies(page :number,enabled:boolean){

    return useQuery({
        queryKey: ["popular-movies",page],
        queryFn: ()=> getPopularMovies(page),
        staleTime: 1000*60,
        enabled,
        placeholderData: (prev) => prev, // page değişince liste boşalmasın
    });

}