import { useSnackbar } from "notistack";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { removeNotification } from "../store/slices/snackbarSlice";

/**
 * Listens for snackbar messages from Redux
 * and shows them using notistack.
 */

const SnackbasrListener = () => {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  // Grab snackbar messages from Redux store
  const messages = useSelector((state) => state.snackbar.messages);

  useEffect(() => {
    messages.forEach((msg) => {
      enqueueSnackbar(msg.text, { variant: msg.variant || "info" });
      dispatch(removeNotification(msg.id));
    });
  }, [messages, enqueueSnackbar, dispatch]);

  // Does not render any visible UI
  return null;
};

export default SnackbasrListener;
