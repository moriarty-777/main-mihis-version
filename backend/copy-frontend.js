const fs = require("fs");
const path = require("path");
const { rimraf } = require("rimraf");
const ncp = require("ncp").ncp;

// Correct the paths to point to the right directories
const publicDir = path.join(__dirname, "src", "public"); // backend/src/public
const distDir = path.join(__dirname, "..", "frontend", "dist", "frontend"); // frontend/dist/frontend

// Remove public directory
rimraf(publicDir)
  .then(() => {
    // Create public directory
    fs.mkdir(publicDir, { recursive: true }, (err) => {
      if (err) {
        console.error("Failed to create public directory:", err);
        process.exit(1);
      }

      // Copy dist to public
      ncp(distDir, publicDir, (err) => {
        if (err) {
          console.error("Failed to copy frontend build:", err);
          process.exit(1);
        }
        console.log("Frontend build copied successfully!");
      });
    });
  })
  .catch((err) => {
    console.error("Failed to remove public directory:", err);
    process.exit(1);
  });
