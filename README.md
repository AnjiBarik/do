# Getting Started with Create React App
This project was bootstrapped with [Create React App]
# eMarc
Welcome to the eMarc project! Explore our [live demo](https://anjibarik.github.io/do/) to see the application in action.

# Project Description

<p>
  The project is a web application built with React for interaction with Google Sheets via forms and scripts. Google Sheets is used for data storage, while Google Apps Script handles processing and interaction. The primary goal of the project is standardization, simplification, and code reduction.
</p>

## Main Features

1. **Frontend in React:**
    - Built-in browser features for language detection, timezone determination, hash generation, key encryption, and decryption.
    - Using a configuration JSON file from the project's public directory to modify primary settings without rebuilding the project.
    - Uploading icons and images (logos and products) from the repository is a priority (support for cloud storage uploads is provided).

2. **Google Sheets and Scripts:**
    - Using Google Sheets for data storage and Google Apps Script for processing.
    - Interaction through forms for standardization, simplification of deployment, and maintenance.

## Deployment Instructions

1. **Preparation of Google Sheets and Scripts:**
    - Create or upload templates for Google Sheets.
    - Create or upload templates for Google Scripts.
    - Grant general access to Google Scripts .

2. **Frontend Configuration:**
    - Create or modify the configuration JSON file with paths to the proxy and executable scripts.
    - If necessary, add logo and product images to the repository and replace icons.

3. **Data Entry:**
    - Fill in the Google Sheet with the price list.

4. **Launch and Maintenance:**
    - Ensure the functionality of the Google account.

## Benefits

- **Standardization:** Using a unified approach to interact with data through Google Sheets and scripts.
- **Simplified Deployment:** Easy deployment and configuration through public directories and repositories.
- **Code Minimization:** Reducing the amount of code by using built-in browser features and external configuration files.

<p>
  The project aims to ensure flexibility and ease of use, as well as to facilitate the process of maintenance and updates.
</p>

## Example
For an example of Google Sheets scripts and tables for deployment, see the samples folder of the project repository

## Program Description: Language Selection and Admin Panel
When a user performs a double click on the globe during language selection, an Admin Panel appears. This Admin Panel serves two main functions:

Key Generation:
The Admin Panel allows users to generate keys.
Two public keys (Key1 and Key2) are required for encryption using the RCA (Randomized Cipher Algorithm).
Users can insert these public keys into the corresponding cells of the price table.
These keys play a crucial role in securing sensitive data during communication or data storage.
Order Decryption and Filtering:
The Admin Panel provides tools for order management.
Users can decrypt and filter orders based on specific criteria.
Decryption ensures that authorized personnel can access order details securely.
Filtering options allow users to narrow down orders based on relevant parameters.
By combining language selection with administrative functionality, this program enhances security and streamlines order processing.
