import { useState, useEffect, useRef } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
FaBox,
FaWarehouse,
FaChartBar,
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
LineChart,
Line,
XAxis,
YAxis,
CartesianGrid,
} from "recharts";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Login from "./Login";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";


export default function App() {
const [products, setProducts] = useState([]);
const [darkMode, setDarkMode] =
useState(true);
const [orders, setOrders] = useState([]);
const [showOrderForm, setShowOrderForm] = useState(false);

const [selectedProduct, setSelectedProduct] =
useState(null);

const [orderData, setOrderData] =
useState({
customerName: "",
customerPhone: "",
customerEmail:"",
customerAddress: "",
city: "",
pincode: "",
paymentMethod: "Cash on Delivery",
quantity: 1
});
const [activityLogs, setActivityLogs] = useState(
JSON.parse(localStorage.getItem("activityLogs")) || []
);
const [search, setSearch] = useState("");
const downloadInvoice = (order) => {

const doc = new jsPDF();

doc.setFontSize(22);
doc.text(
"SkyHaven Invoice",
20,
20
);

doc.setFontSize(14);

doc.text(
`Tracking ID: ${order.trackingId}`,
20,
40
);

doc.text(
`Customer: ${order.customerName}`,
20,
55
);

doc.text(
`Phone: ${order.customerPhone}`,
20,
70
);

doc.text(
`Address: ${order.customerAddress}`,
20,
85
);

doc.text(
`City: ${order.city}`,
20,
100
);

doc.text(
`Pincode: ${order.pincode}`,
20,
115
);

doc.text(
`Product: ${order.productName}`,
20,
130
);

doc.text(
`Quantity: ${order.quantity}`,
20,
145
);

doc.text(
`Payment: ${order.paymentMethod}`,
20,
160
);

doc.text(
`Status: ${order.status}`,
20,
175
);

doc.save(
`${order.trackingId}.pdf`
);

};
const [selectedCategory, setSelectedCategory] =
  useState("All");

const [sortOption, setSortOption] =
  useState("");
const [loading, setLoading] = useState(true);
const [showForm, setShowForm] = useState(false);
const [editingId, setEditingId] = useState(null);

const [newProduct, setNewProduct] = useState({
productName: "",
skuCode: "",
category: "",
price: "",
quantity: "",
imageUrl: "",

});
const [isLoggedIn, setIsLoggedIn] =
  useState(
    localStorage.getItem("isLoggedIn") ===
      "true"
  );
  const [userRole, setUserRole] =
  useState(
    localStorage.getItem("role") || ""
  );
  const dashboardRef = useRef(null);
const productsRef = useRef(null);
const analyticsRef = useRef(null);
const inventoryRef = useRef(null);
const scrollToSection = (ref) => {
  ref.current?.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
};

useEffect(() => {
    if(
!localStorage.getItem("token")
){
return;
}
  axios.get(
  "https://skyhavenbackend.onrender.com/api/products",
  {
    headers: {
      Authorization:
        "Bearer " +
        localStorage.getItem("token"),
    },
  }
)
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

    if (
        error.response &&
        (error.response.status === 401 ||
         error.response.status === 403)
    ) {
        alert("Session expired. Please login again.");

        localStorage.removeItem("token");
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("role");

        window.location.href = "/";
    }

    setLoading(false);
});
}, []);
useEffect(() => {
    if(
!localStorage.getItem("token")
){
return;
}

axios.get(
userRole === "Admin"
? "https://skyhavenbackend.onrender.com/api/orders"
: `https://skyhavenbackend.onrender.com/api/orders/user/${localStorage.getItem("username")}`,
{
headers:{
Authorization:
"Bearer " +
localStorage.getItem("token")
}
}
)
.then((response)=>{
setOrders(response.data);
})
.catch((error)=>{

console.log(error);

if(
error.response &&
(
error.response.status === 401 ||
error.response.status === 403
)
){

alert(
"Session expired. Please login again."
);

localStorage.clear();

window.location.reload();

}

});

},[]);

const totalProducts = products?.length || 0;

const totalQuantity = (products || []).reduce(
(sum, item) => sum + Number(item.quantity),
0
);
const lowStockCount = (products || []).filter(
(item) => Number(item.quantity) < 5
).length;
useEffect(() => {
  if (lowStockCount > 0) {
    toast.warning(
      `${lowStockCount} item(s) are low in stock ⚠`
    );
  }
}, [lowStockCount]);
const highestPriceProduct =
  [...products].sort(
    (a,b) => b.price - a.price
  )[0];

