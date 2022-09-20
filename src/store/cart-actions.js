import { uiActions } from "./ui-slice";
import { cartActions } from "./cart-slice";

export const sendCartData = (cart) => {
	return async (dispatch) => {
		dispatch(
			uiActions.showNotification({
				status: "pending",
				title: "Sending...",
				message: "Sending cart data!",
			})
		);

		//add new object in body to not send state "changed" to firebase
		const sendRequest = async () => {
			const response = await fetch(
				"https://redux-cart-1100c-default-rtdb.firebaseio.com/cart.json",
				{
					method: "PUT",
					body: JSON.stringify({
						items: cart.items,
						totalQuantity: cart.totalQuantity,
					}),
				}
			);
			if (!response.ok) {
				throw new Error("Sending cart data failed.");
			}
		};

		try {
			await sendRequest();
			dispatch(
				uiActions.showNotification({
					status: "success",
					title: "Success!",
					message: "Sending cart data successfully",
				})
			);
		} catch (error) {
			dispatch(
				uiActions.showNotification({
					status: "error",
					title: "Error!",
					message: "Sending cart data failed",
				})
			);
		}
	};
};

export const fetchCartData = () => {
	return async (dispatch) => {
		const fetchData = async () => {
			const response = await fetch(
				"https://redux-cart-1100c-default-rtdb.firebaseio.com/cart.json"
			);

			if (!response.ok) {
				throw new Error("Sending cart data failed.");
			}

			const data = await response.json();

			return data;
		};
		try {
			const cartData = await fetchData();
			dispatch(
				cartActions.replaceCart({
					items: cartData.items || [],
					totalQuantity: cartData.totalQuantity,
				})
			);
		} catch (error) {
			console.log("error from fetch");
			dispatch(
				uiActions.showNotification({
					status: "error",
					title: "Error!",
					message: "Sending cart data failed",
				})
			);
		}
	};
};
