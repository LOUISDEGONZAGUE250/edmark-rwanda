require('dotenv').config();
const fs = require("fs");
const path = require("path");
const express = require("express");
const cors = require("cors");
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const { initializeDatabase } = require("./db");

const app = express();
const PORT = process.env.PORT || 3000;
const frontendDir = path.join(__dirname, "..", "frontend");

app.use(cors());
app.use(express.json());
app.use(express.static(frontendDir));

// Security and logging
app.use(helmet());
app.use(morgan('dev'));
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 200 });
app.use(limiter);

// Routes
const productRoutes = require("./routes/products");
const orderRoutes = require("./routes/orders");
const authRoutes = require("./routes/auth");
const distributorsRoutes = require("./routes/distributors");
const contactRoutes = require("./routes/contact");
const testimonialsRoutes = require("./routes/testimonials");

app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/distributors", distributorsRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/testimonials", testimonialsRoutes);

app.get("/", (req, res) => {
    res.sendFile(path.join(frontendDir, "index.html"));
});

app.get("/:page", (req, res, next) => {
    const page = req.params.page;
    const filePath = path.join(frontendDir, `${page}.html`);
    if (fs.existsSync(filePath)) {
        return res.sendFile(filePath);
    }
    next();
});

initializeDatabase().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}).catch((error) => {
    console.error("Failed to initialize database:", error.message);
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
});