const cheapestProduct =
  [...products].sort(
    (a,b) => a.price - b.price
  )[0];

const averagePrice =
  products.length
    ? (
        products.reduce(
          (sum,item)=>
            sum + Number(item.price),
          0
        ) / products.length
      ).toFixed(2)
    : 0;
const filteredProducts =
  products
    .filter((product) => {

      if (
        selectedCategory !== "All" &&
        product.category !==
          selectedCategory
      ) {
        return false;
      }

      return product.productName
        .toLowerCase()
        .includes(
          search.toLowerCase()
        );
    });
    const totalRevenue =
orders.reduce(

(sum,order)=>{

const product =
products.find(
(p)=>
p.productName ===
order.productName
);

return sum +
(
product
? product.price *
order.quantity
: 0
);

},

0

);

if (sortOption === "priceLow") {
  filteredProducts.sort(
    (a,b) =>
      a.price - b.price
  );
}

if (sortOption === "priceHigh") {
  filteredProducts.sort(
    (a,b) =>
      b.price - a.price
  );
}
const orderCounts = {};

orders.forEach((order)=>{

if(
orderCounts[order.productName]
){

orderCounts[
order.productName
]++;

}else{

orderCounts[
order.productName
] = 1;

}

});

const mostOrderedProduct =
Object.keys(orderCounts)
.reduce(

(a,b)=>
orderCounts[a] >
orderCounts[b]
? a
: b,

Object.keys(orderCounts)[0]

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

const revenueData = orders.map(
(order,index)=>({

name:
`Order ${index + 1}`,

revenue:

(
products.find(
(p)=>
p.productName ===
order.productName
)?.price || 0
)

* order.quantity

})
);
const COLORS = [
  darkMode
? "#ffb6c1"
: "#111827",
  darkMode
? "#ffd6e7"
: "#111827",
  darkMode
? "#ffc0cb"
: "#111827",
  "#ff69b4",
  darkMode
? "#ffe4ec"
: "#111827",
];
const getProductImage = (productName) => {
  const name = productName.toLowerCase();

  if (name.includes("iphone") || name.includes("phone"))
    return "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400";

  if (name.includes("laptop"))
    return "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400";

  if (name.includes("mouse"))
    return "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400";

  if (name.includes("keyboard"))
    return "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=400";

  return "https://images.unsplash.com/photo-1560393464-5c69a73c5770?w=400";
};
const exportPDF = () => {
  const doc = new jsPDF();

  doc.setFontSize(20);
  doc.text("SkyHaven Report", 20, 20);

  doc.setFontSize(12);
  doc.text(
    `Total Products: ${totalProducts}`,
    20,
    40
  );

  doc.text(
    `Total Quantity: ${totalQuantity}`,
    20,
    50
  );

  doc.text(
    `Low Stock Items: ${lowStockCount}`,
    20,
    60
  );

  autoTable(doc, {
    startY: 80,
    head: [[
      "Product",
      "Category",
      "Price",
      "Quantity"
    ]],
    body: products.map((item) => [
      item.productName,
      item.category,
      `Rs. ${item.price}`,
      item.quantity
    ]),
  });

  doc.save(
    "SkyHaven-Warehouse-Report.pdf"
  );
};
const exportExcel = () => {
  const data = products.map((item) => ({
    Product: item.productName,
    Category: item.category,
    Price: `Rs. ${item.price}`,
    Quantity: item.quantity,
  }));

  const worksheet =
    XLSX.utils.json_to_sheet(data);

  const workbook =
    XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(
    workbook,
    worksheet,
    "Products"
  );

  const excelBuffer =
    XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

  const fileData = new Blob(
    [excelBuffer],
    {
      type:
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    }
  );

  saveAs(
    fileData,
    "SkyHaven-Warehouse-Report.xlsx"
  );
};
if (!isLoggedIn) {
  return (
    <Login
  onLogin={(role) => {
    localStorage.setItem(
      "isLoggedIn",
      "true"
    );

    localStorage.setItem(
      "role",
      role
    );

    setUserRole(role);
    setIsLoggedIn(true);
  }}
/>
  );
}

return (
<div
style={{
minHeight: "100vh",

background:
darkMode
? "#0f0f0f"
: "#f8fafc",
display: "flex",
color: "white",
fontFamily: "Poppins, sans-serif",
overflow: "hidden",
position: "relative",
}}
>

{showOrderForm && (
<div
style={{
position:"fixed",
top:0,
left:0,
width:"100%",
height:"100%",
background:"rgba(0,0,0,0.7)",
display:"flex",
justifyContent:"center",
alignItems:"center",
zIndex:2000
}}
>

<div
style={{
width:"400px",
padding:"30px",
borderRadius:"24px",
background:"rgba(255,255,255,0.08)",
backdropFilter:"blur(20px)"
}}
>

<h2
style={{
marginBottom:"20px",
color:
darkMode
? darkMode
? "#ffd6e7"
: "#111827"
: "#1e293b"
}}
>
Create Order
</h2>

<input
type="text"
placeholder="Customer Name"
value={orderData.customerName}
onChange={(e)=>
setOrderData({
...orderData,
customerName:e.target.value
})
}
style={{
width:"100%",
padding:"14px",
marginBottom:"15px",
borderRadius:"14px"
}}
/>
<input
type="email"
placeholder="Email Address"
value={orderData.customerEmail}
onChange={(e)=>
setOrderData({
...orderData,
customerEmail:e.target.value
})
}
style={{
width:"100%",
padding:"14px",
marginBottom:"15px",
borderRadius:"14px"
}}
/>
<input
type="text"
placeholder="Phone Number"
value={orderData.customerPhone}
onChange={(e)=>
setOrderData({
...orderData,
customerPhone:e.target.value
})
}
style={{
width:"100%",
padding:"14px",
marginBottom:"15px",
borderRadius:"14px"
}}
/>

<input
type="text"
placeholder="Address"
value={orderData.customerAddress}
onChange={(e)=>
setOrderData({
...orderData,
customerAddress:e.target.value
})
}
style={{
width:"100%",
padding:"14px",
marginBottom:"15px",
borderRadius:"14px"
}}
/>

<input
type="text"
placeholder="City"
value={orderData.city}
onChange={(e)=>
setOrderData({
...orderData,
city:e.target.value
})
}
style={{
width:"100%",
padding:"14px",
marginBottom:"15px",
borderRadius:"14px"
}}
/>

<input
type="text"
placeholder="Pincode"
value={orderData.pincode}
onChange={(e)=>
setOrderData({
...orderData,
pincode:e.target.value
})
}
style={{
width:"100%",
padding:"14px",
marginBottom:"15px",
borderRadius:"14px"
}}
/>

<select
value={orderData.paymentMethod}
onChange={(e)=>
setOrderData({
...orderData,
paymentMethod:e.target.value
})
}
style={{
width:"100%",
padding:"14px",
marginBottom:"15px",
borderRadius:"14px"
}}
>

<option>
Cash on Delivery
</option>

</select>
<input
type="number"
placeholder="Quantity"
value={orderData.quantity}
onChange={(e)=>
setOrderData({
...orderData,
quantity:e.target.value
})
}
style={{
width:"100%",
padding:"14px",
marginBottom:"15px",
borderRadius:"14px"
}}
/>

<button
onClick={() => {
    if (
!orderData.customerName ||
!orderData.customerEmail ||
!orderData.customerPhone ||
!orderData.customerAddress ||
!orderData.city ||
!orderData.pincode ||
!orderData.paymentMethod ||
!orderData.quantity
) {
toast.error("Please fill all details");
return;
}
if(
orderData.quantity <= 0
){

alert(
"Quantity must be greater than 0"
);

return;

}

axios.post(
"https://skyhavenbackend.onrender.com/api/orders",
{
customerName:
orderData.customerName,
username:
localStorage.getItem("username"),

customerPhone:
orderData.customerPhone,
customerEmail:
orderData.customerEmail,

customerAddress:
orderData.customerAddress,

city:
orderData.city,

pincode:
orderData.pincode,

paymentMethod:
orderData.paymentMethod,

productName:
selectedProduct.productName,

quantity:
orderData.quantity
},
{
headers:{
Authorization:
"Bearer " +
localStorage.getItem("token")
}
}
)

.then((response)=>{

setOrders([
...orders,
response.data
]);axios.get(
"https://skyhavenbackend.onrender.com/api/products",
{
headers:{
Authorization:
"Bearer " +
localStorage.getItem("token")
}
}
)
.then((res)=>{
setProducts(res.data);
});

toast.success(
`Order placed 🎉 Tracking ID: ${response.data.trackingId}`
);

setShowOrderForm(false);

setOrderData({
customerName:"",
quantity:1
});

})

.catch((error)=>{

console.log(error);

if(
error.response &&
(
error.response.status === 401 ||
error.response.status === 403
)
){

alert(
"Session expired. Please login again."
);

localStorage.clear();

window.location.reload();

}

});

}}
style={{
width:"100%",
padding:"14px",
border:"none",
borderRadius:"14px",
background:"rgba(0,255,120,0.18)",
color:
darkMode
? "white"
: "#1e293b",
cursor:"pointer"
}}
>
Create Order
</button>
<button
onClick={() => {

setShowOrderForm(false);

setOrderData({
customerName: "",
customerPhone: "",
customerAddress: "",
city: "",
pincode: "",
paymentMethod:
"Cash on Delivery",
quantity: 1
});

}}
style={{
width:"100%",
padding:"14px",
border:"none",
borderRadius:"14px",
background:
"rgba(255,80,80,0.18)",
color:
darkMode
? "white"
: "#111827",
fontSize:"16px",
cursor:"pointer",
marginTop:"12px"
}}
>
Cancel
</button>
</div>
</div>
)}
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
      width:
window.innerWidth < 768
? "0px"
: "260px",
      background: "rgba(255,255,255,0.05)",
      backdropFilter: "blur(20px)",
      borderRight: "1px solid rgba(255,255,255,0.08)",
      padding: "30px 20px",
      zIndex: 2,
    }}
  >
    <h1
      style={{
        fontSize:
window.innerWidth < 768
? "18px"
: "28px",
        marginBottom: "50px",
        color: darkMode
? "#ffd6e7"
: "#111827",
        fontWeight: "600",
        letterSpacing: "1px",
      }}
    >
      {
window.innerWidth < 768
? "Sky"
: "SkyHaven"
}
    </h1>

    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        fontSize: "17px",
      }}
    >
        </div>
        </div>
     

  {/* Main Content */}

  <div
    style={{
      flex: 1,
      padding:
window.innerWidth < 768
? "20px"
: "40px",
      zIndex: 2,
    }}
  >
    <h1
      style={{
        fontSize:
window.innerWidth < 768
? "32px"
: "42px",
        marginBottom: "10px",
        color: darkMode
? "#ffe4ec"
: "#111827",
        fontWeight: "600",
      }}
    >
      Smart Warehouse
    </h1>

    <p
      style={{
        color:
darkMode
? "#cfcfcf"
: "#374151",
        marginBottom: "40px",
        fontSize: "16px",
      }}
    >
      Elegant inventory management dashboard
    </p>
    <button
  onClick={() => {
  localStorage.removeItem("isLoggedIn");
  localStorage.removeItem("role");
  localStorage.removeItem("token");

  setIsLoggedIn(false);
}}
  style={{
    padding: "12px 20px",
    border: "none",
    borderRadius: "14px",
    background: "rgba(255,0,80,0.18)",
    color: "white",
    cursor: "pointer",
    marginBottom: "30px",
    fontSize: "15px",
  }}
