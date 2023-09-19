import { useContext } from "react";
import { ApiUrls } from "../utils/urls";
import { MainScreenContext } from "../contexts/MainScreenContext";
import { Menu } from "../contexts/MainScreenContext";

const useMenuFetcher = () => {
  const { setMenu, setError, setMenuFetched } = useContext(MainScreenContext);

  const fetchMenu = async () => {
    console.log("fetch menu called");
    setMenuFetched(false); // for refreshing - to know when to start/stop animation

    try {
      // promise that will ensure that after 6 seconds fetch will stop waiting
      const timeoutPromise = new Promise((resolve, reject) => {
        setTimeout(() => reject(new Error("Request timed out")), 6000);
      });

      // promise that fetches data and sets it to MainScreenContext on success
      const fetchPromise = fetch(ApiUrls.GET_MENU)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Server responded with an unwanted response code");
          }
          return response.json();
        })
        .then((data) => {
          const menuData: Menu = {
            pizzaList: data.pizzaList,
            drinkList: data.drinkList,
          };
          setError("");
          setMenu(menuData);
          setMenuFetched(true); // for refreshing - to know when to stop animation
        });

      // whichever promise resolves quicker, the other will be terminated
      await Promise.race([fetchPromise, timeoutPromise]);
    } catch (error: any) {
      console.log("catch block: ", error);
      if (error instanceof Error) {
        // set error to the message of the error
        const errorMessage = error.message.replace(/\[|\]/g, "");
        setError(errorMessage);
      } else {
        // if the error is somehow different from the custom specified above - show it
        setError("Undentified error occurred");
      }
    }
  };

  // Return the fetchMenu function
  return {
    fetchMenu,
  };
};

export default useMenuFetcher;
