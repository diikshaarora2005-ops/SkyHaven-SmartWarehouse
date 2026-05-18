import { useEffect, useState } from "react";
import axios from "axios";
import {
FaBox,
FaWarehouse,
FaChartLine,
FaBars,
FaPlus,
FaTrash,
FaEdit,
} from "react-icons/fa";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function App() {
const [products, setProducts] = useState([]);
const [search, setSearch] = useState("");
const [loading, setLoading] = useState(true);
const [showForm, setShowForm] = useState(false);
const [editingId, setEditingId] = useState(null);

const [newProduct, setNewProduct] = useState({
productName: "",
skuCode: "",
category: "",
price: "",
quantity: "",
});

useEffect(() => {
  axios
    .get("https://skyhavenbackend.onrender.com/api/products")
    .then((response) => {
      console.log("API DATA:", response.data);

      setProducts(
  Array.isArray(response.data)
    ? response.data
    : response.data.data || []
);

      setLoading(false);
    })
    .catch((error) => {
      console.error("Error fetching products:", error);

      setLoading(false);
    });
}, []);

const totalProducts = products?.length || 0;

const totalQuantity = (products || []).reduce(
(sum, item) => sum + Number(item.quantity),
0
);
const categoryData = [];

products.forEach((product) => {
  const existing = categoryData.find(
    (item) => item.name === product.category
  );

  if (existing) {
    existing.value += 1;
  } else {
    categoryData.push({
      name: product.category,
      value: 1,
    });
  }
});

const COLORS = [
  "#ffb6c1",
  "#ffd6e7",
  "#ffc0cb",
  "#ff69b4",
  "#ffe4ec",
];

return (
<div
style={{
minHeight: "100vh",
background: "#0f0f0f",
display: "flex",
color: "white",
fontFamily: "Poppins, sans-serif",
overflow: "hidden",
position: "relative",
}}
>
{/* Background Glow */}


  <div
    style={{
      position: "absolute",
      width: "400px",
      height: "400px",
      background: "rgba(255,182,193,0.12)",
      borderRadius: "50%",
      filter: "blur(120px)",
      top: "-100px",
      left: "-100px",
    }}
  ></div>

  <div
    style={{
      position: "absolute",
      width: "300px",
      height: "300px",
      background: "rgba(255,105,180,0.08)",
      borderRadius: "50%",
      filter: "blur(100px)",
      bottom: "-50px",
      right: "-50px",
    }}
  ></div>

  {/* Sidebar */}

  <div
    style={{
      width: "260px",
      background: "rgba(255,255,255,0.05)",
      backdropFilter: "blur(20px)",
      borderRight: "1px solid rgba(255,255,255,0.08)",
      padding: "30px 20px",
      zIndex: 2,
    }}
  >
    <h1
      style={{
        fontSize: "28px",
        marginBottom: "50px",
        color: "#ffd6e7",
        fontWeight: "600",
        letterSpacing: "1px",
      }}
    >
      ADA Warehouse
    </h1>

    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        fontSize: "17px",
      }}
    >
      {[
        { icon: <FaBars />, name: "Dashboard" },
        { icon: <FaBox />, name: "Products" },
        { icon: <FaWarehouse />, name: "Inventory" },
        { icon: <FaChartLine />, name: "Analytics" },
      ].map((item, index) => (
        <div
          key={index}
          onMouseEnter={(e) => {
            e.currentTarget.style.background =
              "rgba(255,255,255,0.08)";
            e.currentTarget.style.transform =
              "translateX(8px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background =
              "transparent";
            e.currentTarget.style.transform =
              "translateX(0px)";
          }}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            color: "#fff",
            cursor: "pointer",
            padding: "14px 16px",
            borderRadius: "14px",
            transition: "all 0.3s ease",
          }}
        >
          {item.icon}
          {item.name}
        </div>
      ))}
    </div>
  </div>

  {/* Main Content */}

  <div
    style={{
      flex: 1,
      padding: "40px",
      zIndex: 2,
    }}
  >
    <h1
      style={{
        fontSize: "42px",
        marginBottom: "10px",
        color: "#ffe4ec",
        fontWeight: "600",
      }}
    >
      Smart Warehouse
    </h1>

    <p
      style={{
        color: "#cfcfcf",
        marginBottom: "40px",
        fontSize: "16px",
      }}
    >
      Elegant inventory management dashboard
    </p>

    <button
      onClick={() => {
        setEditingId(null);

        setNewProduct({
          productName: "",
          skuCode: "",
          category: "",
          price: "",
          quantity: "",
        });

        setShowForm(true);
      }}
      style={{
        marginBottom: "30px",
        padding: "14px 22px",
        border: "none",
        borderRadius: "16px",
        background: "rgba(255,105,180,0.18)",
        color: "white",
        fontSize: "16px",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        gap: "10px",
        backdropFilter: "blur(18px)",
        boxShadow: "0 8px 30px rgba(255,105,180,0.15)",
      }}
    >
      <FaPlus />
      Add Product
    </button>

    {showForm && (
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: "rgba(0,0,0,0.6)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 1000,
        }}
      >
        <div
          style={{
            width: "400px",
            background: "rgba(255,255,255,0.08)",
            backdropFilter: "blur(20px)",
            padding: "30px",
            borderRadius: "24px",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <h2
            style={{
              marginBottom: "20px",
              color: "#ffe4ec",
            }}
          >
            {editingId ? "Edit Product" : "Add Product"}
          </h2>

          {[
            "productName",
            "skuCode",
            "category",
            "price",
            "quantity",
          ].map((field) => (
            <input
              key={field}
              type="text"
              placeholder={field}
              value={newProduct[field]}
              onChange={(e) =>
                setNewProduct({
                  ...newProduct,
                  [field]: e.target.value,
                })
              }
              style={{
                width: "100%",
                padding: "14px",
                marginBottom: "14px",
                borderRadius: "14px",
                border: "1px solid rgba(255,255,255,0.08)",
                background: "rgba(255,255,255,0.05)",
                color: "white",
                outline: "none",
              }}
            />
          ))}

          <div
            style={{
              display: "flex",
              gap: "14px",
              marginTop: "10px",
            }}
          >
            <button
              onClick={() => setShowForm(false)}
              style={{
                flex: 1,
                padding: "14px",
                borderRadius: "14px",
                border: "none",
                background: "#444",
                color: "white",
                cursor: "pointer",
              }}
            >
              Cancel
            </button>

            <button
              onClick={() => {
                if (editingId) {
                  axios
                    .put(
                      `https://skyhavenbackend.onrender.com/api/products/${editingId}`,
                      newProduct
                    )
                    .then((response) => {
                      setProducts(
                        products.map((item) =>
                          item.id === editingId
                            ? response.data
                            : item
                        )
                      );

                      setShowForm(false);
                      setEditingId(null);
                      toast.success("Product updated ✨");
                    })
                    .catch((error) => {
                      console.error("Update error:", error);
                    });
                } else {
                  axios
                    .post(
                      "https://skyhavenbackend.onrender.com/api/products",
                      newProduct
                    )
                    .then((response) => {
                      setProducts([
                        ...products,
                        response.data,
                      ]);

                      setNewProduct({
                        productName: "",
                        skuCode: "",
                        category: "",
                        price: "",
                        quantity: "",
                      });

                      setShowForm(false);
                      toast.success("Product added successfully 💖");
                    })
                    .catch((error) => {
                      console.error(
                        "Error adding product:",
                        error
                      );
                    });
                }
              }}
              style={{
                flex: 1,
                padding: "14px",
                borderRadius: "14px",
                border: "none",
                background: "hotpink",
                color: "white",
                cursor: "pointer",
              }}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    )}

    {/* Stats Cards */}

    <div
      style={{
        display: "grid",
        gridTemplateColumns:
          "repeat(auto-fit, minmax(250px, 1fr))",
        gap: "25px",
        marginBottom: "40px",
      }}
    >
      <div
        style={{
          background: "rgba(255,255,255,0.06)",
          backdropFilter: "blur(18px)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: "24px",
          padding: "30px",
          boxShadow:
            "0 8px 30px rgba(255,105,180,0.08)",
        }}
      >
        <h3
          style={{
            color: "#ffcad4",
            marginBottom: "12px",
            fontWeight: "500",
          }}
        >
          Total Products
        </h3>

        <h1
          style={{
            fontSize: "42px",
            color: "#fff",
          }}
        >
          {totalProducts}
        </h1>
      </div>

      <div
        style={{
          background: "rgba(255,255,255,0.06)",
          backdropFilter: "blur(18px)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: "24px",
          padding: "30px",
          boxShadow:
            "0 8px 30px rgba(255,105,180,0.08)",
        }}
      >
        <h3
          style={{
            color: "#ffcad4",
            marginBottom: "12px",
            fontWeight: "500",
          }}
        >
          Total Quantity
        </h3>

        <h1
          style={{
            fontSize: "42px",
            color: "#fff",
          }}
        >
          {totalQuantity}
        </h1>
      </div>
    </div>

    <div
      style={{
        marginBottom: "30px",
      }}
    >
      <input
        type="text"
        placeholder="Search products..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          width: "100%",
          padding: "18px 20px",
          borderRadius: "18px",
          border:
            "1px solid rgba(255,255,255,0.08)",
          background: "rgba(255,255,255,0.06)",
          backdropFilter: "blur(18px)",
          color: "white",
          fontSize: "16px",
          outline: "none",
          boxShadow:
            "0 8px 30px rgba(255,105,180,0.08)",
        }}
      />
    </div>
    <div
  style={{
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "24px",
    padding: "30px",
    marginBottom: "40px",
    backdropFilter: "blur(18px)",
    boxShadow: "0 8px 30px rgba(255,105,180,0.08)",
  }}