>
  Logout
</button>
<button
  onClick={exportPDF}
  style={{
    padding: "12px 20px",
    border: "none",
    borderRadius: "14px",
    background: "rgba(0,180,255,0.18)",
    color: "white",
    cursor: "pointer",
    marginBottom: "30px",
    marginLeft:
window.innerWidth < 768
? "0px"
: "15px",
    fontSize: "15px",
  }}
>
  📄 Export PDF
</button>
<button
  onClick={exportExcel}
  style={{
    padding: "12px 20px",
    border: "none",
    borderRadius: "14px",
    background: "rgba(0,180,100,0.18)",
    color: "white",
    cursor: "pointer",
    marginBottom: "30px",
    marginLeft:
window.innerWidth < 768
? "0px"
: "15px",
    fontSize: "15px",
  }}
>
  📊 Export Excel
</button>
<button
onClick={() =>
setDarkMode(!darkMode)
}
style={{
padding:"14px 22px",
border:"none",
borderRadius:"16px",
background:
darkMode
? "rgba(255,255,255,0.08)"
: "rgba(255,105,180,0.18)",

color:
darkMode
? "white"
: "#ff4d8d",

cursor:"pointer",
fontWeight:"bold"
}}
>
{
darkMode
? "☀ Light Mode"
: "🌙 Dark Mode"
}
</button>

    {userRole !== "User" && (
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
    )}

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
              color: darkMode
