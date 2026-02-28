import { IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

const DeleteRecord = () => {
  return (
    <div>
      <IconButton color="error" size="small">
        <DeleteIcon />
      </IconButton>
    </div>
  );
};

export default DeleteRecord;
