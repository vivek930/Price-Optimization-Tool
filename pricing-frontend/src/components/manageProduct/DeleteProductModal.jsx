import { Button, Divider, Modal, Stack, Typography } from "@mui/material";
import { X } from "lucide-react";
import React from "react";
import { COLOR } from "../../constants/Constants";
import { useDispatch, useSelector } from "react-redux";
import { closeDeleteProductModal } from "../../store/slices/modalsSlice";
import { deleteProductRequested } from "../../store/slices/productsSlice";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  bgcolor: "#111", // dark background
  color: "#fff",
  borderRadius: "8px",
  boxShadow: 24,
  p: 3,
};

const DeleteProductModal = () => {
  const dispatch = useDispatch();

  const isDeleteModalOpen = useSelector(
    (store) => store.modals.isDeleteProductModalOpen
  );

  const productToUpdate = useSelector((store) => store.modals.productToUpdate);

  const handleModalClose = () => {
    dispatch(closeDeleteProductModal());
  };

  const handleDelete = () => {
    const productId = productToUpdate.id;
    const productName = productToUpdate.name;
    dispatch(deleteProductRequested({ productId, productName }));
    handleModalClose();
  };

  return (
    <Modal
      open={isDeleteModalOpen}
      onClose={handleModalClose}
      aria-labelledby="delete-product-title"
    >
      <Stack sx={style} spacing={"16px"}>
        {/* Header */}
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          mb={2}
        >
          <Typography color={COLOR.neon_green} fontSize="18px" fontWeight={600}>
            Delete Product
          </Typography>
          <X
            size={20}
            strokeWidth={5}
            color={COLOR.neon_green}
            style={{ cursor: "pointer" }}
            onClick={handleModalClose}
          />
        </Stack>

        <Divider
          sx={{
            backgroundColor: "white",
            width: "100%",
          }}
        />

        {/* Form */}
        <Stack spacing={3}>
          <Typography color="#fff" fontSize={"16px"} fontWeight={600}>
            Do you want to delete product {productToUpdate.name}?
          </Typography>

          {/* Footer buttons */}
          <Stack direction="row" justifyContent="flex-end" spacing={2}>
            <Button
              onClick={handleModalClose}
              variant="outlined"
              sx={{
                color: "#fff",
                borderColor: COLOR.neon_green,
                textTransform: "none",
                "&:hover": { borderColor: "#fff" },
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleDelete}
              type="submit"
              variant="contained"
              sx={{
                background: COLOR.neon_green,
                color: "#000",
                textTransform: "none",
                "&:hover": { background: "#4fffac" },
              }}
            >
              Yes
            </Button>
          </Stack>
        </Stack>
      </Stack>
    </Modal>
  );
};

export default DeleteProductModal;
