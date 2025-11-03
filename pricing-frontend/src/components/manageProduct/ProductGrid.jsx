import { Skeleton, Stack } from "@mui/material";
import { useEffect } from "react";
import Header from "../Header";
import { COLOR, columns } from "../../constants/Constants";
import { DataGrid } from "@mui/x-data-grid";
import { useDispatch, useSelector } from "react-redux";
import {
  getProductRequested,
  selectedPrdouctsIds,
} from "../../store/slices/productsSlice";
import CreateProductModal from "./CreateProductModal";
import DeleteProductModal from "./DeleteProductModal";
import DemandForecastModal from "./DemandForecastModal";
import { darkDataGridStyles } from "../../styles/dataGridStyles";
import ActionHeader from "../ActionHeader";
import ActionHeaderButtons from "../ActionHeaderButtons";

const ProductGrid = () => {
  const dispatch = useDispatch();
  const userId = localStorage.getItem("user_id");

  const isCreateProductModalOpen = useSelector(
    (store) => store.modals.isCreateProductModalOpen
  );

  const isUpdateProductModalOpen = useSelector(
    (store) => store.modals.isUpdateProductModalOpen
  );

  const isDeleteProductModalOpen = useSelector(
    (store) => store.modals.isDeleteProductModalOpen
  );

  const items = useSelector((store) => store.product.productItems);
  const productDataLoading = useSelector(
    (store) => store.product.productDataLoading
  );

  // Function to fetch products with current filters
  const fetchProducts = (search, category) => {
    dispatch(
      getProductRequested({
        userId,
        search: search.trim(),
        category: category.trim(),
      })
    );
  };

  // Initial load - fetch all products
  useEffect(() => {
    if (!items.length) fetchProducts("", "");
  }, []);

  return (
    <Stack height={"100%"}>
      <Header />
      <ActionHeader
        title={"Create and Manage Product"}
        ActionButtons={ActionHeaderButtons}
      />
      {isCreateProductModalOpen && <CreateProductModal />}
      {isUpdateProductModalOpen && <CreateProductModal isUpdate={true} />}
      {isDeleteProductModalOpen && <DeleteProductModal />}
      <DemandForecastModal />
      <Stack
        bgcolor={COLOR.grey_001}
        padding={"20px"}
        flex={1}
        overflow={"auto"}
      >
        {!productDataLoading ? (
          <>
            <DataGrid
              rows={items}
              columns={columns(dispatch)}
              getRowId={(row) => row.id}
              checkboxSelection
              disableRowSelectionOnClick
              onRowSelectionModelChange={(newSelection) => {
                let selectedIds = [];
                if (newSelection.type === "include") {
                  selectedIds = Array.from(newSelection.ids);
                } else if (newSelection.type === "exclude") {
                  const allIds = items.map((row) => row.id);
                  const excludedIds = newSelection.ids;
                  selectedIds = allIds.filter((id) => !excludedIds.has(id));
                }
                dispatch(selectedPrdouctsIds(selectedIds));
              }}
              hideFooter
              sx={darkDataGridStyles}
            />
          </>
        ) : (
          <Stack gap={"12px"}>
            <Skeleton variant="rounded" width={"100%"} height={60} />
            <Skeleton variant="rounded" width={"100%"} height={60} />
            <Skeleton variant="rounded" width={"100%"} height={60} />
            <Skeleton variant="rounded" width={"100%"} height={60} />
            <Skeleton variant="rounded" width={"100%"} height={60} />
            <Skeleton variant="rounded" width={"100%"} height={60} />
            <Skeleton variant="rounded" width={"100%"} height={60} />
            <Skeleton variant="rounded" width={"100%"} height={60} />
          </Stack>
        )}
      </Stack>
    </Stack>
  );
};

export default ProductGrid;
