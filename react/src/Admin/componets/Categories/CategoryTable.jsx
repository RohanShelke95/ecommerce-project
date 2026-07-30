import {
  Box,
  Button,
  Card,
  CardHeader,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createCategory,
  deleteCategory,
  getCategories,
} from "../../../Redux/Admin/Category/Action";

const CategoryTable = () => {
  const dispatch = useDispatch();
  const { categories } = useSelector((store) => store);
  const [newCategory, setNewCategory] = useState({
    name: "",
    parentCategory: null,
    level: 1,
  });

  useEffect(() => {
    dispatch(getCategories());
  }, [dispatch]);

  const handleCreateCategory = (e) => {
    e.preventDefault();
    dispatch(createCategory(newCategory));
    setNewCategory({ name: "", parentCategory: null, level: 1 });
  };

  const handleDeleteCategory = (id) => {
    dispatch(deleteCategory(id));
  };

  return (
    <Box width={"100%"} p={2}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <Card sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Add New Category
            </Typography>
            <form onSubmit={handleCreateCategory}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Category Name"
                    value={newCategory.name}
                    onChange={(e) =>
                      setNewCategory({ ...newCategory, name: e.target.value })
                    }
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Parent Category</InputLabel>
                    <Select
                      value={newCategory.parentCategory?.id || ""}
                      onChange={(e) => {
                        const parent = categories.categories.find(
                          (c) => c.id === e.target.value
                        );
                        setNewCategory({
                          ...newCategory,
                          parentCategory: parent || null,
                          level: parent ? parent.level + 1 : 1,
                        });
                      }}
                    >
                      <MenuItem value="">None (Level 1)</MenuItem>
                      {categories.categories.map((cat) => (
                        <MenuItem key={cat.id} value={cat.id}>
                          {cat.name} (L{cat.level})
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <Button variant="contained" fullWidth type="submit">
                    Add Category
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Card>
        </Grid>
        <Grid item xs={12} md={8}>
          <Card>
            <CardHeader title="Existing Categories" />
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Level</TableCell>
                    <TableCell>Parent</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {categories.categories?.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.id}</TableCell>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>{item.level}</TableCell>
                      <TableCell>
                        {item.parentCategory ? item.parentCategory.name : "None"}
                      </TableCell>
                      <TableCell>
                        <Button
                          color="error"
                          onClick={() => handleDeleteCategory(item.id)}
                        >
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CategoryTable;
