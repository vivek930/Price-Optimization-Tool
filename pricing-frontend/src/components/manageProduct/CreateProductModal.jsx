import {
  Button,
  Divider,
  InputLabel,
  MenuItem,
  Modal,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import {
  CATEGORY,
  COLOR,
  INITIAL_PRODUCT_DETAIL_FORM,
} from "../../constants/Constants";
import { ChevronDown, ChevronUp, X } from "lucide-react";
import {
  createProductRequested,
  updateProductRequested,
} from "../../store/slices/productsSlice";
import { useDispatch, useSelector } from "react-redux";
import {
  closeCreateProductModal,
  closeUpdateProductModal,
} from "../../store/slices/modalsSlice";

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

const CreateProductModal = ({ isUpdate = false }) => {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(INITIAL_PRODUCT_DETAIL_FORM);

  // Local state for field-level errors
  const [errors, setErrors] = useState(INITIAL_PRODUCT_DETAIL_FORM);

  const productToUpdate = useSelector((store) => store.modals.productToUpdate);

  useEffect(() => {
    if (isUpdate && productToUpdate) {
      setForm({
        name: productToUpdate.name || "",
        description: productToUpdate.description || "",
        category: productToUpdate.category || "",
        cost_price: productToUpdate.cost_price || "",
        selling_price: productToUpdate.selling_price || "",
        stock_available: productToUpdate.stock_available || "",
        units_sold: productToUpdate.units_sold || "",
      });
    }
  }, [isUpdate, productToUpdate]);

  const handleModalClose = () => {
    setForm(INITIAL_PRODUCT_DETAIL_FORM);

    if (isUpdate) {
      dispatch(closeUpdateProductModal());
    } else {
      dispatch(closeCreateProductModal());
    }
  };

  const isCreateOpen = useSelector(
    (store) => store.modals.isCreateProductModalOpen
  );
  const isUpdateOpen = useSelector(
    (store) => store.modals.isUpdateProductModalOpen
  );

  // Validation functions
  const validateProductName = (name) => {
    if (!name.trim()) {
      return "Product Name is required";
    }
    if (name.trim().length > 30) {
      return "Product Name must be less than 30 characters";
    }
    return "";
  };

  const validateDescription = (description) => {
    if (!description.trim()) {
      return "Product description is required";
    }
    if (description.trim().length > 300) {
      return "Product description must be less than 300 characters";
    }
    return "";
  };

  const validateProductCategory = (category) => {
    if (!category.trim()) {
      return "Product category is required";
    }

    return "";
  };

  const validateCostPrice = (cost_price) => {
    console.log("cost_price type in testing: ", typeof cost_price);

    if (!cost_price) {
      return "Cost Price is required";
    }

    // Convert to number for decimal comparison
    const costNum = parseFloat(cost_price);
    const sellingNum = parseFloat(form.selling_price);

    // Check if it's a valid number
    if (isNaN(costNum)) {
      return "Please provide valid cost price.";
    }

    if (costNum < 0) {
      return "Please provide valid cost price.";
    }

    // Decimal comparison - both numbers are now floats
    if (form.selling_price && !isNaN(sellingNum) && costNum > sellingNum) {
      return "Cost Price must be lesser than Selling Price";
    }

    return "";
  };

  const validateSellingPrice = (selling_price) => {
    if (!selling_price) {
      return "Selling Price is required";
    }

    // Convert to number for decimal comparison
    const costNum = parseFloat(form.cost_price);
    const sellingNum = parseFloat(selling_price);

    if (isNaN(sellingNum)) {
      return "Please provide valid selling price.";
    }

    if (sellingNum < 0) {
      return "Please provide valid selling price.";
    }

    // Decimal comparison - both numbers are now floats
    if (form.cost_price && !isNaN(costNum) && costNum > sellingNum) {
      return "Selling Price must be greater than Cost Price";
    }

    return "";
  };

  const validateAvailableStock = (stock_available) => {
    if (!stock_available) {
      return "Available stock detail is required";
    }

    const stockNum = parseFloat(stock_available);
    if (isNaN(stockNum)) {
      return "Please provide valid available stock detail.";
    }

    if (stockNum < 0) {
      return "Please provide valid available stock detail.";
    }

    return "";
  };

  const validateUnitSold = (units_sold) => {
    if (!units_sold) {
      return "Unit sold detail is required";
    }

    const unitsNum = parseFloat(units_sold);
    if (isNaN(unitsNum)) {
      return "Please provide valid unit sold detail.";
    }

    if (unitsNum < 0) {
      return "Please provide valid unit sold detail.";
    }

    return "";
  };

  const onChange = (field) => (e) => {
    const value = e.target.value;
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

    // Clear error when user starts typing
    if (errors[field] && value) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }

    // Clear related field errors for price fields
    if (field === "cost_price" && errors.selling_price && value) {
      setErrors((prev) => ({ ...prev, selling_price: "" }));
    }
    if (field === "selling_price" && errors.cost_price && value) {
      setErrors((prev) => ({ ...prev, cost_price: "" }));
    }
  };

  // Handle field blur events for validation
  const handleFieldBlur = (field, value) => {
    let fieldError = "";

    switch (field) {
      case "name":
        fieldError = validateProductName(value);
        break;
      case "category":
        fieldError = validateProductCategory(value);
        break;
      case "cost_price":
        fieldError = validateCostPrice(value);
        // Also validate selling price if it exists
        if (form.selling_price && !fieldError) {
          const sellingError = validateSellingPrice(form.selling_price);
          if (!sellingError) {
            setErrors((prev) => ({ ...prev, selling_price: "" }));
          }
        }
        break;
      case "selling_price":
        fieldError = validateSellingPrice(value);
        // Also validate cost price if it exists
        if (form.cost_price && !fieldError) {
          const costError = validateCostPrice(form.cost_price);
          if (!costError) {
            setErrors((prev) => ({ ...prev, cost_price: "" }));
          }
        }
        break;
      case "description":
        fieldError = validateDescription(value);
        break;
      case "units_sold":
        fieldError = validateUnitSold(value);
        break;
      case "stock_available":
        fieldError = validateAvailableStock(value);
        break;
      default:
        break;
    }

    setErrors((prev) => ({ ...prev, [field]: fieldError }));
  };

  const onSubmit = (e) => {
    e.preventDefault();

    // Validate all fields before submission
    const nameError = validateProductName(form.name);
    const categoryError = validateProductCategory(form.category);
    const costError = validateCostPrice(form.cost_price);
    const sellingError = validateSellingPrice(form.selling_price);
    const descriptionError = validateDescription(form.description);
    const availableStockError = validateAvailableStock(form.stock_available);
    const unitSoldError = validateUnitSold(form.units_sold);

    setErrors({
      name: nameError,
      category: categoryError,
      cost_price: costError,
      selling_price: sellingError,
      description: descriptionError,
      units_sold: unitSoldError,
      stock_available: availableStockError,
    });

    if (
      !nameError &&
      !categoryError &&
      !costError &&
      !sellingError &&
      !descriptionError &&
      !unitSoldError &&
      !availableStockError
    ) {
      if (isUpdate) {
        dispatch(
          updateProductRequested({ productId: productToUpdate.id, form })
        );
      } else {
        dispatch(createProductRequested(form));
      }
      handleModalClose();
    }
  };

  return (
    <Modal
      open={isUpdate ? isUpdateOpen : isCreateOpen}
      onClose={handleModalClose}
      aria-labelledby="product-modal-title"
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
            {isUpdate ? "Update Product" : "Add New Products"}
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
        <form onSubmit={onSubmit}>
          <Stack spacing={2}>
            <Stack spacing={1}>
              <InputLabel sx={{ color: "#aaa" }}>Product Name :</InputLabel>
              <TextField
                size="small"
                variant="filled"
                autoComplete="off"
                value={form.name}
                onChange={onChange("name")}
                onBlur={() => handleFieldBlur("name", form.name)}
                error={!!errors.name}
                helperText={errors.name}
              />
            </Stack>

            <Stack spacing={1}>
              <InputLabel sx={{ color: "#aaa" }}>Product Category :</InputLabel>
              <TextField
                select
                size="small"
                variant="filled"
                autoComplete="off"
                value={form.category}
                onChange={onChange("category")}
                onBlur={() => handleFieldBlur("category", form.category)}
                error={!!errors.category}
                helperText={errors.category}
                slotProps={{
                  select: {
                    open,
                    onOpen: () => setOpen(true),
                    onClose: () => setOpen(false),
                    IconComponent: () =>
                      open ? (
                        <ChevronUp
                          color={COLOR.neon_green}
                          size="24px"
                          style={{ marginRight: "8px" }}
                        />
                      ) : (
                        <ChevronDown
                          color={COLOR.neon_green}
                          size="24px"
                          style={{ marginRight: "8px" }}
                        />
                      ),
                  },
                }}
              >
                {React.useMemo(
                  () =>
                    CATEGORY.map((option, index) => (
                      <MenuItem key={index} value={option}>
                        {option}
                      </MenuItem>
                    )),
                  []
                )}
              </TextField>
            </Stack>

            {/* Cost / Selling price in row */}
            <Stack direction="row" spacing={2}>
              <Stack flex={1} spacing={1}>
                <InputLabel sx={{ color: "#aaa" }}>Cost Price :</InputLabel>
                <TextField
                  type="number"
                  size="small"
                  variant="filled"
                  autoComplete="off"
                  value={form.cost_price}
                  onChange={onChange("cost_price")}
                  onBlur={() => handleFieldBlur("cost_price", form.cost_price)}
                  error={!!errors.cost_price}
                  helperText={errors.cost_price}
                />
              </Stack>
              <Stack flex={1} spacing={1}>
                <InputLabel sx={{ color: "#aaa" }}>Selling Price :</InputLabel>
                <TextField
                  type="number"
                  size="small"
                  variant="filled"
                  autoComplete="off"
                  value={form.selling_price}
                  onChange={onChange("selling_price")}
                  onBlur={() =>
                    handleFieldBlur("selling_price", form.selling_price)
                  }
                  error={!!errors.selling_price}
                  helperText={errors.selling_price}
                />
              </Stack>
            </Stack>

            <Stack spacing={1}>
              <InputLabel sx={{ color: "#aaa" }}>Description :</InputLabel>
              <TextField
                multiline
                rows={3}
                variant="filled"
                autoComplete="off"
                value={form.description}
                onChange={onChange("description")}
                onBlur={() => handleFieldBlur("description", form.description)}
                error={!!errors.description}
                helperText={errors.description}
              />
            </Stack>

            {/* Stock / Units in row */}
            <Stack direction="row" spacing={2}>
              <Stack flex={1} spacing={1}>
                <InputLabel sx={{ color: "#aaa" }}>
                  Available Stock :
                </InputLabel>
                <TextField
                  type="number"
                  size="small"
                  variant="filled"
                  autoComplete="off"
                  value={form.stock_available}
                  onChange={onChange("stock_available")}
                  onBlur={() =>
                    handleFieldBlur("stock_available", form.stock_available)
                  }
                  error={!!errors.stock_available}
                  helperText={errors.stock_available}
                />
              </Stack>
              <Stack flex={1} spacing={1}>
                <InputLabel sx={{ color: "#aaa" }}>Units Sold :</InputLabel>
                <TextField
                  type="number"
                  size="small"
                  variant="filled"
                  autoComplete="off"
                  value={form.units_sold}
                  onChange={onChange("units_sold")}
                  onBlur={() => handleFieldBlur("units_sold", form.units_sold)}
                  error={!!errors.units_sold}
                  helperText={errors.units_sold}
                />
              </Stack>
            </Stack>

            <Divider
              sx={{
                backgroundColor: "white",
                width: "100%",
              }}
            />

            {/* Footer buttons */}
            <Stack direction="row" justifyContent="flex-end" spacing={2} mt={2}>
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
                type="submit"
                variant="contained"
                sx={{
                  background: COLOR.neon_green,
                  color: "#000",
                  textTransform: "none",
                  "&:hover": { background: "#4fffac" },
                }}
              >
                {isUpdate ? "Update" : "Add"}
              </Button>
            </Stack>
          </Stack>
        </form>
      </Stack>
    </Modal>
  );
};

export default CreateProductModal;