? "#ffe4ec"
: "#111827",
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
            "imageUrl"
          ].map((field) => (
            <input
              key={field}
              type="text"
              placeholder={
field === "imageUrl"
? "Paste Image URL"
: field
}
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
                color:
darkMode
? "white"
: "#111827",
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
                  axios.put(
  `https://skyhavenbackend.onrender.com/api/products/${editingId}`,
  newProduct,
  {
    headers: {
      Authorization:
        "Bearer " +
        localStorage.getItem("token"),
    },
  }
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
                      setActivityLogs((prev) => {
const updated = [
`Edited ${newProduct.productName} at ${new Date().toLocaleTimeString()}`,
...prev,
];

localStorage.setItem(
"activityLogs",
JSON.stringify(updated)
);

return updated;
});
                      toast.success("Product updated ✨");
                    })
                    .catch((error) => {
                      console.error("Update error:", error);
                    });
                } else {
                  axios.post(
  "https://skyhavenbackend.onrender.com/api/products",
  newProduct,
  {
    headers: {
      Authorization:
        "Bearer " +
        localStorage.getItem("token"),
    },
  }
)
                    .then((response) => {
                      setProducts([
                        ...products,
                        response.data,
                      ]);

                      setNewProduct({
  productName: product.productName,
  skuCode: product.skuCode,
  category: product.category,
  price: product.price,
  quantity: product.quantity,
  imageUrl: product.imageUrl || "",
});

                      setShowForm(false);
                      setActivityLogs((prev) => {
const updated = [
`Added ${newProduct.productName} at ${new Date().toLocaleTimeString()}`,
...prev,
];

localStorage.setItem(
"activityLogs",
JSON.stringify(updated)
);

return updated;
});
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
          background:
darkMode
? "rgba(255,255,255,0.06)"
: "rgba(255,255,255,0.75)",
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
            color:
darkMode
? "#fff"
: "#111827",
          }}
        >
          {totalProducts}
        </h1>
      </div>

      <div
        style={{
          background:
darkMode
? "rgba(255,255,255,0.06)"
: "rgba(255,255,255,0.75)",
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
            color:
darkMode
? "#fff"
: "#111827",
          }}
        >
          {totalQuantity}
        </h1>
      </div>
    </div>
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
      background:
darkMode
? "rgba(255,255,255,0.06)"
: "rgba(255,255,255,0.75)",
      border: "1px solid rgba(255,255,255,0.08)",
      borderRadius: "24px",
      padding: "25px",
    }}
  >
    <h3
