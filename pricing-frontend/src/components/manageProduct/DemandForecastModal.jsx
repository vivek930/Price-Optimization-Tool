import { Modal, Stack, Typography } from "@mui/material";
import { X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { DataGrid } from "@mui/x-data-grid";
import { closeDemandForecastModal } from "../../store/slices/modalsSlice";
import DemandForecastChart from "./DemandForecastChart";
import { demandForecastColumns } from "../../constants/Constants";
import { darkDataGridStyles } from "../../styles/dataGridStyles";

const DemandForecastModal = () => {
  const dispatch = useDispatch();
  const items = useSelector((store) => store.product.productItems);
  const selectedRows = useSelector((store) => store.product.selectedIds);
  const selectedData = items.filter((row) => selectedRows.includes(row.id));

  const isForecastOpen = useSelector(
    (store) => store.modals.isDemandForecastModalOpen
  );

  const handleModalClose = () => {
    dispatch(closeDemandForecastModal());
  };

  return (
    <Modal open={isForecastOpen} onClose={handleModalClose}>
      <Stack
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "80%",
          height: "80%",
          bgcolor: "#1e1e1e",
          borderRadius: "8px",
          boxShadow: 24,
          display: "flex",
        }}
      >
        {/* Header */}
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          px={2}
          py={2}
          borderBottom="1px solid #333"
          bgcolor="black"
        >
          <Typography color="white" fontSize="18px" fontWeight={600}>
            Demand Forecast
          </Typography>
          <X
            size={20}
            color="white"
            onClick={handleModalClose}
            style={{ cursor: "pointer" }}
          />
        </Stack>

        {/* Body */}
        <Stack flex={1} p={2} spacing={2} overflow={"auto"}>
          {/* Chart Section */}
          <Stack flex={1} minHeight="300px">
            <DemandForecastChart />
          </Stack>

          {/* Grid Section */}
          <Stack flex={1} overflow={"auto"}>
            <DataGrid
              rows={selectedData}
              columns={demandForecastColumns}
              getRowId={(row) => row.id}
              disableRowSelectionOnClick
              hideFooter
              sx={darkDataGridStyles}
            />
          </Stack>
        </Stack>
      </Stack>
    </Modal>
  );
};

export default DemandForecastModal;
