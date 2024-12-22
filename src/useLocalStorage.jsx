import { useEffect, useState } from "react";



export function useLocalStorage(initialState,key) {
    const [value, setValue] = useState(function () {
        const x = localStorage.getItem(key);
        return x ? JSON.parse(x) : initialState;
      });

      useEffect(
        function () {
          localStorage.setItem(key, JSON.stringify(value));
        },
        [value,key]
      );
return [value,setValue];
}