style={{
color:
darkMode
? "#ffd6e7"
: "#111827"
}}
>💎 Most Expensive</h3>
    <h2>
      {highestPriceProduct?.productName || "N/A"}
    </h2>
    <p
style={{
color:
darkMode
? "white"
: "#111827"
}}
>
      Rs. {highestPriceProduct?.price}
    </p>
  </div>

  <div
    style={{
      background:
darkMode
? "rgba(255,255,255,0.06)"
: "rgba(255,255,255,0.75)",
      border: "1px solid rgba(255,255,255,0.08)",
      borderRadius: "24px",
      padding: "25px",
    }}
  >
    <h3
style={{
color:
darkMode
? "#ffd6e7"
: "#111827"
}}
>💰 Cheapest</h3>
    <h2>
      {cheapestProduct?.productName || "N/A"}
    </h2>
    <p
style={{
color:
darkMode
? "white"
: "#111827"
}}
>
      Rs. {cheapestProduct?.price}
    </p>
  </div>

  <div
    style={{
      background:
darkMode
? "rgba(255,255,255,0.06)"
: "rgba(255,255,255,0.75)",
      border: "1px solid rgba(255,255,255,0.08)",
      borderRadius: "24px",
      padding: "25px",
    }}
  >
    <h3
style={{
color:
darkMode
? "#ffd6e7"
: "#111827"
}}
>📊 Average Price</h3>
    <h2>
      Rs. {averagePrice}
    </h2>
  </div>
  <div
style={{
background:
darkMode
? "rgba(255,255,255,0.06)"
: "rgba(255,255,255,0.75)",
border: "1px solid rgba(255,255,255,0.08)",
borderRadius: "24px",
padding: "25px",
}}
>
<h3
style={{
color:
darkMode
? "#ffd6e7"
: "#111827"
}}
>💰 Total Revenue</h3>

<h2>
Rs. {totalRevenue}
</h2>
</div>
</div>
<div
style={{
background:
darkMode
? "rgba(255,255,255,0.06)"
: "rgba(255,255,255,0.75)",
border: "1px solid rgba(255,255,255,0.08)",
borderRadius: "24px",
padding: "25px",
}}
>
<h3
style={{
color:
darkMode
? "#ffd6e7"
: "#111827"
}}
>🔥 Most Ordered</h3>

