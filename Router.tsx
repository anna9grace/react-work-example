import { Route, Routes } from "react-router-dom";
import { permissions } from "@permissions";

import EmptyPage from "@/pages/EmptyPage";
import MainPage from "@/pages/MainPage";
import ProductPage from "@/pages/ProductPage";
import CreateProductPage from "@/pages/CreateProductPage";
import ChaptersPage from "@/pages/ChaptersPage";

export const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<MainPage />} />
      <Route
        path="/product/:id/*"
        element={<ProductPage permissions={[permissions.ADMIN]} />}
      />
      <Route
        path="/product/create"
        element={<CreateProductPage permissions={[permissions.ADMIN]} />}
      />
      <Route
        path="/chapters"
        element={<ChaptersPage permissions={[permissions.ADMIN]} />}
      />
      <Route path="*" element={<EmptyPage />} />
    </Routes>
  );
};
