    import { useEffect, useState } from "react";
    const KEY = "5f78c4a5";

    export function useMovies(query,callback) {
    const [movies, setMovies] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [error, setError] = useState("");

    useEffect(
        function () {
            callback?.();
        const controller = new AbortController();
        async function fetchMovie() {
            try {
            setIsOpen(true);
            setError("");

            const res = await fetch(
                `http://www.omdbapi.com/?apikey=${KEY}&s=${query}`,
                { signal: controller.signal }
            );
            if (!res.ok) throw new Error("some times Error net");
            const data = await res.json();
            if (data.Response === "False") throw new Error("Movie not found");
            setMovies(data.Search);
            setError("");
            } catch (error) {
            if (error.name !== "AbortError") {
                setError(error.message);
            }
            } finally {
            setIsOpen(false);
            }
        }
        if (query.length < 3) {
            setError("");
            setMovies([]);
            return;
        }
        //   CloseMovie();
        fetchMovie();
        return function () {
            controller.abort();
        };
        },
        [query]
    );
    return { movies, isOpen, error };
    }
