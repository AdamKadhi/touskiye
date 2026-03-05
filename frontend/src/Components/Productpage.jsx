import React, { useState, useEffect } from "react";
import { productsAPI } from "../services/api";
import ConfirmModal from "./ConfirmModal";
import "../styles/AdminInterface.css";

export default function ProductsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showValidationModal, setShowValidationModal] = useState(false);
  const [validationMessage, setValidationMessage] = useState("");
  const [productToDelete, setProductToDelete] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [newProduct, setNewProduct] = useState({
    name: "",
    category: "",
    price: "",
    originalPrice: "",
    stock: "",
    status: "Shown",
    description: "",
    adLink: "",
    videoUrl: "", // ✅ NEW
    rating: 0, // ✅ NEW
  });

  // ✅ NEW: Multiple image upload states
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [editImageFiles, setEditImageFiles] = useState([]);
  const [editImagePreviews, setEditImagePreviews] = useState([]);

  // ✅ Video states
  const [videoFile, setVideoFile] = useState(null);
  const [videoPreview, setVideoPreview] = useState("");
  const [videoMode, setVideoMode] = useState("url");
  const [editVideoFile, setEditVideoFile] = useState(null);
  const [editVideoPreview, setEditVideoPreview] = useState("");
  const [editVideoMode, setEditVideoMode] = useState("url");

  const categories = [
    "Accessories",
    "Electronics",
    "Bags",
    "Fashion",
    "Sports",
  ];
  const statuses = ["Shown", "Hidden", "Out of Stock"];

  // Fetch products from backend
  useEffect(() => {
    fetchProducts();
  }, [filterCategory, filterStatus, searchQuery]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await productsAPI.getAll({
        category: filterCategory !== "all" ? filterCategory : undefined,
        status: filterStatus !== "all" ? filterStatus : undefined,
        search: searchQuery || undefined,
      });
      setProducts(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching products:", error);
      setLoading(false);
    }
  };

  // ✅ NEW: Handle multiple image selection for new product
  const handleImagesChange = (e) => {
    const files = Array.from(e.target.files);

    if (files.length + imageFiles.length > 5) {
      setValidationMessage("You can upload maximum 5 images");
      setShowValidationModal(true);
      return;
    }

    for (const file of files) {
      if (!file.type.startsWith("image/")) {
        setValidationMessage("Please select only image files");
        setShowValidationModal(true);
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setValidationMessage("Each image must be less than 5MB");
        setShowValidationModal(true);
        return;
      }
    }

    const newFiles = [...imageFiles, ...files];
    setImageFiles(newFiles);

    const newPreviews = [...imagePreviews];
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        newPreviews.push(reader.result);
        setImagePreviews([...newPreviews]);
      };
      reader.readAsDataURL(file);
    });
  };

  // ✅ NEW: Remove image from new product
  const removeImage = (index) => {
    const newFiles = imageFiles.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    setImageFiles(newFiles);
    setImagePreviews(newPreviews);
  };

  // ✅ NEW: Handle multiple image selection for edit product
  const handleEditImagesChange = (e) => {
    const files = Array.from(e.target.files);

    const existingImagesCount = selectedProduct.images?.length || 0;
    const totalImages =
      existingImagesCount + files.length + editImageFiles.length;

    if (totalImages > 5) {
      setValidationMessage("You can have maximum 5 images total");
      setShowValidationModal(true);
      return;
    }

    for (const file of files) {
      if (!file.type.startsWith("image/")) {
        setValidationMessage("Please select only image files");
        setShowValidationModal(true);
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setValidationMessage("Each image must be less than 5MB");
        setShowValidationModal(true);
        return;
      }
    }

    const newFiles = [...editImageFiles, ...files];
    setEditImageFiles(newFiles);

    const newPreviews = [...editImagePreviews];
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        newPreviews.push(reader.result);
        setEditImagePreviews([...newPreviews]);
      };
      reader.readAsDataURL(file);
    });
  };

  // ✅ NEW: Remove new image from edit product
  const removeEditImage = (index) => {
    const newFiles = editImageFiles.filter((_, i) => i !== index);
    const newPreviews = editImagePreviews.filter((_, i) => i !== index);
    setEditImageFiles(newFiles);
    setEditImagePreviews(newPreviews);
  };
  // ✅ Video handlers
  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const allowedTypes = [
        "video/mp4",
        "video/webm",
        "video/ogg",
        "video/quicktime",
        "video/x-msvideo",
      ];
      if (!allowedTypes.includes(file.type)) {
        setValidationMessage(
          "Please select a valid video file (MP4, WebM, OGG, MOV, AVI)",
        );
        setShowValidationModal(true);
        return;
      }
      if (file.size > 50 * 1024 * 1024) {
        setValidationMessage("Video size must be less than 50MB");
        setShowValidationModal(true);
        return;
      }
      setVideoFile(file);
      setVideoPreview(URL.createObjectURL(file));
    }
  };

  const handleEditVideoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const allowedTypes = [
        "video/mp4",
        "video/webm",
        "video/ogg",
        "video/quicktime",
        "video/x-msvideo",
      ];
      if (!allowedTypes.includes(file.type)) {
        setValidationMessage(
          "Please select a valid video file (MP4, WebM, OGG, MOV, AVI)",
        );
        setShowValidationModal(true);
        return;
      }
      if (file.size > 50 * 1024 * 1024) {
        setValidationMessage("Video size must be less than 50MB");
        setShowValidationModal(true);
        return;
      }
      setEditVideoFile(file);
      setEditVideoPreview(URL.createObjectURL(file));
    }
  };

  const removeVideo = () => {
    setVideoFile(null);
    setVideoPreview("");
    if (videoPreview) URL.revokeObjectURL(videoPreview);
  };

  const removeEditVideo = () => {
    setEditVideoFile(null);
    setEditVideoPreview("");
    if (editVideoPreview) URL.revokeObjectURL(editVideoPreview);
  };
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  // ✅ UPDATED: Handle add product with multiple images
  const handleAddProduct = async () => {
    if (
      !newProduct.name ||
      !newProduct.category ||
      !newProduct.price ||
      !newProduct.stock ||
      imageFiles.length === 0
    ) {
      setValidationMessage(
        "Please fill in all required fields (including at least one image)",
      );
      setShowValidationModal(true);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", newProduct.name);
      formData.append("category", newProduct.category);
      formData.append("price", parseFloat(newProduct.price) || 0);
      if (newProduct.originalPrice) {
        formData.append("originalPrice", parseFloat(newProduct.originalPrice));
      }
      formData.append("stock", parseInt(newProduct.stock) || 0);
      formData.append("status", newProduct.status);
      formData.append("description", newProduct.description || "");
      formData.append("adLink", newProduct.adLink || "");
      formData.append("videoUrl", newProduct.videoUrl || "");
      formData.append("rating", newProduct.rating || 0);

      imageFiles.forEach((file) => {
        formData.append("files", file); // Changed 'images' to 'files'
      });

      // ✅ Add video
      if (videoMode === "upload" && videoFile) {
        formData.append("files", videoFile);
      }
      setVideoFile(null);
      setVideoPreview("");
      setVideoMode("url");

      await productsAPI.create(formData);

      fetchProducts();
      setShowAddModal(false);
      setNewProduct({
        name: "",
        category: "",
        price: "",
        originalPrice: "",
        stock: "",
        status: "Shown",
        description: "",
        adLink: "",
        videoUrl: "",
        rating: 0,
      });
      setImageFiles([]);
      setImagePreviews([]);
    } catch (error) {
      console.error("Error creating product:", error);
      setValidationMessage("Failed to create product. Please try again.");
      setShowValidationModal(true);
    }
  };

  // ✅ UPDATED: Handle edit product
  const handleEditProduct = async () => {
    if (
      !selectedProduct.name ||
      !selectedProduct.category ||
      !selectedProduct.price
    ) {
      setValidationMessage("Please fill in all required fields");
      setShowValidationModal(true);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", selectedProduct.name);
      formData.append("category", selectedProduct.category);
      formData.append("price", parseFloat(selectedProduct.price) || 0);
      if (selectedProduct.originalPrice) {
        formData.append(
          "originalPrice",
          parseFloat(selectedProduct.originalPrice),
        );
      }
      formData.append("stock", parseInt(selectedProduct.stock) || 0);
      formData.append("status", selectedProduct.status);
      formData.append("description", selectedProduct.description || "");
      formData.append("adLink", selectedProduct.adLink || "");
      formData.append("videoUrl", selectedProduct.videoUrl || "");
      formData.append("rating", selectedProduct.rating || 0);

      if (editImageFiles.length > 0) {
        editImageFiles.forEach((file) => {
          formData.append("files", file); // Changed 'images' to 'files'
        });
      }

      // ✅ Add video
      if (editVideoMode === "upload" && editVideoFile) {
        formData.append("files", editVideoFile);
      }
      setEditVideoFile(null);
      setEditVideoPreview("");
      setEditVideoMode("url");

      await productsAPI.update(selectedProduct._id, formData);

      fetchProducts();
      setShowEditModal(false);
      setSelectedProduct(null);
      setEditImageFiles([]);
      setEditImagePreviews([]);
    } catch (error) {
      console.error("Error updating product:", error);
      setValidationMessage("Failed to update product. Please try again.");
      setShowValidationModal(true);
    }
  };

  const handleDeleteProduct = (productId) => {
    setProductToDelete(productId);
    setShowDeleteConfirm(true);
  };

  const confirmDeleteProduct = async () => {
    try {
      await productsAPI.delete(productToDelete);
      fetchProducts();
      setShowDeleteConfirm(false);
      setProductToDelete(null);
    } catch (error) {
      console.error("Error deleting product:", error);
      setValidationMessage("Failed to delete product. Please try again.");
      setShowValidationModal(true);
    }
  };

  const handleViewProduct = (product) => {
    setSelectedProduct(product);
    setShowViewModal(true);
  };

  const handleEditClick = (product) => {
    setSelectedProduct({ ...product });
    setShowEditModal(true);
    setEditImageFiles([]);
    setEditImagePreviews([]);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Shown":
        return "shown";
      case "Hidden":
        return "hidden";
      case "Out of Stock":
        return "outofstock";
      default:
        return "shown";
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return "https://via.placeholder.com/60";
    return imagePath.startsWith("/uploads")
      ? `http://localhost:5000${imagePath}`
      : imagePath;
  };

  return (
    <div className="admin-interface">
      <div style={{ fontFamily: "'Cairo', sans-serif" }}>
        <div className="products-container">
          <div className="products-header">
            <div className="page-title">Products Management</div>
            <div className="page-subtitle">
              Manage your store's product catalog
            </div>
          </div>

          {/* Filters Section */}
          <div className="filters-section">
            <div className="filters-row">
              <div className="search-box">
                <span className="search-icon">🔍</span>
                <input
                  type="text"
                  className="search-input"
                  placeholder="Search by product name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <select
                className="filter-select"
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
              >
                <option value="all">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>

              <select
                className="filter-select"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">All Statuses</option>
                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>

              <button
                className="add-product-btn"
                onClick={() => setShowAddModal(true)}
              >
                <span>+</span>
                <span>Add Product</span>
              </button>
            </div>
          </div>

          {/* Products Table */}
          <div className="products-table-container">
            {loading ? (
              <div className="loading-state">
                <div className="loading-spinner">⏳</div>
                <div>Loading products...</div>
              </div>
            ) : filteredProducts.length > 0 ? (
              <table className="products-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Image</th>
                    <th>Name</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Status</th>
                    <th>Ad Link</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product) => (
                    <tr key={product._id}>
                      <td className="product-id">
                        PRD-{product._id?.slice(-6) || "N/A"}
                      </td>
                      <td className="product-image-cell">
                        <img
                          src={getImageUrl(product.image)}
                          alt={product.name}
                          className="product-table-image"
                        />
                      </td>
                      <td>
                        <div className="product-name-cell">{product.name}</div>
                        <div className="product-category">
                          {product.category}
                        </div>
                      </td>
                      <td className="price-cell">
                        {product.originalPrice &&
                          product.originalPrice > product.price && (
                            <span className="original-price">
                              {product.originalPrice} DT
                            </span>
                          )}
                        <div>
                          {product.price} DT
                          {product.discount && product.discount > 0 && (
                            <span className="discount-label">
                              -{product.discount}%
                            </span>
                          )}
                        </div>
                      </td>
                      <td
                        className={`stock-cell ${
                          product.stock === 0
                            ? "stock-out"
                            : product.stock < 20
                              ? "stock-low"
                              : "stock-ok"
                        }`}
                      >
                        {product.stock === 0
                          ? "Out of Stock"
                          : `${product.stock} units`}
                      </td>
                      <td>
                        <span
                          className={`status-badge ${getStatusColor(product.status)}`}
                        >
                          {product.status}
                        </span>
                      </td>
                      <td>
                        {product.adLink ? (
                          <a
                            href={product.adLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="fb-link"
                            title="View Facebook Ad"
                          >
                            📘
                          </a>
                        ) : (
                          <div className="fb-link disabled" title="No ad link">
                            📘
                          </div>
                        )}
                      </td>
                      <td>
                        <div className="actions-cell">
                          <button
                            className="action-btn view"
                            onClick={() => handleViewProduct(product)}
                            title="View"
                          >
                            👁️
                          </button>
                          <button
                            className="action-btn edit"
                            onClick={() => handleEditClick(product)}
                            title="Edit"
                          >
                            ✏️
                          </button>
                          <button
                            className="action-btn delete"
                            onClick={() => handleDeleteProduct(product._id)}
                            title="Delete"
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="empty-state">
                <div className="empty-icon">📦</div>
                <div>No products found</div>
              </div>
            )}
          </div>
        </div>

        {/* Add Product Modal */}
        {showAddModal && (
          <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <div className="modal-title">Add New Product</div>
                <button
                  className="modal-close"
                  onClick={() => setShowAddModal(false)}
                >
                  ×
                </button>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="modal-label">Product Name *</label>
                  <input
                    type="text"
                    className="modal-input"
                    value={newProduct.name}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, name: e.target.value })
                    }
                    placeholder="Enter product name"
                  />
                </div>

                <div className="form-group">
                  <label className="modal-label">Category *</label>
                  <select
                    className="modal-input"
                    value={newProduct.category}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, category: e.target.value })
                    }
                  >
                    <option value="">Select category</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="modal-label">Price *</label>
                  <input
                    type="number"
                    className="modal-input"
                    value={newProduct.price}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, price: e.target.value })
                    }
                    placeholder="299"
                  />
                </div>

                <div className="form-group">
                  <label className="modal-label">
                    Original Price (Optional)
                  </label>
                  <input
                    type="number"
                    className="modal-input"
                    value={newProduct.originalPrice}
                    onChange={(e) =>
                      setNewProduct({
                        ...newProduct,
                        originalPrice: e.target.value,
                      })
                    }
                    placeholder="399"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="modal-label">Stock *</label>
                  <input
                    type="number"
                    className="modal-input"
                    value={newProduct.stock}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, stock: e.target.value })
                    }
                    placeholder="50"
                  />
                </div>

                <div className="form-group">
                  <label className="modal-label">Status *</label>
                  <select
                    className="modal-input"
                    value={newProduct.status}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, status: e.target.value })
                    }
                  >
                    {statuses.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* ✅ NEW: Multiple Images Upload Section */}
              <div className="form-group full">
                <div className="images-upload-section">
                  <label className="images-upload-label">
                    Product Images (Max 5) *
                  </label>

                  <div className="images-grid">
                    {imagePreviews.map((preview, index) => (
                      <div key={index} className="image-preview-item">
                        <img
                          src={preview}
                          alt={`Preview ${index + 1}`}
                          className="image-preview-img"
                        />
                        <button
                          className="remove-image-btn"
                          onClick={() => removeImage(index)}
                          type="button"
                        >
                          ×
                        </button>
                      </div>
                    ))}

                    {imageFiles.length < 5 && (
                      <div
                        className="add-images-btn"
                        onClick={() =>
                          document.getElementById("images-upload").click()
                        }
                      >
                        <div className="add-images-icon">📸</div>
                        <div className="add-images-text">
                          {imageFiles.length === 0
                            ? "Click to upload images"
                            : "Add more images"}
                        </div>
                        <div className="add-images-hint">
                          {imageFiles.length}/5 images
                        </div>
                      </div>
                    )}
                  </div>

                  <input
                    id="images-upload"
                    type="file"
                    className="file-input-hidden"
                    accept="image/*"
                    multiple
                    onChange={handleImagesChange}
                  />
                </div>
              </div>

              {/* ✅ NEW: Video URL Input */}
              <div className="form-group full">
                <label className="modal-label">Video URL (Optional)</label>
                <input
                  type="text"
                  className="modal-input"
                  value={newProduct.videoUrl}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, videoUrl: e.target.value })
                  }
                  placeholder="https://www.youtube.com/embed/..."
                />
                <div
                  style={{
                    fontSize: "0.75rem",
                    color: "#666",
                    marginTop: "0.5rem",
                  }}
                >
                  YouTube or Vimeo embed URL
                </div>
              </div>

              {/* ✅ NEW: Rating Selector */}
              <div className="form-group full">
                <div className="rating-section">
                  <label className="rating-label">Rating (Optional)</label>
                  <div className="star-rating">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span
                        key={star}
                        className={`star ${star <= newProduct.rating ? "filled" : "empty"}`}
                        onClick={() =>
                          setNewProduct({ ...newProduct, rating: star })
                        }
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  <div className="rating-hint">
                    Click stars to set rating: {newProduct.rating}/5
                  </div>
                </div>
              </div>
              {/* Video Section */}
              <div className="form-group full">
                <div className="video-section">
                  <label className="modal-label">
                    Product Video (Optional)
                  </label>
                  <div className="video-mode-toggle">
                    <button
                      type="button"
                      className={`mode-btn ${videoMode === "url" ? "active" : ""}`}
                      onClick={() => setVideoMode("url")}
                    >
                      📺 Paste URL
                    </button>
                    <button
                      type="button"
                      className={`mode-btn ${videoMode === "upload" ? "active" : ""}`}
                      onClick={() => setVideoMode("upload")}
                    >
                      🎬 Upload File
                    </button>
                  </div>
                  {videoMode === "url" ? (
                    <div>
                      <input
                        type="text"
                        className="modal-input"
                        value={newProduct.videoUrl}
                        onChange={(e) =>
                          setNewProduct({
                            ...newProduct,
                            videoUrl: e.target.value,
                          })
                        }
                        placeholder="https://www.youtube.com/embed/..."
                      />
                      <div
                        style={{
                          fontSize: "0.75rem",
                          color: "#666",
                          marginTop: "0.5rem",
                        }}
                      >
                        YouTube or Vimeo embed URL
                      </div>
                    </div>
                  ) : (
                    <div>
                      {videoPreview ? (
                        <div className="video-upload-area has-video">
                          <div className="video-preview-container">
                            <video
                              src={videoPreview}
                              controls
                              className="video-preview"
                            />
                            <button
                              type="button"
                              className="remove-image-btn"
                              onClick={removeVideo}
                              style={{ top: "8px", right: "8px" }}
                            >
                              ×
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div
                          className="video-upload-area"
                          onClick={() =>
                            document.getElementById("video-upload").click()
                          }
                        >
                          <div className="video-upload-icon">🎬</div>
                          <div className="video-upload-text">
                            Click to upload video
                          </div>
                          <div className="video-upload-hint">
                            MP4, WebM, MOV, AVI (Max 50MB)
                          </div>
                        </div>
                      )}
                      <input
                        id="video-upload"
                        type="file"
                        className="file-input-hidden"
                        accept="video/*"
                        onChange={handleVideoChange}
                      />
                    </div>
                  )}
                </div>
              </div>
              <div className="form-group full">
                <label className="modal-label">Description</label>
                <textarea
                  className="modal-input modal-textarea"
                  value={newProduct.description}
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      description: e.target.value,
                    })
                  }
                  placeholder="Product description..."
                />
              </div>

              <div className="form-group full">
                <label className="modal-label">Facebook Ad Link</label>
                <input
                  type="text"
                  className="modal-input"
                  value={newProduct.adLink}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, adLink: e.target.value })
                  }
                  placeholder="https://facebook.com/ads/..."
                />
              </div>

              <div className="modal-actions">
                <button
                  className="modal-btn secondary"
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="modal-btn primary"
                  onClick={handleAddProduct}
                >
                  Add Product
                </button>
              </div>
            </div>
          </div>
        )}

        {/* View Product Modal - Same as before */}
        {showViewModal && selectedProduct && (
          <div
            className="modal-overlay"
            onClick={() => setShowViewModal(false)}
          >
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <div className="modal-title">Product Details</div>
                <button
                  className="modal-close"
                  onClick={() => setShowViewModal(false)}
                >
                  ×
                </button>
              </div>

              <div className="product-view-header">
                <img
                  src={getImageUrl(selectedProduct.image)}
                  alt={selectedProduct.name}
                  className="product-view-image"
                />
                <div className="product-view-info">
                  <div className="product-view-name">
                    {selectedProduct.name}
                  </div>
                  <div className="product-view-category">
                    {selectedProduct.category}
                  </div>
                  <div className="product-view-price">
                    {selectedProduct.price} DT
                    {selectedProduct.discount &&
                      selectedProduct.discount > 0 && (
                        <span className="product-view-discount">
                          -{selectedProduct.discount}%
                        </span>
                      )}
                  </div>
                  {selectedProduct.originalPrice &&
                    selectedProduct.originalPrice > selectedProduct.price && (
                      <div
                        style={{
                          color: "#999",
                          textDecoration: "line-through",
                          fontSize: "1.1rem",
                        }}
                      >
                        {selectedProduct.originalPrice} DT
                      </div>
                    )}
                </div>
              </div>

              <div className="detail-grid">
                <div className="detail-item">
                  <div className="detail-label">Product ID</div>
                  <div className="detail-value" style={{ color: "#c4d600" }}>
                    PRD-{selectedProduct._id?.slice(-6) || "N/A"}
                  </div>
                </div>

                <div className="detail-item">
                  <div className="detail-label">Stock</div>
                  <div className="detail-value">
                    {selectedProduct.stock} units
                  </div>
                </div>

                <div className="detail-item">
                  <div className="detail-label">Status</div>
                  <div className="detail-value">
                    <span
                      className={`status-badge ${getStatusColor(selectedProduct.status)}`}
                    >
                      {selectedProduct.status}
                    </span>
                  </div>
                </div>

                <div className="detail-item">
                  <div className="detail-label">Created Date</div>
                  <div className="detail-value">
                    {formatDate(selectedProduct.createdAt)}
                  </div>
                </div>

                {selectedProduct.rating > 0 && (
                  <div className="detail-item">
                    <div className="detail-label">Rating</div>
                    <div className="detail-value">
                      {"★".repeat(selectedProduct.rating)}
                      {"☆".repeat(5 - selectedProduct.rating)} (
                      {selectedProduct.rating}/5)
                    </div>
                  </div>
                )}

                {selectedProduct.videoUrl && (
                  <div className="detail-item">
                    <div className="detail-label">Video URL</div>
                    <div
                      className="detail-value"
                      style={{ fontSize: "0.8rem", wordBreak: "break-all" }}
                    >
                      {selectedProduct.videoUrl}
                    </div>
                  </div>
                )}

                <div className="detail-item full">
                  <div className="detail-label">Description</div>
                  <div className="detail-value">
                    {selectedProduct.description || "No description"}
                  </div>
                </div>

                <div className="detail-item full">
                  <div className="detail-label">Facebook Ad Link</div>
                  <div className="detail-value">
                    {selectedProduct.adLink ? (
                      <a
                        href={selectedProduct.adLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: "#6496ff" }}
                      >
                        {selectedProduct.adLink}
                      </a>
                    ) : (
                      <span style={{ color: "#999" }}>No ad link</span>
                    )}
                  </div>
                </div>

                {selectedProduct.images &&
                  selectedProduct.images.length > 1 && (
                    <div className="detail-item full">
                      <div className="detail-label">
                        All Images ({selectedProduct.images.length})
                      </div>
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns:
                            "repeat(auto-fill, minmax(100px, 1fr))",
                          gap: "0.5rem",
                          marginTop: "0.5rem",
                        }}
                      >
                        {selectedProduct.images.map((img, index) => (
                          <img
                            key={index}
                            src={getImageUrl(img)}
                            alt={`${selectedProduct.name} ${index + 1}`}
                            style={{
                              width: "100%",
                              height: "100px",
                              objectFit: "cover",
                              borderRadius: "8px",
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  )}
              </div>

              <div className="modal-actions">
                <button
                  className="modal-btn secondary"
                  onClick={() => setShowViewModal(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Product Modal */}
        {showEditModal && selectedProduct && (
          <div
            className="modal-overlay"
            onClick={() => setShowEditModal(false)}
          >
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <div className="modal-title">Edit Product</div>
                <button
                  className="modal-close"
                  onClick={() => setShowEditModal(false)}
                >
                  ×
                </button>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="modal-label">Product Name *</label>
                  <input
                    type="text"
                    className="modal-input"
                    value={selectedProduct.name}
                    onChange={(e) =>
                      setSelectedProduct({
                        ...selectedProduct,
                        name: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="form-group">
                  <label className="modal-label">Category *</label>
                  <select
                    className="modal-input"
                    value={selectedProduct.category}
                    onChange={(e) =>
                      setSelectedProduct({
                        ...selectedProduct,
                        category: e.target.value,
                      })
                    }
                  >
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="modal-label">Price *</label>
                  <input
                    type="number"
                    className="modal-input"
                    value={selectedProduct.price}
                    onChange={(e) =>
                      setSelectedProduct({
                        ...selectedProduct,
                        price: parseFloat(e.target.value),
                      })
                    }
                  />
                </div>

                <div className="form-group">
                  <label className="modal-label">Original Price</label>
                  <input
                    type="number"
                    className="modal-input"
                    value={selectedProduct.originalPrice || ""}
                    onChange={(e) =>
                      setSelectedProduct({
                        ...selectedProduct,
                        originalPrice: parseFloat(e.target.value) || undefined,
                      })
                    }
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="modal-label">Stock *</label>
                  <input
                    type="number"
                    className="modal-input"
                    value={selectedProduct.stock}
                    onChange={(e) =>
                      setSelectedProduct({
                        ...selectedProduct,
                        stock: parseInt(e.target.value),
                      })
                    }
                  />
                </div>

                <div className="form-group">
                  <label className="modal-label">Status *</label>
                  <select
                    className="modal-input"
                    value={selectedProduct.status}
                    onChange={(e) =>
                      setSelectedProduct({
                        ...selectedProduct,
                        status: e.target.value,
                      })
                    }
                  >
                    {statuses.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* ✅ NEW: Edit Images Section */}
              <div className="form-group full">
                <div className="images-upload-section">
                  <label className="images-upload-label">Product Images</label>

                  {/* Show existing images */}
                  {selectedProduct.images &&
                    selectedProduct.images.length > 0 && (
                      <div>
                        <div
                          style={{
                            fontSize: "0.75rem",
                            color: "#999",
                            marginBottom: "0.5rem",
                          }}
                        >
                          Current images ({selectedProduct.images.length}):
                        </div>
                        <div
                          style={{
                            display: "grid",
                            gridTemplateColumns:
                              "repeat(auto-fill, minmax(100px, 1fr))",
                            gap: "0.5rem",
                            marginBottom: "1rem",
                          }}
                        >
                          {selectedProduct.images.map((img, index) => (
                            <img
                              key={index}
                              src={getImageUrl(img)}
                              alt={`Current ${index + 1}`}
                              style={{
                                width: "100%",
                                height: "100px",
                                objectFit: "cover",
                                borderRadius: "8px",
                                border: "2px solid rgba(196, 214, 0, 0.3)",
                              }}
                            />
                          ))}
                        </div>
                      </div>
                    )}

                  {/* Add new images */}
                  <div className="images-grid">
                    {editImagePreviews.map((preview, index) => (
                      <div key={index} className="image-preview-item">
                        <img
                          src={preview}
                          alt={`New ${index + 1}`}
                          className="image-preview-img"
                        />
                        <button
                          className="remove-image-btn"
                          onClick={() => removeEditImage(index)}
                          type="button"
                        >
                          ×
                        </button>
                      </div>
                    ))}

                    {editImageFiles.length +
                      (selectedProduct.images?.length || 0) <
                      5 && (
                      <div
                        className="add-images-btn"
                        onClick={() =>
                          document.getElementById("edit-images-upload").click()
                        }
                      >
                        <div className="add-images-icon">📸</div>
                        <div className="add-images-text">Add new images</div>
                        <div className="add-images-hint">
                          {editImageFiles.length +
                            (selectedProduct.images?.length || 0)}
                          /5 total
                        </div>
                      </div>
                    )}
                  </div>

                  <input
                    id="edit-images-upload"
                    type="file"
                    className="file-input-hidden"
                    accept="image/*"
                    multiple
                    onChange={handleEditImagesChange}
                  />

                  <div
                    style={{
                      fontSize: "0.75rem",
                      color: "#666",
                      marginTop: "0.5rem",
                    }}
                  >
                    Upload new images to replace all existing images
                  </div>
                </div>
              </div>

              {/* ✅ NEW: Edit Video URL */}
              <div className="form-group full">
                <label className="modal-label">Video URL (Optional)</label>
                <input
                  type="text"
                  className="modal-input"
                  value={selectedProduct.videoUrl || ""}
                  onChange={(e) =>
                    setSelectedProduct({
                      ...selectedProduct,
                      videoUrl: e.target.value,
                    })
                  }
                  placeholder="https://www.youtube.com/embed/..."
                />
              </div>

              {/* ✅ NEW: Edit Rating */}
              <div className="form-group full">
                <div className="rating-section">
                  <label className="rating-label">Rating (Optional)</label>
                  <div className="star-rating">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span
                        key={star}
                        className={`star ${star <= (selectedProduct.rating || 0) ? "filled" : "empty"}`}
                        onClick={() =>
                          setSelectedProduct({
                            ...selectedProduct,
                            rating: star,
                          })
                        }
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  <div className="rating-hint">
                    Current rating: {selectedProduct.rating || 0}/5
                  </div>
                </div>
              </div>
              {/* Edit Video Section */}
              <div className="form-group full">
                <div className="video-section">
                  <label className="modal-label">
                    Product Video (Optional)
                  </label>
                  {(selectedProduct.videoFile || selectedProduct.videoUrl) && (
                    <div
                      style={{
                        fontSize: "0.75rem",
                        color: "#999",
                        marginBottom: "0.5rem",
                      }}
                    >
                      Current:{" "}
                      {selectedProduct.videoFile ? "📹 Uploaded" : "📺 URL"}
                    </div>
                  )}
                  <div className="video-mode-toggle">
                    <button
                      type="button"
                      className={`mode-btn ${editVideoMode === "url" ? "active" : ""}`}
                      onClick={() => setEditVideoMode("url")}
                    >
                      📺 Paste URL
                    </button>
                    <button
                      type="button"
                      className={`mode-btn ${editVideoMode === "upload" ? "active" : ""}`}
                      onClick={() => setEditVideoMode("upload")}
                    >
                      🎬 Upload New
                    </button>
                  </div>
                  {editVideoMode === "url" ? (
                    <input
                      type="text"
                      className="modal-input"
                      value={selectedProduct.videoUrl || ""}
                      onChange={(e) =>
                        setSelectedProduct({
                          ...selectedProduct,
                          videoUrl: e.target.value,
                        })
                      }
                      placeholder="https://www.youtube.com/embed/..."
                    />
                  ) : (
                    <div>
                      {editVideoPreview ? (
                        <div className="video-upload-area has-video">
                          <div className="video-preview-container">
                            <video
                              src={editVideoPreview}
                              controls
                              className="video-preview"
                            />
                            <button
                              type="button"
                              className="remove-image-btn"
                              onClick={removeEditVideo}
                            >
                              ×
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div
                          className="video-upload-area"
                          onClick={() =>
                            document.getElementById("edit-video-upload").click()
                          }
                        >
                          <div className="video-upload-icon">🎬</div>
                          <div className="video-upload-text">
                            Upload new video
                          </div>
                          <div className="video-upload-hint">
                            Will replace current
                          </div>
                        </div>
                      )}
                      <input
                        id="edit-video-upload"
                        type="file"
                        className="file-input-hidden"
                        accept="video/*"
                        onChange={handleEditVideoChange}
                      />
                    </div>
                  )}
                </div>
              </div>
              <div className="form-group full">
                <label className="modal-label">Description</label>
                <textarea
                  className="modal-input modal-textarea"
                  value={selectedProduct.description || ""}
                  onChange={(e) =>
                    setSelectedProduct({
                      ...selectedProduct,
                      description: e.target.value,
                    })
                  }
                />
              </div>

              <div className="form-group full">
                <label className="modal-label">Facebook Ad Link</label>
                <input
                  type="text"
                  className="modal-input"
                  value={selectedProduct.adLink || ""}
                  onChange={(e) =>
                    setSelectedProduct({
                      ...selectedProduct,
                      adLink: e.target.value,
                    })
                  }
                />
              </div>

              <div className="modal-actions">
                <button
                  className="modal-btn secondary"
                  onClick={() => setShowEditModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="modal-btn primary"
                  onClick={handleEditProduct}
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        <ConfirmModal
          show={showDeleteConfirm}
          onClose={() => setShowDeleteConfirm(false)}
          onConfirm={confirmDeleteProduct}
          title="Delete Product"
          message="Are you sure you want to delete this product? This action cannot be undone."
          confirmText="Delete"
          cancelText="Cancel"
          type="danger"
        />

        {/* Validation Modal */}
        <ConfirmModal
          show={showValidationModal}
          onClose={() => setShowValidationModal(false)}
          onConfirm={() => setShowValidationModal(false)}
          title="Validation Error"
          message={validationMessage}
          confirmText="OK"
          cancelText=""
          type="warning"
        />
      </div>
    </div>
  );
}