<h2>
{mostOrderedProduct || "N/A"}
</h2>

<p
style={{
color:
darkMode
? "white"
: "#111827"
}}
>
{
orderCounts[mostOrderedProduct] || 0
}
Orders
</p>
</div>
     <div
  style={{
    background: "rgba(255,80,80,0.08)",
    backdropFilter: "blur(18px)",
    border: "1px solid rgba(255,80,80,0.2)",
    borderRadius: "24px",
    padding: "30px",
    boxShadow:
      "0 8px 30px rgba(255,80,80,0.15)",
  }}
>
  <h3
    style={{
      color:
darkMode
? "#ffb3c6"
: "#111827",
      marginBottom: "12px",
      fontWeight: "500",
    }}
  >
    Low Stock Items
  </h3>

  <h1
    style={{
      fontSize: "42px",
      color:
darkMode
? "#fff"
: "#111827",
    }}
  >
    {lowStockCount}
  </h1>
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
          background:
darkMode
? "rgba(255,255,255,0.06)"
: "rgba(255,255,255,0.75)",
          backdropFilter: "blur(18px)",
          color:
darkMode
? "white"
: "#111827",
          fontSize: "16px",
          outline: "none",
          boxShadow:
            "0 8px 30px rgba(255,105,180,0.08)",
        }}
      />
    </div>
    <div
  style={{
    display: "flex",
    gap: "15px",
    marginBottom: "30px",
  }}
>
  <select
    value={selectedCategory}
    onChange={(e) =>
      setSelectedCategory(
        e.target.value
      )
    }
    style={{
      padding: "12px",
      borderRadius: "12px",
      background:
darkMode
? "#222"
: "white",

color:
darkMode
? "white"
: "#111827",
      border: "none",
    }}
  >
    <option>All</option>
    <option>Electronics</option>
    <option>Beauty</option>
    <option>Fashion</option>
    <option>Grocery</option>
  </select>

  <select
    value={sortOption}
    onChange={(e) =>
      setSortOption(
        e.target.value
      )
    }
    style={{
      padding: "12px",
      borderRadius: "12px",
      background:
darkMode
? "#222"
: "white",

color:
darkMode
? "white"
: "#111827",
      border: "none",
    }}
  >
    <option value="">
      Sort By
    </option>

    <option value="priceLow">
      Price ↑
    </option>

    <option value="priceHigh">
      Price ↓
    </option>
  </select>
</div>
    <div
  style={{
    background:
darkMode
? "rgba(255,255,255,0.06)"
: "rgba(255,255,255,0.75)",
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
      color: darkMode
? "#ffe4ec"
: "#111827",
    }}
  >
    Product Categories
  </h2>

  <div
style={{
width: "100%",
height:
window.innerWidth < 768
? "220px"
: "320px"
}}
>
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
<div
style={{
background:
darkMode
? "rgba(255,255,255,0.06)"
: "rgba(255,255,255,0.75)",
border: "1px solid rgba(255,255,255,0.08)",
borderRadius: "24px",
padding: "30px",
marginBottom: "40px",
backdropFilter: "blur(18px)",
boxShadow:
"0 8px 30px rgba(255,105,180,0.08)",
}}
>

<h2
style={{
marginBottom:"20px",
color:
darkMode
? darkMode
? "#ffe4ec"
: "#111827"
: "#111827"
}}
>
📈 Revenue Trend
</h2>

<div
style={{
width:"100%",
height:"320px"
}}
>

<ResponsiveContainer>

<LineChart
data={revenueData}
>

<CartesianGrid
strokeDasharray="3 3"
stroke="#444"
/>

<XAxis
dataKey="name"
stroke={
darkMode
? "#fff"
: "#111827"
}
/>

<YAxis
stroke={
darkMode
? "#fff"
: "#111827"
}
/>

<Tooltip />

<Line
type="monotone"
dataKey="revenue"
stroke="#ff69b4"
strokeWidth={3}
/>

</LineChart>

</ResponsiveContainer>

</div>

