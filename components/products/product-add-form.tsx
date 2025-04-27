"use client";
import { useState } from "react";
import { createProduct } from "@/lib/api";

export default function ProductAddForm({ onSuccess }: { onSuccess?: () => void }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      await createProduct(formData);
      setMessage("Tạo sản phẩm thành công!");
      form.reset();
      onSuccess && onSuccess();
    } catch {
      setMessage("Tạo sản phẩm thất bại!");
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <input name="name" placeholder="Tên sản phẩm" className="border p-2 w-full" required />
      <input name="cost" placeholder="Giá" className="border p-2 w-full" required type="number" />
      <textarea name="description" placeholder="Mô tả" className="border p-2 w-full" required />
      <input name="quantity" placeholder="Số lượng" className="border p-2 w-full" required type="number" />
      <input name="image_url" placeholder="Link ảnh" className="border p-2 w-full" />
      <input name="categories" placeholder="ID category (cách nhau dấu phẩy)" className="border p-2 w-full" required />
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded" disabled={loading}>
        {loading ? "Đang tạo..." : "Tạo sản phẩm"}
      </button>
      {message && <div className="mt-2">{message}</div>}
    </form>
  );
}