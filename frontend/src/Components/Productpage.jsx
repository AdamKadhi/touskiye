import React, { useState, useEffect } from 'react';
import { productsAPI } from '../services/api';
import ConfirmModal from './ConfirmModal';

export default function ProductsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showValidationModal, setShowValidationModal] = useState(false);
  const [validationMessage, setValidationMessage] = useState('');
  const [productToDelete, setProductToDelete] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [newProduct, setNewProduct] = useState({
    name: '',
    category: '',
    price: '',
    originalPrice: '',
    stock: '',
    status: 'Shown',
    description: '',
    adLink: '',
    videoUrl: '', // ✅ NEW
    rating: 0 // ✅ NEW
  });

  // ✅ NEW: Multiple image upload states
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [editImageFiles, setEditImageFiles] = useState([]);
  const [editImagePreviews, setEditImagePreviews] = useState([]);

  const categories = ['Accessories', 'Electronics', 'Bags', 'Fashion', 'Sports'];
  const statuses = ['Shown', 'Hidden', 'Out of Stock'];

  // Fetch products from backend
  useEffect(() => {
    fetchProducts();
  }, [filterCategory, filterStatus, searchQuery]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await productsAPI.getAll({
        category: filterCategory !== 'all' ? filterCategory : undefined,
        status: filterStatus !== 'all' ? filterStatus : undefined,
        search: searchQuery || undefined
      });
      setProducts(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching products:', error);
      setLoading(false);
    }
  };

  // ✅ NEW: Handle multiple image selection for new product
  const handleImagesChange = (e) => {
    const files = Array.from(e.target.files);
    
    if (files.length + imageFiles.length > 5) {
      setValidationMessage('You can upload maximum 5 images');
      setShowValidationModal(true);
      return;
    }

    for (const file of files) {
      if (!file.type.startsWith('image/')) {
        setValidationMessage('Please select only image files');
        setShowValidationModal(true);
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        setValidationMessage('Each image must be less than 5MB');
        setShowValidationModal(true);
        return;
      }
    }

    const newFiles = [...imageFiles, ...files];
    setImageFiles(newFiles);

    const newPreviews = [...imagePreviews];
    files.forEach(file => {
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
    const totalImages = existingImagesCount + files.length + editImageFiles.length;
    
    if (totalImages > 5) {
      setValidationMessage('You can have maximum 5 images total');
      setShowValidationModal(true);
      return;
    }

    for (const file of files) {
      if (!file.type.startsWith('image/')) {
        setValidationMessage('Please select only image files');
        setShowValidationModal(true);
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        setValidationMessage('Each image must be less than 5MB');
        setShowValidationModal(true);
        return;
      }
    }

    const newFiles = [...editImageFiles, ...files];
    setEditImageFiles(newFiles);

    const newPreviews = [...editImagePreviews];
    files.forEach(file => {
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

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  // ✅ UPDATED: Handle add product with multiple images
  const handleAddProduct = async () => {
    if (!newProduct.name || !newProduct.category || !newProduct.price || !newProduct.stock || imageFiles.length === 0) {
      setValidationMessage('Please fill in all required fields (including at least one image)');
      setShowValidationModal(true);
      return;
    }

    try {
      const formData = new FormData();
      formData.append('name', newProduct.name);
      formData.append('category', newProduct.category);
      formData.append('price', parseFloat(newProduct.price) || 0);
      if (newProduct.originalPrice) {
        formData.append('originalPrice', parseFloat(newProduct.originalPrice));
      }
      formData.append('stock', parseInt(newProduct.stock) || 0);
      formData.append('status', newProduct.status);
      formData.append('description', newProduct.description || '');
      formData.append('adLink', newProduct.adLink || '');
      formData.append('videoUrl', newProduct.videoUrl || '');
      formData.append('rating', newProduct.rating || 0);

      imageFiles.forEach((file) => {
        formData.append('images', file);
      });

      await productsAPI.create(formData);
      
      fetchProducts();
      setShowAddModal(false);
      setNewProduct({
        name: '',
        category: '',
        price: '',
        originalPrice: '',
        stock: '',
        status: 'Shown',
        description: '',
        adLink: '',
        videoUrl: '',
        rating: 0
      });
      setImageFiles([]);
      setImagePreviews([]);
    } catch (error) {
      console.error('Error creating product:', error);
      setValidationMessage('Failed to create product. Please try again.');
      setShowValidationModal(true);
    }
  };

  // ✅ UPDATED: Handle edit product
  const handleEditProduct = async () => {
    if (!selectedProduct.name || !selectedProduct.category || !selectedProduct.price) {
      setValidationMessage('Please fill in all required fields');
      setShowValidationModal(true);
      return;
    }

    try {
      const formData = new FormData();
      formData.append('name', selectedProduct.name);
      formData.append('category', selectedProduct.category);
      formData.append('price', parseFloat(selectedProduct.price) || 0);
      if (selectedProduct.originalPrice) {
        formData.append('originalPrice', parseFloat(selectedProduct.originalPrice));
      }
      formData.append('stock', parseInt(selectedProduct.stock) || 0);
      formData.append('status', selectedProduct.status);
      formData.append('description', selectedProduct.description || '');
      formData.append('adLink', selectedProduct.adLink || '');
      formData.append('videoUrl', selectedProduct.videoUrl || '');
      formData.append('rating', selectedProduct.rating || 0);

      if (editImageFiles.length > 0) {
        editImageFiles.forEach((file) => {
          formData.append('images', file);
        });
      }

      await productsAPI.update(selectedProduct._id, formData);
      
      fetchProducts();
      setShowEditModal(false);
      setSelectedProduct(null);
      setEditImageFiles([]);
      setEditImagePreviews([]);
    } catch (error) {
      console.error('Error updating product:', error);
      setValidationMessage('Failed to update product. Please try again.');
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
      console.error('Error deleting product:', error);
      setValidationMessage('Failed to delete product. Please try again.');
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
    switch(status) {
      case 'Shown': return 'shown';
      case 'Hidden': return 'hidden';
      case 'Out of Stock': return 'outofstock';
      default: return 'shown';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return 'https://via.placeholder.com/60';
    return imagePath.startsWith('/uploads') 
      ? `http://localhost:5000${imagePath}` 
      : imagePath;
  };

  return (
    <div style={{ fontFamily: "'Cairo', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;900&family=Bebas+Neue&display=swap');
        
        * { margin: 0; padding: 0; box-sizing: border-box; }
        
        .products-container { padding: 2rem; background: #1a1a1a; min-height: 100vh; }
        
        .products-header { margin-bottom: 2rem; }
        
        .page-title { font-family: 'Bebas Neue', sans-serif; font-size: 2rem; color: #f4edd8; letter-spacing: 2px; margin-bottom: 0.5rem; }
        
        .page-subtitle { color: #999; font-size: 0.9rem; }
        
        .filters-section { background: #2a2a2a; border-radius: 16px; padding: 1.5rem; margin-bottom: 2rem; border: 1px solid rgba(244, 237, 216, 0.1); }
        
        .filters-row { display: grid; grid-template-columns: 2fr 1fr 1fr auto; gap: 1rem; align-items: center; }
        
        .search-box { position: relative; }
        
        .search-input { width: 100%; padding: 0.8rem 1rem 0.8rem 3rem; background: #1a1a1a; border: 2px solid rgba(196, 214, 0, 0.2); border-radius: 10px; color: #f4edd8; font-size: 0.9rem; font-family: 'Cairo', sans-serif; transition: all 0.3s ease; }
        
        .search-input:focus { outline: none; border-color: #c4d600; }
        
        .search-input::placeholder { color: #666; }
        
        .search-icon { position: absolute; left: 1rem; top: 50%; transform: translateY(-50%); color: #999; font-size: 1.1rem; }
        
        .filter-select { padding: 0.8rem 1rem; background: #1a1a1a; border: 2px solid rgba(196, 214, 0, 0.2); border-radius: 10px; color: #f4edd8; font-size: 0.9rem; font-family: 'Cairo', sans-serif; cursor: pointer; transition: all 0.3s ease; }
        
        .filter-select:focus { outline: none; border-color: #c4d600; }
        
        .filter-select option { background: #2a2a2a; color: #f4edd8; }
        
        .add-product-btn { padding: 0.8rem 1.5rem; background: linear-gradient(135deg, #ff6b35, #e85d2a); color: white; border: none; border-radius: 10px; font-weight: 700; font-size: 0.9rem; cursor: pointer; transition: all 0.3s ease; font-family: 'Cairo', sans-serif; display: flex; align-items: center; gap: 0.5rem; white-space: nowrap; }
        
        .add-product-btn:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(255, 107, 53, 0.4); }
        
        .products-table-container { background: #2a2a2a; border-radius: 16px; padding: 1.5rem; border: 1px solid rgba(244, 237, 216, 0.1); overflow-x: auto; }
        
        .products-table { width: 100%; border-collapse: collapse; }
        
        .products-table th { text-align: left; padding: 1rem; color: #999; font-size: 0.85rem; font-weight: 600; border-bottom: 1px solid rgba(244, 237, 216, 0.1); white-space: nowrap; }
        
        .products-table td { text-align: left; padding: 1rem; color: #ccc; font-size: 0.9rem; border-bottom: 1px solid rgba(244, 237, 216, 0.05); vertical-align: middle; }
        
        .products-table tr:hover td { background: rgba(196, 214, 0, 0.05); }
        
        .product-id { color: #c4d600; font-weight: 700; font-family: monospace; }
        
        .product-image-cell { width: 80px; }
        
        .product-table-image { width: 60px; height: 60px; border-radius: 10px; object-fit: cover; box-shadow: 0 2px 8px rgba(0,0,0,0.2); }
        
        .product-name-cell { font-weight: 600; color: #f4edd8; }
        
        .product-category { font-size: 0.75rem; color: #999; margin-top: 0.2rem; }
        
        .price-cell { font-weight: 700; color: #f4edd8; }
        
        .original-price { font-size: 0.75rem; color: #999; text-decoration: line-through; margin-right: 0.3rem; }
        
        .discount-label { font-size: 0.7rem; background: linear-gradient(135deg, #ff6b35, #e85d2a); color: white; padding: 2px 6px; border-radius: 8px; margin-left: 0.3rem; }
        
        .stock-cell { font-weight: 600; }
        
        .stock-low { color: #ff6b35; }
        
        .stock-ok { color: #c4d600; }
        
        .stock-out { color: #999; }
        
        .status-badge { padding: 0.4rem 0.8rem; border-radius: 20px; font-size: 0.75rem; font-weight: 600; display: inline-block; }
        
        .status-badge.shown { background: rgba(196, 214, 0, 0.2); color: #c4d600; }
        
        .status-badge.hidden { background: rgba(153, 153, 153, 0.2); color: #999; }
        
        .status-badge.outofstock { background: rgba(255, 107, 53, 0.2); color: #ff6b35; }
        
        .fb-link { width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, #1877f2, #0d65d9); color: white; border-radius: 8px; cursor: pointer; transition: all 0.3s ease; text-decoration: none; font-size: 1rem; }
        
        .fb-link:hover { transform: scale(1.1); box-shadow: 0 4px 12px rgba(24, 119, 242, 0.4); }
        
        .fb-link.disabled { background: rgba(153, 153, 153, 0.2); color: #666; cursor: not-allowed; pointer-events: none; }
        
        .actions-cell { display: flex; gap: 0.5rem; }
        
        .action-btn { width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; border-radius: 8px; cursor: pointer; transition: all 0.3s ease; border: none; font-size: 1rem; }
        
        .action-btn.view { background: rgba(100, 150, 255, 0.1); color: #6496ff; }
        
        .action-btn.view:hover { background: #6496ff; color: white; transform: scale(1.1); }
        
        .action-btn.edit { background: rgba(196, 214, 0, 0.1); color: #c4d600; }
        
        .action-btn.edit:hover { background: #c4d600; color: #2a2a2a; transform: scale(1.1); }
        
        .action-btn.delete { background: rgba(255, 107, 53, 0.1); color: #ff6b35; }
        
        .action-btn.delete:hover { background: #ff6b35; color: white; transform: scale(1.1); }
        
        .modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0, 0, 0, 0.8); display: flex; align-items: center; justify-content: center; z-index: 1000; animation: fadeIn 0.3s ease; }
        
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        
        .modal-content { background: #2a2a2a; border-radius: 20px; padding: 2rem; max-width: 800px; width: 90%; max-height: 90vh; overflow-y: auto; border: 1px solid rgba(244, 237, 216, 0.1); animation: slideUp 0.3s ease; }
        
        @keyframes slideUp { from { transform: translateY(50px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        
        .modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
        
        .modal-title { font-family: 'Bebas Neue', sans-serif; font-size: 1.8rem; color: #f4edd8; letter-spacing: 2px; }
        
        .modal-close { width: 35px; height: 35px; display: flex; align-items: center; justify-content: center; background: rgba(255, 107, 53, 0.1); color: #ff6b35; border: none; border-radius: 50%; font-size: 1.5rem; cursor: pointer; transition: all 0.3s ease; }
        
        .modal-close:hover { background: #ff6b35; color: white; transform: rotate(90deg); }
        
        .form-row { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; }
        
        .form-group { margin-bottom: 1.2rem; }
        
        .form-group.full { grid-column: 1 / -1; }
        
        .modal-label { display: block; color: #c4d600; font-size: 0.85rem; font-weight: 700; margin-bottom: 0.5rem; text-transform: uppercase; letter-spacing: 1px; }
        
        .modal-input { width: 100%; padding: 0.8rem 1rem; background: #1a1a1a; border: 2px solid rgba(196, 214, 0, 0.2); border-radius: 10px; color: #f4edd8; font-size: 0.9rem; font-family: 'Cairo', sans-serif; transition: all 0.3s ease; }
        
        .modal-input:focus { outline: none; border-color: #c4d600; }
        
        .modal-textarea { resize: vertical; min-height: 80px; }
        
        .modal-actions { display: flex; gap: 1rem; margin-top: 2rem; }
        
        .modal-btn { flex: 1; padding: 0.9rem; border: none; border-radius: 10px; font-weight: 700; font-size: 0.9rem; cursor: pointer; transition: all 0.3s ease; font-family: 'Cairo', sans-serif; }
        
        .modal-btn.primary { background: linear-gradient(135deg, #ff6b35, #e85d2a); color: white; }
        
        .modal-btn.primary:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(255, 107, 53, 0.4); }
        
        .modal-btn.secondary { background: rgba(196, 214, 0, 0.1); color: #c4d600; border: 2px solid #c4d600; }
        
        .modal-btn.secondary:hover { background: #c4d600; color: #2a2a2a; }

        /* ✅ NEW: Multiple Images Upload Styles */
        .images-upload-section {
          margin-bottom: 1.5rem;
        }

        .images-upload-label {
          display: block;
          color: #c4d600;
          font-size: 0.85rem;
          font-weight: 700;
          margin-bottom: 0.8rem;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .images-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
          gap: 1rem;
          margin-bottom: 1rem;
        }

        .image-preview-item {
          position: relative;
          width: 100%;
          height: 150px;
          border-radius: 12px;
          overflow: hidden;
          border: 2px solid rgba(196, 214, 0, 0.3);
          background: #1a1a1a;
        }

        .image-preview-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .remove-image-btn {
          position: absolute;
          top: 8px;
          right: 8px;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: #ff6b35;
          color: white;
          border: none;
          font-size: 1.2rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
          z-index: 10;
        }

        .remove-image-btn:hover {
          background: #e85d2a;
          transform: scale(1.1);
        }

        .add-images-btn {
          width: 100%;
          height: 150px;
          border: 2px dashed rgba(196, 214, 0, 0.3);
          border-radius: 12px;
          background: rgba(196, 214, 0, 0.05);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .add-images-btn:hover {
          border-color: #c4d600;
          background: rgba(196, 214, 0, 0.1);
        }

        .add-images-icon {
          font-size: 2.5rem;
          margin-bottom: 0.5rem;
          color: #c4d600;
        }

        .add-images-text {
          color: #999;
          font-size: 0.85rem;
          text-align: center;
        }

        .add-images-hint {
          color: #666;
          font-size: 0.75rem;
          margin-top: 0.3rem;
        }

        .file-input-hidden {
          display: none;
        }

        /* ✅ NEW: Star Rating Styles */
        .rating-section {
          margin-bottom: 1.5rem;
        }

        .rating-label {
          display: block;
          color: #c4d600;
          font-size: 0.85rem;
          font-weight: 700;
          margin-bottom: 0.8rem;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .star-rating {
          display: flex;
          gap: 0.5rem;
          font-size: 2.5rem;
          cursor: pointer;
        }

        .star {
          transition: all 0.2s ease;
          cursor: pointer;
        }

        .star.filled {
          color: #ff6b35;
        }

        .star.empty {
          color: #444;
        }

        .star:hover {
          transform: scale(1.1);
        }

        .rating-hint {
          color: #666;
          font-size: 0.75rem;
          margin-top: 0.5rem;
        }
        
        .product-view-header { display: flex; gap: 2rem; margin-bottom: 2rem; padding-bottom: 2rem; border-bottom: 1px solid rgba(244, 237, 216, 0.1); }
        
        .product-view-image { width: 200px; height: 200px; border-radius: 16px; object-fit: cover; box-shadow: 0 8px 24px rgba(0,0,0,0.3); }
        
        .product-view-info { flex: 1; }
        
        .product-view-name { font-family: 'Bebas Neue', sans-serif; font-size: 2rem; color: #f4edd8; margin-bottom: 0.5rem; letter-spacing: 1px; }
        
        .product-view-category { color: #999; font-size: 0.9rem; margin-bottom: 1rem; }
        
        .product-view-price { font-size: 2rem; color: #ff6b35; font-weight: 700; margin-bottom: 0.5rem; }
        
        .product-view-discount { display: inline-block; background: linear-gradient(135deg, #ff6b35, #e85d2a); color: white; padding: 4px 10px; border-radius: 12px; font-size: 0.85rem; margin-left: 0.5rem; }
        
        .detail-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1.5rem; }
        
        .detail-item { background: #1a1a1a; padding: 1rem; border-radius: 10px; border: 1px solid rgba(196, 214, 0, 0.1); }
        
        .detail-label { color: #999; font-size: 0.8rem; font-weight: 600; margin-bottom: 0.5rem; }
        
        .detail-value { color: #f4edd8; font-size: 0.95rem; font-weight: 600; }
        
        .detail-item.full { grid-column: 1 / -1; }
        
        .empty-state { text-align: center; padding: 3rem; color: #999; }
        
        .empty-icon { font-size: 3rem; margin-bottom: 1rem; }
        
        .loading-state { text-align: center; padding: 3rem; color: #999; }
        
        .loading-spinner { font-size: 2rem; margin-bottom: 1rem; animation: spin 1s linear infinite; }
        
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        
        @media (max-width: 1024px) {
          .filters-row { grid-template-columns: 1fr; }
          .form-row { grid-template-columns: 1fr; }
          .detail-grid { grid-template-columns: 1fr; }
          .product-view-header { flex-direction: column; }
        }
        
        @media (max-width: 768px) {
          .products-container { padding: 1rem; }
          .filters-section { padding: 1rem; }
          .filters-row { gap: 0.8rem; }
          .add-product-btn { width: 100%; justify-content: center; }
          
          .products-table-container { padding: 1rem; overflow-x: auto; -webkit-overflow-scrolling: touch; }
          .products-table { min-width: 900px; font-size: 0.85rem; }
          .products-table th, .products-table td { padding: 0.7rem 0.5rem; }
          .product-table-image { width: 50px; height: 50px; }
          
          .modal-content { padding: 1.5rem; max-width: 95%; }
          .modal-title { font-size: 1.5rem; }
          .modal-input { font-size: 16px; }
          .actions-cell { gap: 0.3rem; }
          .action-btn { width: 28px; height: 28px; font-size: 0.9rem; }
          
          .product-view-image { width: 150px; height: 150px; }
          .product-view-name { font-size: 1.5rem; }
          .product-view-price { font-size: 1.5rem; }

          .images-grid {
            grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
          }

          .image-preview-item, .add-images-btn {
            height: 120px;
          }
        }
        
        @media (max-width: 480px) {
          .products-container { padding: 0.8rem; }
          .page-title { font-size: 1.5rem; }
          .filters-section { padding: 0.8rem; }
          .modal-content { padding: 1rem; }
          .product-table-image { width: 40px; height: 40px; }
          .product-view-image { width: 120px; height: 120px; }
          .discount-label { font-size: 0.65rem; padding: 1px 4px; }
        }
      `}</style>

      <div className="products-container">
        <div className="products-header">
          <div className="page-title">Products Management</div>
          <div className="page-subtitle">Manage your store's product catalog</div>
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
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>

            <select 
              className="filter-select"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Statuses</option>
              {statuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>

            <button className="add-product-btn" onClick={() => setShowAddModal(true)}>
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
                    <td className="product-id">PRD-{product._id?.slice(-6) || 'N/A'}</td>
                    <td className="product-image-cell">
                      <img 
                        src={getImageUrl(product.image)} 
                        alt={product.name} 
                        className="product-table-image" 
                      />
                    </td>
                    <td>
                      <div className="product-name-cell">{product.name}</div>
                      <div className="product-category">{product.category}</div>
                    </td>
                    <td className="price-cell">
                      {product.originalPrice && product.originalPrice > product.price && (
                        <span className="original-price">{product.originalPrice} DT</span>
                      )}
                      <div>
                        {product.price} DT
                        {product.discount && product.discount > 0 && (
                          <span className="discount-label">-{product.discount}%</span>
                        )}
                      </div>
                    </td>
                    <td className={`stock-cell ${
                      product.stock === 0 ? 'stock-out' : 
                      product.stock < 20 ? 'stock-low' : 'stock-ok'
                    }`}>
                      {product.stock === 0 ? 'Out of Stock' : `${product.stock} units`}
                    </td>
                    <td>
                      <span className={`status-badge ${getStatusColor(product.status)}`}>
                        {product.status}
                      </span>
                    </td>
                    <td>
                      {product.adLink ? (
                        <a href={product.adLink} target="_blank" rel="noopener noreferrer" className="fb-link" title="View Facebook Ad">
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
                        <button className="action-btn view" onClick={() => handleViewProduct(product)} title="View">
                          👁️
                        </button>
                        <button className="action-btn edit" onClick={() => handleEditClick(product)} title="Edit">
                          ✏️
                        </button>
                        <button className="action-btn delete" onClick={() => handleDeleteProduct(product._id)} title="Delete">
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
              <button className="modal-close" onClick={() => setShowAddModal(false)}>×</button>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="modal-label">Product Name *</label>
                <input
                  type="text"
                  className="modal-input"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                  placeholder="Enter product name"
                />
              </div>

              <div className="form-group">
                <label className="modal-label">Category *</label>
                <select
                  className="modal-input"
                  value={newProduct.category}
                  onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                >
                  <option value="">Select category</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
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
                  onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                  placeholder="299"
                />
              </div>

              <div className="form-group">
                <label className="modal-label">Original Price (Optional)</label>
                <input
                  type="number"
                  className="modal-input"
                  value={newProduct.originalPrice}
                  onChange={(e) => setNewProduct({...newProduct, originalPrice: e.target.value})}
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
                  onChange={(e) => setNewProduct({...newProduct, stock: e.target.value})}
                  placeholder="50"
                />
              </div>

              <div className="form-group">
                <label className="modal-label">Status *</label>
                <select
                  className="modal-input"
                  value={newProduct.status}
                  onChange={(e) => setNewProduct({...newProduct, status: e.target.value})}
                >
                  {statuses.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* ✅ NEW: Multiple Images Upload Section */}
            <div className="form-group full">
              <div className="images-upload-section">
                <label className="images-upload-label">Product Images (Max 5) *</label>
                
                <div className="images-grid">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="image-preview-item">
                      <img src={preview} alt={`Preview ${index + 1}`} className="image-preview-img" />
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
                      onClick={() => document.getElementById('images-upload').click()}
                    >
                      <div className="add-images-icon">📸</div>
                      <div className="add-images-text">
                        {imageFiles.length === 0 ? 'Click to upload images' : 'Add more images'}
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
                onChange={(e) => setNewProduct({...newProduct, videoUrl: e.target.value})}
                placeholder="https://www.youtube.com/embed/..."
              />
              <div style={{ fontSize: '0.75rem', color: '#666', marginTop: '0.5rem' }}>
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
                      className={`star ${star <= newProduct.rating ? 'filled' : 'empty'}`}
                      onClick={() => setNewProduct({...newProduct, rating: star})}
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

            <div className="form-group full">
              <label className="modal-label">Description</label>
              <textarea
                className="modal-input modal-textarea"
                value={newProduct.description}
                onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                placeholder="Product description..."
              />
            </div>

            <div className="form-group full">
              <label className="modal-label">Facebook Ad Link</label>
              <input
                type="text"
                className="modal-input"
                value={newProduct.adLink}
                onChange={(e) => setNewProduct({...newProduct, adLink: e.target.value})}
                placeholder="https://facebook.com/ads/..."
              />
            </div>

            <div className="modal-actions">
              <button className="modal-btn secondary" onClick={() => setShowAddModal(false)}>
                Cancel
              </button>
              <button className="modal-btn primary" onClick={handleAddProduct}>
                Add Product
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Product Modal - Same as before */}
      {showViewModal && selectedProduct && (
        <div className="modal-overlay" onClick={() => setShowViewModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">Product Details</div>
              <button className="modal-close" onClick={() => setShowViewModal(false)}>×</button>
            </div>

            <div className="product-view-header">
              <img 
                src={getImageUrl(selectedProduct.image)} 
                alt={selectedProduct.name} 
                className="product-view-image" 
              />
              <div className="product-view-info">
                <div className="product-view-name">{selectedProduct.name}</div>
                <div className="product-view-category">{selectedProduct.category}</div>
                <div className="product-view-price">
                  {selectedProduct.price} DT
                  {selectedProduct.discount && selectedProduct.discount > 0 && (
                    <span className="product-view-discount">-{selectedProduct.discount}%</span>
                  )}
                </div>
                {selectedProduct.originalPrice && selectedProduct.originalPrice > selectedProduct.price && (
                  <div style={{ color: '#999', textDecoration: 'line-through', fontSize: '1.1rem' }}>
                    {selectedProduct.originalPrice} DT
                  </div>
                )}
              </div>
            </div>

            <div className="detail-grid">
              <div className="detail-item">
                <div className="detail-label">Product ID</div>
                <div className="detail-value" style={{ color: '#c4d600' }}>PRD-{selectedProduct._id?.slice(-6) || 'N/A'}</div>
              </div>

              <div className="detail-item">
                <div className="detail-label">Stock</div>
                <div className="detail-value">{selectedProduct.stock} units</div>
              </div>

              <div className="detail-item">
                <div className="detail-label">Status</div>
                <div className="detail-value">
                  <span className={`status-badge ${getStatusColor(selectedProduct.status)}`}>
                    {selectedProduct.status}
                  </span>
                </div>
              </div>

              <div className="detail-item">
                <div className="detail-label">Created Date</div>
                <div className="detail-value">{formatDate(selectedProduct.createdAt)}</div>
              </div>

              {selectedProduct.rating > 0 && (
                <div className="detail-item">
                  <div className="detail-label">Rating</div>
                  <div className="detail-value">
                    {'★'.repeat(selectedProduct.rating)}{'☆'.repeat(5 - selectedProduct.rating)} ({selectedProduct.rating}/5)
                  </div>
                </div>
              )}

              {selectedProduct.videoUrl && (
                <div className="detail-item">
                  <div className="detail-label">Video URL</div>
                  <div className="detail-value" style={{ fontSize: '0.8rem', wordBreak: 'break-all' }}>
                    {selectedProduct.videoUrl}
                  </div>
                </div>
              )}

              <div className="detail-item full">
                <div className="detail-label">Description</div>
                <div className="detail-value">{selectedProduct.description || 'No description'}</div>
              </div>

              <div className="detail-item full">
                <div className="detail-label">Facebook Ad Link</div>
                <div className="detail-value">
                  {selectedProduct.adLink ? (
                    <a href={selectedProduct.adLink} target="_blank" rel="noopener noreferrer" style={{ color: '#6496ff' }}>
                      {selectedProduct.adLink}
                    </a>
                  ) : (
                    <span style={{ color: '#999' }}>No ad link</span>
                  )}
                </div>
              </div>

              {selectedProduct.images && selectedProduct.images.length > 1 && (
                <div className="detail-item full">
                  <div className="detail-label">All Images ({selectedProduct.images.length})</div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '0.5rem', marginTop: '0.5rem' }}>
                    {selectedProduct.images.map((img, index) => (
                      <img 
                        key={index} 
                        src={getImageUrl(img)} 
                        alt={`${selectedProduct.name} ${index + 1}`}
                        style={{ width: '100%', height: '100px', objectFit: 'cover', borderRadius: '8px' }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="modal-actions">
              <button className="modal-btn secondary" onClick={() => setShowViewModal(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {showEditModal && selectedProduct && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">Edit Product</div>
              <button className="modal-close" onClick={() => setShowEditModal(false)}>×</button>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="modal-label">Product Name *</label>
                <input
                  type="text"
                  className="modal-input"
                  value={selectedProduct.name}
                  onChange={(e) => setSelectedProduct({...selectedProduct, name: e.target.value})}
                />
              </div>

              <div className="form-group">
                <label className="modal-label">Category *</label>
                <select
                  className="modal-input"
                  value={selectedProduct.category}
                  onChange={(e) => setSelectedProduct({...selectedProduct, category: e.target.value})}
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
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
                  onChange={(e) => setSelectedProduct({...selectedProduct, price: parseFloat(e.target.value)})}
                />
              </div>

              <div className="form-group">
                <label className="modal-label">Original Price</label>
                <input
                  type="number"
                  className="modal-input"
                  value={selectedProduct.originalPrice || ''}
                  onChange={(e) => setSelectedProduct({...selectedProduct, originalPrice: parseFloat(e.target.value) || undefined})}
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
                  onChange={(e) => setSelectedProduct({...selectedProduct, stock: parseInt(e.target.value)})}
                />
              </div>

              <div className="form-group">
                <label className="modal-label">Status *</label>
                <select
                  className="modal-input"
                  value={selectedProduct.status}
                  onChange={(e) => setSelectedProduct({...selectedProduct, status: e.target.value})}
                >
                  {statuses.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* ✅ NEW: Edit Images Section */}
            <div className="form-group full">
              <div className="images-upload-section">
                <label className="images-upload-label">Product Images</label>
                
                {/* Show existing images */}
                {selectedProduct.images && selectedProduct.images.length > 0 && (
                  <div>
                    <div style={{ fontSize: '0.75rem', color: '#999', marginBottom: '0.5rem' }}>
                      Current images ({selectedProduct.images.length}):
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '0.5rem', marginBottom: '1rem' }}>
                      {selectedProduct.images.map((img, index) => (
                        <img 
                          key={index} 
                          src={getImageUrl(img)} 
                          alt={`Current ${index + 1}`}
                          style={{ width: '100%', height: '100px', objectFit: 'cover', borderRadius: '8px', border: '2px solid rgba(196, 214, 0, 0.3)' }}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Add new images */}
                <div className="images-grid">
                  {editImagePreviews.map((preview, index) => (
                    <div key={index} className="image-preview-item">
                      <img src={preview} alt={`New ${index + 1}`} className="image-preview-img" />
                      <button 
                        className="remove-image-btn"
                        onClick={() => removeEditImage(index)}
                        type="button"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  
                  {(editImageFiles.length + (selectedProduct.images?.length || 0)) < 5 && (
                    <div 
                      className="add-images-btn"
                      onClick={() => document.getElementById('edit-images-upload').click()}
                    >
                      <div className="add-images-icon">📸</div>
                      <div className="add-images-text">
                        Add new images
                      </div>
                      <div className="add-images-hint">
                        {editImageFiles.length + (selectedProduct.images?.length || 0)}/5 total
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

                <div style={{ fontSize: '0.75rem', color: '#666', marginTop: '0.5rem' }}>
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
                value={selectedProduct.videoUrl || ''}
                onChange={(e) => setSelectedProduct({...selectedProduct, videoUrl: e.target.value})}
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
                      className={`star ${star <= (selectedProduct.rating || 0) ? 'filled' : 'empty'}`}
                      onClick={() => setSelectedProduct({...selectedProduct, rating: star})}
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

            <div className="form-group full">
              <label className="modal-label">Description</label>
              <textarea
                className="modal-input modal-textarea"
                value={selectedProduct.description || ''}
                onChange={(e) => setSelectedProduct({...selectedProduct, description: e.target.value})}
              />
            </div>

            <div className="form-group full">
              <label className="modal-label">Facebook Ad Link</label>
              <input
                type="text"
                className="modal-input"
                value={selectedProduct.adLink || ''}
                onChange={(e) => setSelectedProduct({...selectedProduct, adLink: e.target.value})}
              />
            </div>

            <div className="modal-actions">
              <button className="modal-btn secondary" onClick={() => setShowEditModal(false)}>
                Cancel
              </button>
              <button className="modal-btn primary" onClick={handleEditProduct}>
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
  );
}