</div>
    {loading ? (
      <h2
        style={{
          marginBottom: "25px",
          color: darkMode
? "#ffd6e7"
: "#111827",
          fontSize: "28px",
        }}
      >
        Loading Products...
      </h2>
    ) : (
      <h2
        style={{
          marginBottom: "25px",
          color: darkMode
? "#ffe4ec"
: "#111827",
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
window.innerWidth < 768
? "1fr"
: "repeat(auto-fit, minmax(320px, 1fr))",
        gap: "25px",
      }}
    >
      {(filteredProducts || []).map((product) => (
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
    background:
darkMode
? "rgba(255,255,255,0.06)"
: "rgba(255,255,255,0.75)",
    border:
      "1px solid rgba(255,255,255,0.08)",
    borderRadius: "24px",
    padding:
window.innerWidth < 768
? "20px"
: "25px",
    backdropFilter: "blur(18px)",
    boxShadow:
      "0 8px 30px rgba(255,105,180,0.08)",
    transition: "all 0.3s ease",
    cursor: "pointer",
  }}
>
            {Number(product.quantity) < 5 && (
  <div
    style={{
      background: "rgba(255,0,80,0.18)",
      color:
darkMode
? "#ffb3c6"
: "#111827",
      padding: "8px 12px",
      borderRadius: "12px",
      marginBottom: "12px",
      fontWeight: "bold",
      border: "1px solid rgba(255,0,80,0.4)"
    }}
  >
    ⚠ Low Stock
  </div>
)}
            <img
  src={
product.imageUrl
? product.imageUrl
: getProductImage(product.productName)
}
  alt={product.productName}
  style={{
    width: "100%",
    height:
window.innerWidth < 768
? "160px"
: "180px",
    objectFit: "cover",
    borderRadius: "16px",
    marginBottom: "15px",
  }}
/>
            <h2
              style={{
                color:
darkMode
? "#fff"
: "#111827",
                marginBottom: "10px",
                fontSize: "24px",
              }}
            >
              {product.productName}
            </h2>

            <p
              style={{
                color:
darkMode
? "#d6d6d6"
: "#4b5563",
                marginBottom: "8px",
              }}
            >
              SKU: {product.skuCode}
            </p>

            <p
              style={{
                color:
darkMode
? "#d6d6d6"
: "#4b5563",
                marginBottom: "8px",
              }}
            >
              Category: {product.category}
            </p>

            <p
              style={{
                color: darkMode
? "#ffd6e7"
: "#111827",
                fontWeight: "600",
                marginBottom: "8px",
              }}
            >
              ₹ {product.price}
            </p>

            <p
              style={{
                color:
darkMode
? "#fff"
: "#111827",
              }}
            >
              Quantity: {product.quantity}
            </p>
            {userRole !== "User" && (
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
                color:
darkMode
? "white"
: "#111827",
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
            )}
            {userRole === "Admin" && (
            <button
              onClick={() => {
                axios.delete(
  `https://skyhavenbackend.onrender.com/api/products/${product.id}`,
  {
    headers: {
      Authorization:
        "Bearer " +
        localStorage.getItem("token"),
    },
  }
)
                  .then(() => {
                    setProducts(
                      products.filter(
                        (item) =>
                          item.id !== product.id
                      )
                    );
                    setActivityLogs((prev) => {
const updated = [
`Deleted ${product.productName} at ${new Date().toLocaleTimeString()}`,
...prev,
];

localStorage.setItem(
"activityLogs",
JSON.stringify(updated)
);

return updated;
});
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
                color:
darkMode
? "white"
: "#111827",
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
            )}
            {userRole === "User" && (
<button
onClick={() => {

setSelectedProduct(product);

setShowOrderForm(true);

}}
style={{
marginTop: "18px",
width: "100%",
padding: "12px",
border: "none",
borderRadius: "14px",
background:
"rgba(0,255,120,0.18)",
color:
darkMode
? "white"
: "#111827",
cursor: "pointer",
fontSize: "15px",
}}
>
🛒 Buy Product
</button>
)}
          </div>
                    ))}
        </div>
      </div>
      <div
  style={{
    display:
window.innerWidth < 768
? "none"
: "block",
    marginTop: "40px",
    padding: "25px",
    borderRadius: "24px",
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.08)",
  }}
>
  <h2
    style={{
        display:
window.innerWidth < 768
? "none"
: "block",
      color: darkMode
? "#ffd6e7"
: "#111827",
      marginBottom: "20px",
    }}
  >
    📝 Activity Logs
  </h2>

  {activityLogs.length === 0 ? (
    <p style={{ color: "#aaa" }}>
      No activity yet
    </p>
  ) : (
    activityLogs.map((log, index) => (
      <p
        key={index}
        style={{
          color:
darkMode
? "#ddd"
: "#374151",
          marginBottom: "10px",
        }}
      >
        {
log.includes("Added")
? "🟢"
: log.includes("Edited")
? "🟡"
: log.includes("Deleted")
? "🔴"
: "📦"
}

{" "}

{log}
      </p>
    ))
  )}
</div>
<div
style={{
marginTop:"40px",
padding:"30px",
borderRadius:"24px",
background:"rgba(255,255,255,0.06)",
border:"1px solid rgba(255,255,255,0.08)"
}}
>

<h2
style={{
marginBottom:"20px",
color:
darkMode
? darkMode
? "#ffe4ec"
: "#111827"
: "#111827"
}}
>
📦 Orders
</h2>

{orders.map((order,index)=>(

<div
key={index}
style={{
padding:"18px",
marginBottom:"15px",
borderRadius:"18px",
background:"rgba(255,255,255,0.05)"
}}
>

<p
style={{
color:
darkMode
? "white"
: "#111827"
}}
>
<b>Tracking ID:</b>
{order.trackingId}
</p>

<p
style={{
color:
darkMode
? "white"
: "#111827"
}}
>
<b>Customer:</b>
{order.customerName}
</p>

<p
style={{
color:
darkMode
? "white"
: "#111827"
}}
>
<b>Product:</b>
{order.productName}
</p>

<p
style={{
color:
darkMode
? "white"
: "#111827"
}}
>
<b>Quantity:</b>
{order.quantity}
</p>

<p
style={{
color:
darkMode
? "white"
: "#111827"
}}
>
<b>Status:</b>
<span
style={{
marginLeft:"10px",
padding:"6px 12px",
borderRadius:"12px",
fontWeight:"bold",
background:
order.status.includes("Pending")
? "rgba(255,200,0,0.18)"
: order.status.includes("Shipped")
? "rgba(0,180,255,0.18)"
: "rgba(0,255,120,0.18)",

color:
order.status.includes("Pending")
? "#ffd43b"
: order.status.includes("Shipped")
? "#4dabf7"
: "#69db7c"
}}
>
{order.status}
</span>
{userRole === "Admin" && (
<select
value={order.status}

onChange={(e)=>{

axios.put(
`https://skyhavenbackend.onrender.com/api/orders/${order.id}/status?status=${e.target.value}`,
{},
{
headers:{
Authorization:
"Bearer " +
localStorage.getItem("token")
}
}
)

.then(()=>{

setOrders(
orders.map((item)=>

item.id === order.id
? {
...item,
status:e.target.value
}
: item

)
);

toast.success(
"Order status updated 🚚"
);

});

}}

style={{
marginLeft:"10px",
padding:"6px",
borderRadius:"10px"
}}
>

<option>
Pending
</option>

<option>
Shipped
</option>

<option>
Delivered
</option>

</select>
)}
</p>
<div
style={{
display:"flex",
alignItems:"center",
gap:"10px",
marginTop:"14px",
marginBottom:"14px"
}}
>

<div
style={{
padding:"6px 12px",
borderRadius:"10px",
background:
"rgba(255,200,0,0.18)",
color:"#ffd43b",
fontSize:"13px"
}}
>
Pending
</div>

<div
style={{
width:"30px",
height:"2px",
background:
order.status === "Shipped" ||
order.status === "Delivered"
? "#4dabf7"
: "#555"
}}
></div>

<div
style={{
padding:"6px 12px",
borderRadius:"10px",
background:
order.status === "Shipped" ||
order.status === "Delivered"
? "rgba(0,180,255,0.18)"
: "rgba(255,255,255,0.05)",

color:
order.status === "Shipped" ||
order.status === "Delivered"
? "#4dabf7"
: "#777",

fontSize:"13px"
}}
>
Shipped
</div>

<div
style={{
width:"30px",
height:"2px",
background:
order.status === "Delivered"
? "#69db7c"
: "#555"
}}
></div>

<div
style={{
padding:"6px 12px",
borderRadius:"10px",
background:
order.status === "Delivered"
? "rgba(0,255,120,0.18)"
: "rgba(255,255,255,0.05)",

color:
order.status === "Delivered"
? "#69db7c"
: "#777",

fontSize:"13px"
}}
>
Delivered
</div>

</div>
<button
onClick={() =>
downloadInvoice(order)
}
style={{
marginTop:"12px",
padding:"10px 16px",
border:"none",
borderRadius:"12px",
background:"rgba(0,180,255,0.18)",
color:
darkMode
? "white"
: "#111827",
cursor:"pointer"
}}
>
📄 Download Invoice
</button>

</div>

))}

</div>
      <ToastContainer
  position="top-right"
  autoClose={2500}
  theme="dark"
/>
</div>
  );
}