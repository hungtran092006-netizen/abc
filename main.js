const API = `http://localhost:3000`;
const productsList = document.getElementById("productList");
const productAddForm = document.getElementById("productAddForm");
const productEditForm = document.getElementById("productEditForm");
const signupForm = document.getElementById("signupForm");
const signinForm = document.getElementById("signinForm");
const userInfo = document.getElementById("user-info");
const idProduct = new URLSearchParams(window.location.search).get("id");

// ==== Kiểm tra user đăng nhập ====
if (userInfo) {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) window.location.replace("./signin.html");

    userInfo.innerHTML = `
        <span class="me-2" id="user">${user.email}</span>
        <button class="btn btn-primary" onclick="logout()">Đăng xuất</button>
    `;
}

// ==== Nếu có ID, load thông tin sản phẩm để sửa ====
if (idProduct) {
    axios.get(`${API}/products/${idProduct}`).then(response => {
        const data = response.data;
        document.getElementById("name").value = data.title;
        document.getElementById("price").value = data.price;
        document.getElementById("quantity").value = data.quantity;
        document.getElementById("category").value = data.category;
        document.getElementById("image").value = data.imageUrl;
    });
}

// ==== Gắn sự kiện cho form ====
if (productEditForm) {
    productEditForm.addEventListener("submit", (e) => {
        e.preventDefault();
        updateProduct();
    });
}
if (productAddForm) {
    productAddForm.addEventListener("submit", (e) => {
        e.preventDefault();
        addProduct();
    });
}
if (signupForm) {
    signupForm.addEventListener("submit", (e) => {
        e.preventDefault();
        signup();
    });
}
if (signinForm) {
    signinForm.addEventListener("submit", (e) => {
        e.preventDefault();
        signin();
    });
}

// ==== Các hàm ====
const logout = () => {
    localStorage.removeItem("user");
    window.location.replace("./signin.html");
};

const signup = () => {
    axios.post(`${API}/signup`, {
        username: document.getElementById("username").value,
        email: document.getElementById("email").value,
        password: document.getElementById("password").value,
    })
        .then(() => {
            console.log("Đăng ký thành công");
            window.location.replace("./signin.html");
        })
        .catch(() => console.log("Đăng ký thất bại!"));
};

const signin = () => {
    axios.post(`${API}/signin`, {
        email: document.getElementById("email").value,
        password: document.getElementById("password").value,
    })
        .then((response) => {
            localStorage.setItem("user", JSON.stringify(response.data.user));
            window.location.href = "./index.html";
        })
        .catch(() => console.log("Đăng nhập thất bại!"));
};

const updateProduct = () => {
    axios.put(`${API}/products/${idProduct}`, {
        title: document.getElementById("name").value,
        price: document.getElementById("price").value,
        quantity: document.getElementById("quantity").value,
        category: document.getElementById("category").value,
        imageUrl: document.getElementById("image").value,
    })
        .then(() => {
            console.log("Cập nhật sản phẩm thành công");
            window.location.href = "./index.html";
        })
        .catch(() => console.log("Cập nhật thất bại!"));
};

const addProduct = () => {
    axios.post(`${API}/products`, {
        title: document.getElementById("name").value,
        price: document.getElementById("price").value,
        quantity: document.getElementById("quantity").value,
        category: document.getElementById("category").value,
        imageUrl: document.getElementById("image").value,
    })
        .then(() => {
            console.log("Thêm sản phẩm thành công");
            window.location.href = "./index.html";
        })
        .catch(() => console.log("Thêm sản phẩm thất bại!"));
};

const deleteProduct = (id) => {
    const isConfirm = window.confirm("Bạn có chắc chắn muốn xóa không?");
    if (!isConfirm) return;

    axios.delete(`${API}/products/${id}`)
        .then(() => {
            console.log("Xóa sản phẩm thành công");
            renderProduct();
        })
        .catch(() => console.log("Xóa sản phẩm thất bại!"));
};

const renderProduct = () => {
    axios.get(`${API}/products`).then((response) => {
        if (!productsList) return;
        productsList.innerHTML = response.data.map((item, index) => `
            <tr>
                <td>${index + 1}</td>
                <td><img width="50" src="${item.imageUrl}" alt="${item.title}" /></td>
                <td>${item.title}</td>
                <td>${item.price}</td>
                <td>${item.quantity}</td>
                <td>${item.category}</td>
                <td>
                    <a href="./edit.html?id=${item.id}" class="btn btn-primary">Sửa</a>
                    <button class="btn btn-danger" onclick="deleteProduct('${item.id}')">Xóa</button>
                </td>
            </tr>
        `).join("");
    });
};

renderProduct();
