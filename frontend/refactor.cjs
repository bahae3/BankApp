
const fs = require("fs");
const path = require("path");

const clientPages = ["Account", "Balance", "Beneficiaries", "Card", "Dashboard", "Deposit", "Loans", "Transactions", "Transfer"];
const adminPages = ["AdminDashboard", "AdminLayout", "AdminLogin", "ClientsAdmin", "DepositsAdmin", "LoanRequestsAdmin"];

const updateImports = (content, depth) => {
  const up = "../".repeat(depth);
  let newContent = content;
  // Update api, components, context, styles
  newContent = newContent.replace(/from "\.\.\/\.\.\/api/g, `from "${up}api`);
  newContent = newContent.replace(/from "\.\.\/\.\.\/components/g, `from "${up}components`);
  newContent = newContent.replace(/from "\.\.\/\.\.\/context/g, `from "${up}context`);
  newContent = newContent.replace(/from "\.\.\/\.\.\/styles/g, `from "${up}styles`);
  
  // Update intra-admin imports (AdminLayout)
  newContent = newContent.replace(/from "\.\/AdminLayout"/g, `from "../adminLayout/AdminLayout"`);
  
  // Update local css imports
  // If it was importing a css from the same folder, it stays the same, since we moved the css with it.
  return newContent;
};

// Process Client pages
clientPages.forEach(page => {
  const folderName = page.toLowerCase();
  const dir = path.join(__dirname, "src/pages/client", folderName);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  const jsxFile = path.join(__dirname, "src/pages/client", `${page}.jsx`);
  if (fs.existsSync(jsxFile)) {
    let content = fs.readFileSync(jsxFile, "utf8");
    content = updateImports(content, 3); // from src/pages/client/folder -> src is 3 levels up
    fs.writeFileSync(path.join(dir, `${page}.jsx`), content);
    fs.unlinkSync(jsxFile);
  }

  const cssFile = path.join(__dirname, "src/pages/client", `${page}.css`);
  if (fs.existsSync(cssFile)) {
    fs.renameSync(cssFile, path.join(dir, `${page}.css`));
  }
});

// Process Admin pages
adminPages.forEach(page => {
  const folderName = page.charAt(0).toLowerCase() + page.slice(1);
  const dir = path.join(__dirname, "src/pages/admin", folderName);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  const jsxFile = path.join(__dirname, "src/pages/admin", `${page}.jsx`);
  if (fs.existsSync(jsxFile)) {
    let content = fs.readFileSync(jsxFile, "utf8");
    content = updateImports(content, 3);
    fs.writeFileSync(path.join(dir, `${page}.jsx`), content);
    fs.unlinkSync(jsxFile);
  }

  const cssFile = path.join(__dirname, "src/pages/admin", `${page}.css`);
  if (fs.existsSync(cssFile)) {
    fs.renameSync(cssFile, path.join(dir, `${page}.css`));
  }
});

console.log("Files moved and internal imports updated.");