>
  <h2
    style={{
      marginBottom: "20px",
      color: "#ffe4ec",
    }}
  >
    Product Categories
  </h2>

  <div style={{ width: "100%", height: "320px" }}>
    <ResponsiveContainer>
      <PieChart>
        <Pie
          data={categoryData}
          dataKey="value"
          nameKey="name"
          outerRadius={110}
          label
        >
          {categoryData.map((entry, index) => (
            <Cell
              key={index}
              fill={
                COLORS[index % COLORS.length]
              }
            />
          ))}
        </Pie>

        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  </div>
</div>
    {loading ? (
      <h2
        style={{
          marginBottom: "25px",
          color: "#ffd6e7",
          fontSize: "28px",
        }}
      >
        Loading Products...
      </h2>
    ) : (
      <h2
        style={{
          marginBottom: "25px",
          color: "#ffe4ec",
          fontSize: "28px",
        }}
      >
        Products
      </h2>
    )}

    <div
      style={{
        display: "grid",
        gridTemplateColumns:
          "repeat(auto-fit, minmax(280px, 1fr))",
        gap: "25px",
      }}
    >
      {(products || [])
        .filter((product) =>
  (product?.productName || "")
    .toLowerCase()
    .includes(search.toLowerCase())
)
        .map((product) => (
          <div
  key={product.id}
  onMouseEnter={(e) => {
    e.currentTarget.style.transform =
      "translateY(-10px)";
    e.currentTarget.style.boxShadow =
      "0 20px 40px rgba(255,105,180,0.18)";
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.transform =
      "translateY(0px)";
    e.currentTarget.style.boxShadow =
      "0 8px 30px rgba(255,105,180,0.08)";
  }}
  style={{
    background: "rgba(255,255,255,0.06)",
    border:
      "1px solid rgba(255,255,255,0.08)",
    borderRadius: "24px",
    padding: "25px",
    backdropFilter: "blur(18px)",
    boxShadow:
      "0 8px 30px rgba(255,105,180,0.08)",
    transition: "all 0.3s ease",
    cursor: "pointer",
  }}
>
            <h2
              style={{
                color: "#fff",
                marginBottom: "10px",
                fontSize: "24px",
              }}
            >
              {product.productName}
            </h2>

            <p
              style={{
                color: "#d6d6d6",
                marginBottom: "8px",
              }}
            >
              SKU: {product.skuCode}
            </p>

            <p
              style={{
                color: "#d6d6d6",
                marginBottom: "8px",
              }}
            >
              Category: {product.category}
            </p>

            <p
              style={{
                color: "#ffd6e7",
                fontWeight: "600",
                marginBottom: "8px",
              }}
            >
              ₹ {product.price}
            </p>

            <p
              style={{
                color: "#fff",
              }}
            >
              Quantity: {product.quantity}
            </p>

            <button
              onClick={() => {
                setEditingId(product.id);

                setNewProduct({
                  productName: product.productName,
                  skuCode: product.skuCode,
                  category: product.category,
                  price: product.price,
                  quantity: product.quantity,
                });

                setShowForm(true);
              }}
              style={{
                marginTop: "18px",
                width: "100%",
                padding: "12px",
                border: "none",
                borderRadius: "14px",
                background:
                  "rgba(0,180,255,0.18)",
                color: "white",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px",
                fontSize: "15px",
                marginBottom: "10px",
              }}
            >
              <FaEdit />
              Edit Product
            </button>

            <button
              onClick={() => {
                axios
                  .delete(
                    `https://skyhavenbackend.onrender.com/api/products/${product.id}`
                  )
                  .then(() => {
                    setProducts(
                      products.filter(
                        (item) =>
                          item.id !== product.id
                      )
                    );
                    toast.success("Product deleted 🗑️");
                  })
                  .catch((error) => {
                    console.error(
                      "Delete error:",
                      error
                    );
                  });
              }}
              style={{
                marginTop: "10px",
                width: "100%",
                padding: "12px",
                border: "none",
                borderRadius: "14px",
                background:
                  "rgba(255,0,80,0.18)",
                color: "white",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px",
                fontSize: "15px",
              }}
            >
              <FaTrash />
              Delete Product
            </button>
          </div>
                    ))}
        </div>
      </div>
      <ToastContainer
  position="top-right"
  autoClose={2500}
  theme="dark"
/>
</div>
  );
}